import type { Metadata } from "next";
import { PremiumSection } from "@/components/marketing/PremiumSection";
import { FeatureCard } from "@/components/marketing/FeatureCard";
import { getFeatures } from "@/lib/features/get-features";

export const metadata: Metadata = {
  title: "Feature Catalog | Remote Coding Options",
  description: "Browse available remote coding features including CarPlay activation, video in motion, infotainment customization, and more for German vehicles.",
};

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
