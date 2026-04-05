import { PremiumSection } from "@/components/marketing/PremiumSection";
import { FeatureCard } from "@/components/marketing/FeatureCard";
import { getFeatures } from "@/lib/features/get-features";

export default async function FeaturesPage() {
  const features = await getFeatures({ limit: 24 });

  return (
    <PremiumSection eyebrow="Catalog" title="Feature unlock catalog">
      <div className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard key={feature.id} feature={feature} />
        ))}
      </div>
    </PremiumSection>
  );
}
