"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/button";
import { PremiumSection } from "@/components/marketing/PremiumSection";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
    if (Sentry.isInitialized()) {
      Sentry.captureException(error);
    }
  }, [error]);

  return (
    <html>
      <body>
        <PremiumSection eyebrow="Error" title="Something went wrong">
          <div className="surface rounded-premium p-6 text-sm text-white/70">
            <p>We couldn&apos;t complete that request. Please try again.</p>
            {error.digest ? <p className="mt-2 text-xs text-white/40">Reference: {error.digest}</p> : null}
            <Button className="mt-5" onClick={reset}>
              Try again
            </Button>
          </div>
        </PremiumSection>
      </body>
    </html>
  );
}
