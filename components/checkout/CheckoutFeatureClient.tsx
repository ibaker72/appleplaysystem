"use client";

import { useState } from "react";

interface Props {
  featureId: string;
  featureTitle: string;
  priceUsd: number;
}

export function CheckoutFeatureClient({ featureId, featureTitle, priceUsd }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/feature-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featureId }),
      });

      const payload = await res.json();

      if (!res.ok || !payload.url) {
        setError(payload.error ?? "Unable to start checkout. Please try again.");
        setLoading(false);
        return;
      }

      window.location.assign(payload.url);
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full rounded-xl bg-silver px-5 py-3 text-sm font-semibold text-black transition hover:bg-white disabled:opacity-50"
      >
        {loading ? "Preparing checkout..." : `Pay $${priceUsd} — ${featureTitle}`}
      </button>
      {error && (
        <p className="text-center text-xs text-red-300">{error}</p>
      )}
      <p className="text-center text-xs text-white/40">
        Secure payment via Stripe. You&apos;ll be redirected to complete payment.
      </p>
    </div>
  );
}
