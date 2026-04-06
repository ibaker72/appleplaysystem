import type { Metadata } from "next";
import { PremiumSection } from "@/components/marketing/PremiumSection";
import { PricingCard } from "@/components/marketing/PricingCard";

export const metadata: Metadata = {
  title: "Pricing | Remote BMW Feature Unlock Packages",
  description: "Transparent pricing for remote BMW coding sessions. Single feature unlocks from $99, bundles, and premium packages available.",
};

export default function PricingPage() {
  return (
    <PremiumSection eyebrow="Pricing" title="Transparent packages for remote coding sessions">
      <div className="grid gap-4 md:grid-cols-3">
        <PricingCard name="Single Feature Unlock" price="$99+" forWho="For one targeted feature activation." duration="20–35 min" support="Standard" description={["One feature activation", "Session prep checklist", "Completion validation"]} />
        <PricingCard name="Popular Bundle" price="$249" forWho="For common comfort and media upgrades." duration="45–60 min" support="Priority" description={["Up to 3 features", "Guided setup call", "Post-session support"]} />
        <PricingCard name="Premium Coding Session" price="$399" forWho="For fully tailored configuration sessions." duration="90 min" support="White-glove" description={["Custom coding plan", "Technician consult", "Session recording + notes"]} />
      </div>
    </PremiumSection>
  );
}
