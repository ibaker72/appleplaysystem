import { PremiumSection } from "@/components/marketing/PremiumSection";
import { Skeleton } from "@/components/ui/Skeleton";

export default function CompatibilityLoading() {
  return (
    <PremiumSection eyebrow="Compatibility" title="Check Your Vehicle">
      <div className="surface mx-auto max-w-lg space-y-4 rounded-premium p-6 md:p-8">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </PremiumSection>
  );
}
