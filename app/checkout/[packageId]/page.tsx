import { redirect } from "next/navigation";

/**
 * Legacy checkout page — the real checkout flow now goes through:
 * 1. /check-compatibility/results (select features → create order)
 * 2. /dashboard/orders (click "Pay now" → Stripe Checkout)
 *
 * Redirect visitors to the compatibility checker.
 */
export default function CheckoutPage() {
  redirect("/check-compatibility");
}
