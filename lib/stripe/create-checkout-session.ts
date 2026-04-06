import "server-only";
import type Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe/client";
import { getSiteUrl } from "@/lib/env";

export interface LineItem {
  name: string;
  description?: string;
  priceUsd: number;
  quantity?: number;
}

interface CheckoutInput {
  orderId: string;
  totalUsd: number;
  customerId: string;
  lineItems?: LineItem[];
}

export async function createCheckoutSession(input: CheckoutInput) {
  if (input.totalUsd <= 0) {
    throw new Error("Order total must be greater than zero.");
  }

  const stripe = getStripeClient();
  const siteUrl = getSiteUrl();

  let stripeLineItems: Stripe.Checkout.SessionCreateParams.LineItem[];

  if (input.lineItems && input.lineItems.length > 0) {
    stripeLineItems = input.lineItems.map((item) => ({
      quantity: item.quantity ?? 1,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(item.priceUsd * 100),
        product_data: {
          name: item.name,
          ...(item.description ? { description: item.description } : {}),
        },
      },
    }));
  } else {
    stripeLineItems = [
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
    ];
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${siteUrl}/dashboard/orders?checkout=success`,
    cancel_url: `${siteUrl}/dashboard/orders?checkout=cancelled`,
    metadata: {
      order_id: input.orderId,
      customer_id: input.customerId,
    },
    line_items: stripeLineItems,
  });

  return session;
}
