import { PremiumSection } from "@/components/marketing/PremiumSection";
import { Skeleton } from "@/components/ui/Skeleton";

export default function FeaturesLoading() {
  return (
    <PremiumSection eyebrow="Features" title="Available coding features">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    </PremiumSection>
  );
}
