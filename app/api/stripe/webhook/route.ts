import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe/client";
import { getStripeEnv } from "@/lib/env";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createBookingForOrder } from "@/lib/bookings/create-booking";

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
      return NextResponse.json({ error: msg }, { status: 400 });
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
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[stripe/webhook] Processing error:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Webhook processing failed" },
      { status: 400 }
    );
  }
}
