import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUser } from "@/lib/auth/get-user";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createCheckoutSession, type LineItem } from "@/lib/stripe/create-checkout-session";
import { rateLimit } from "@/lib/rate-limit";

const checkoutSchema = z.object({
  orderId: z.string().uuid("Invalid order ID"),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { success } = rateLimit({ key: `checkout:${user.id}`, limit: 10, windowMs: 60_000 });
    if (!success) {
      return NextResponse.json({ error: "Too many requests. Please wait before trying again." }, { status: 429 });
    }

    const body = await request.json().catch(() => null);
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }

    const { orderId } = parsed.data;

    const supabase = createAdminSupabaseClient();
    const { data: order, error } = await supabase
      .from("orders")
      .select("id, total_usd, customer_id, payment_status")
      .eq("id", orderId)
      .eq("customer_id", user.id)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.payment_status === "paid") {
      return NextResponse.json({ error: "This order has already been paid" }, { status: 400 });
    }

    // Query order items with joined features for itemized checkout
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("price_usd, features!inner(title, description, session_minutes)")
      .eq("order_id", orderId);

    let lineItems: LineItem[] | undefined;
    if (orderItems && orderItems.length > 0) {
      lineItems = orderItems.map((item) => {
        const feature = Array.isArray(item.features) ? item.features[0] : item.features;
        return {
          name: feature.title as string,
          description: `${feature.description as string} (~${feature.session_minutes as number} min session)`,
          priceUsd: item.price_usd,
        };
      });
    }

    const session = await createCheckoutSession({
      orderId: order.id,
      totalUsd: order.total_usd,
      customerId: order.customer_id,
      lineItems,
    });

    // Store the checkout session ID on the order
    await supabase
      .from("orders")
      .update({ stripe_checkout_session_id: session.id })
      .eq("id", order.id);

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to create checkout session";
    console.error("[stripe/checkout]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
