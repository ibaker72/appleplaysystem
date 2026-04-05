import { PremiumSection } from "@/components/marketing/PremiumSection";
import { FeatureCard } from "@/components/marketing/FeatureCard";
import { features } from "@/lib/data/mock";

export default function FeaturesPage() {
  return (
    <PremiumSection eyebrow="Catalog" title="Feature unlock catalog">
      <div className="grid gap-4 md:grid-cols-3">{features.map((feature) => <FeatureCard key={feature.id} feature={feature} />)}</div>
    </PremiumSection>
  );
}
