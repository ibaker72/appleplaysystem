import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getStripeClient } from "@/lib/stripe/client";

export async function GET() {
  const checks: Record<string, "ok" | "error"> = {
    supabase: "error",
    stripe: "error",
  };

  // Check Supabase
  try {
    const supabase = createAdminSupabaseClient();
    const { error } = await supabase.from("features").select("id").limit(1);
    checks.supabase = error ? "error" : "ok";
  } catch {
    checks.supabase = "error";
  }

  // Check Stripe
  try {
    const stripe = getStripeClient();
    await stripe.balance.retrieve();
    checks.stripe = "ok";
  } catch {
    checks.stripe = "error";
  }

  const allOk = checks.supabase === "ok" && checks.stripe === "ok";
  const allError = checks.supabase === "error" && checks.stripe === "error";
  const status = allOk ? "ok" : allError ? "error" : "degraded";
  const httpStatus = allError ? 503 : 200;

  return NextResponse.json(
    { status, checks, timestamp: new Date().toISOString() },
    {
      status: httpStatus,
      headers: { "Cache-Control": "no-store" },
    }
  );
}
