import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe/client";
import { getStripeEnv } from "@/lib/env";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createBookingForOrder } from "@/lib/bookings/create-booking";
import { sendEmail } from "@/lib/email/send";
import { orderConfirmationEmail } from "@/lib/email/templates";

export async function POST(request: Request) {
  try {
    const stripe = getStripeClient();
    const { webhookSecret } = getStripeEnv();
    const body = await request.text();
    const signature = (await headers()).get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Signature verification failed";
      console.error("[stripe/webhook] Signature verification failed:", msg);
      return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.order_id;

      if (orderId) {
        const supabase = createAdminSupabaseClient();

        // Idempotency: only update if not already paid
        const { data: order } = await supabase
          .from("orders")
          .select("id, payment_status")
          .eq("id", orderId)
          .single();

        if (order && order.payment_status !== "paid") {
          await supabase
            .from("orders")
            .update({
              payment_status: "paid",
              status: "confirmed",
              stripe_checkout_session_id: session.id,
              stripe_payment_intent_id:
                typeof session.payment_intent === "string" ? session.payment_intent : null,
            })
            .eq("id", orderId);

          // createBookingForOrder is already idempotent (checks for existing booking)
          await createBookingForOrder(orderId);

          // Send order confirmation email (fire-and-forget)
          try {
            const { data: authUser } = await supabase.auth.admin.getUserById(
              (await supabase.from("orders").select("customer_id").eq("id", orderId).single()).data
                ?.customer_id ?? ""
            );
            const { data: orderItems } = await supabase
              .from("order_items")
              .select("features:feature_id(title)")
              .eq("order_id", orderId);
            const { data: orderData } = await supabase
              .from("orders")
              .select("total_usd")
              .eq("id", orderId)
              .single();
            const { data: profileData } = await supabase
              .from("customer_profiles")
              .select("full_name")
              .eq("user_id", authUser?.user?.id ?? "")
              .maybeSingle();

            if (authUser?.user?.email && orderData) {
              type FeatureJoin = { title: string } | null;
              const featureNames = (orderItems ?? []).map((item) => {
                const feature = (Array.isArray(item.features) ? item.features[0] : item.features) as FeatureJoin;
                return feature?.title ?? "Unknown";
              });
              const email = orderConfirmationEmail({
                orderId,
                totalUsd: orderData.total_usd ?? 0,
                featureNames,
                customerName: profileData?.full_name ?? "Customer",
              });
              sendEmail({ to: authUser.user.email, ...email });
            }
          } catch (emailErr) {
            console.error("[stripe/webhook] Email send error:", emailErr);
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[stripe/webhook] Processing error:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 400 }
    );
  }
}
