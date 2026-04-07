import type { Metadata } from "next";
import { PremiumSection } from "@/components/marketing/PremiumSection";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Page Not Found | Remote Code DE" };

export default function NotFound() {
  return (
    <PremiumSection eyebrow="404" title="Page not found">
      <div className="surface rounded-premium p-6 text-sm text-white/70">
        <p>The page you requested doesn&apos;t exist or may have moved.</p>
        <Button href="/" className="mt-5">
          Back to homepage
        </Button>
      </div>
    </PremiumSection>
  );
}
