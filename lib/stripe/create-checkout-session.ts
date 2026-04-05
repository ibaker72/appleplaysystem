import { getStripeClient } from "@/lib/stripe/client";
import { getSiteUrl } from "@/lib/env";

interface CheckoutInput {
  orderId: string;
  totalUsd: number;
  customerId: string;
}

export async function createCheckoutSession(input: CheckoutInput) {
  if (input.totalUsd <= 0) {
    throw new Error("Order total must be greater than zero.");
  }

  const stripe = getStripeClient();
  const siteUrl = getSiteUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${siteUrl}/dashboard/orders?checkout=success`,
    cancel_url: `${siteUrl}/dashboard/orders?checkout=cancelled`,
    metadata: {
      order_id: input.orderId,
      customer_id: input.customerId,
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(input.totalUsd * 100),
          product_data: {
            name: "Remote coding session package",
            description: `Order ${input.orderId.slice(0, 8)}`,
          },
        },
      },
    ],
  });

  return session;
}
