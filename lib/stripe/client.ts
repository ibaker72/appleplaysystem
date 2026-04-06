import "server-only";
import Stripe from "stripe";
import { getStripeEnv } from "@/lib/env";

export function getStripeClient() {
  const { secretKey } = getStripeEnv();
  return new Stripe(secretKey, { apiVersion: "2025-02-24.acacia" });
}
