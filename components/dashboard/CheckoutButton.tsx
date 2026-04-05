"use client";

import { useState } from "react";

export function CheckoutButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <button
        onClick={async () => {
          setLoading(true);
          setError(null);
          const response = await fetch("/api/stripe/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId })
          });
          const payload = await response.json();
          if (!response.ok || !payload.url) {
            setError(payload.error ?? "Unable to launch checkout");
            setLoading(false);
            return;
          }
          window.location.assign(payload.url);
        }}
        disabled={loading}
        className="rounded-xl bg-silver px-3 py-1.5 text-xs font-medium text-black"
      >
        {loading ? "Opening..." : "Pay now"}
      </button>
      {error ? <p className="mt-1 text-xs text-red-300">{error}</p> : null}
    </div>
  );
}
