import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/get-user";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createCheckoutSession } from "@/lib/stripe/create-checkout-session";

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    const { orderId } = (await request.json()) as { orderId?: string };

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const supabase = createAdminSupabaseClient();
    const { data: order, error } = await supabase
      .from("orders")
      .select("id, total_usd, customer_id")
      .eq("id", orderId)
      .eq("customer_id", user.id)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const session = await createCheckoutSession({
      orderId: order.id,
      totalUsd: order.total_usd,
      customerId: order.customer_id
    });

    await supabase
      .from("orders")
      .update({ stripe_checkout_session_id: session.id })
      .eq("id", order.id);

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create checkout session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
