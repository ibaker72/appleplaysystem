import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";

export async function POST() {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Remote Feature Unlock Session" },
            unit_amount: 12900
          },
          quantity: 1
        }
      ],
      success_url: "http://localhost:3000/dashboard/orders",
      cancel_url: "http://localhost:3000/pricing"
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch {
    return NextResponse.json({ error: "Unable to create checkout session" }, { status: 500 });
  }
}
