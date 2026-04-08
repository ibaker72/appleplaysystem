import type { Metadata } from "next";
import Link from "next/link";
import { PremiumSection } from "@/components/marketing/PremiumSection";
import { PricingCard } from "@/components/marketing/PricingCard";

export const metadata: Metadata = {
  title: "Pricing | Remote Feature Unlock Packages",
  description: "Transparent pricing for remote vehicle coding sessions. Single feature unlocks from $99, bundles, and premium packages available.",
};

export default function PricingPage() {
  return (
    <PremiumSection eyebrow="Pricing" title="Transparent packages for remote coding sessions">
      <div className="grid gap-4 md:grid-cols-3">
        <PricingCard name="Single Feature Unlock" price="$99+" forWho="For one targeted feature activation." duration="20–35 min" support="Standard" description={["One feature activation", "Session prep checklist", "Completion validation"]} />
        <PricingCard name="Popular Bundle" price="$249" forWho="For common comfort and media upgrades." duration="45–60 min" support="Priority" description={["Up to 3 features", "Guided setup call", "Post-session support"]} />
        <PricingCard name="Premium Coding Session" price="$399" forWho="For fully tailored configuration sessions." duration="90 min" support="White-glove" description={["Custom coding plan", "Technician consult", "Session recording + notes"]} />
      </div>

      {/* CTA */}
      <div className="surface rounded-premium p-6 text-center">
        <p className="text-sm text-white/60">
          Final pricing depends on the features you select and your vehicle&apos;s configuration.
        </p>
        <p className="mt-1 text-xs text-white/40">
          Check your vehicle first to see exactly which features are available and what they cost.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link
            href="/check-compatibility"
            className="rounded-xl bg-silver px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white"
          >
            Check your vehicle compatibility
          </Link>
          <Link
            href="/features"
            className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10"
          >
            Browse all features
          </Link>
        </div>
      </div>
    </PremiumSection>
  );
}
