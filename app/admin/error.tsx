"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
    if (Sentry.isInitialized()) {
      Sentry.captureException(error);
    }
  }, [error]);

  return (
    <div className="container-shell py-10">
      <h1 className="text-3xl font-semibold">Admin Console</h1>
      <div className="mt-6 surface rounded-premium p-6 text-sm text-white/70">
        <p>Something went wrong loading this page.</p>
        {error.digest ? <p className="mt-2 text-xs text-white/40">Reference: {error.digest}</p> : null}
        <button
          onClick={reset}
          className="mt-4 rounded-xl bg-silver px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
