import { getStripeClient } from "@/lib/stripe/client";
import { getSiteUrl } from "@/lib/env";

interface CheckoutInput {
  orderId: string;
  totalUsd: number;
  customerId: string;
}

export async function createCheckoutSession(input: CheckoutInput) {
  const stripe = getStripeClient();
  const siteUrl = getSiteUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${siteUrl}/dashboard/orders?checkout=success`,
    cancel_url: `${siteUrl}/dashboard/orders?checkout=cancelled`,
    metadata: {
      order_id: input.orderId,
      customer_id: input.customerId
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: input.totalUsd * 100,
          product_data: {
            name: "Remote coding session package",
            description: `Order ${input.orderId}`
          }
        }
      }
    ]
  });

  return session;
}
