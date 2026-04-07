import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUser } from "@/lib/auth/get-user";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getStripeClient } from "@/lib/stripe/client";
import { getSiteUrl } from "@/lib/env";
import { rateLimit } from "@/lib/rate-limit";

const featureCheckoutSchema = z.object({
  featureId: z.string().uuid("Invalid feature ID"),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { success } = await rateLimit({ key: `feature-checkout:${user.id}`, limit: 10, windowMs: 60_000 });
    if (!success) {
      return NextResponse.json({ error: "Too many requests. Please wait before trying again." }, { status: 429 });
    }

    const body = await request.json().catch(() => null);
    const parsed = featureCheckoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }

    const { featureId } = parsed.data;

    const supabase = createAdminSupabaseClient();

    // Verify feature exists
    const { data: feature, error: featureError } = await supabase
      .from("features")
      .select("id, title, description, base_price_usd, session_minutes")
      .eq("id", featureId)
      .maybeSingle();

    if (featureError || !feature) {
      return NextResponse.json({ error: "Feature not found" }, { status: 404 });
    }

    if (feature.base_price_usd <= 0) {
      return NextResponse.json({ error: "Invalid feature price" }, { status: 400 });
    }

    // Clean up any previous unpaid orders for this exact feature from this user
    const { data: staleOrders } = await supabase
      .from("order_items")
      .select("order_id, orders!inner(id, customer_id, payment_status)")
      .eq("feature_id", featureId)
      .eq("orders.customer_id", user.id)
      .eq("orders.payment_status", "unpaid");

    if (staleOrders && staleOrders.length > 0) {
      const staleOrderIds = staleOrders.map((item) => item.order_id);
      await supabase.from("order_items").delete().in("order_id", staleOrderIds);
      await supabase.from("orders").delete().in("id", staleOrderIds);
    }

    // Check if user has a vehicle (required for order)
    const { data: vehicles } = await supabase
      .from("vehicles")
      .select("id")
      .eq("customer_id", user.id)
      .limit(1);

    const vehicleId = vehicles?.[0]?.id;

    if (!vehicleId) {
      return NextResponse.json(
        { error: "Please add a vehicle before purchasing. Go to Dashboard → Vehicles." },
        { status: 400 }
      );
    }

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: user.id,
        vehicle_id: vehicleId,
        status: "pending",
        payment_status: "unpaid",
        total_usd: feature.base_price_usd,
      })
      .select("id, total_usd")
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    // Create order item
    const { error: itemError } = await supabase.from("order_items").insert({
      order_id: order.id,
      feature_id: feature.id,
      price_usd: feature.base_price_usd,
    });

    if (itemError) {
      // Clean up the order if item creation fails
      await supabase.from("orders").delete().eq("id", order.id);
      return NextResponse.json({ error: "Failed to create order item" }, { status: 500 });
    }

    // Create Stripe checkout session with itemized line item
    const stripe = getStripeClient();
    const siteUrl = getSiteUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${siteUrl}/dashboard/orders?checkout=success`,
      cancel_url: `${siteUrl}/checkout/${feature.id}?checkout=cancelled`,
      metadata: {
        order_id: order.id,
        customer_id: user.id,
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(feature.base_price_usd * 100),
            product_data: {
              name: feature.title,
              description: `${feature.description} — ~${feature.session_minutes} min remote session`,
            },
          },
        },
      ],
    });

    // Store checkout session ID on order
    await supabase
      .from("orders")
      .update({ stripe_checkout_session_id: session.id })
      .eq("id", order.id);

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err) {
    console.error("[stripe/feature-checkout]", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Unable to create checkout session" }, { status: 500 });
  }
}
