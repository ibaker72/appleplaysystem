import { FeatureCard } from "@/components/marketing/FeatureCard";
import type { CompatibilityResult } from "@/lib/types/domain";

export function CompatibilityResultCard({ result }: { result: CompatibilityResult }) {
  return (
    <div className="space-y-6">
      <div className="surface rounded-premium p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-white/50">Compatibility</p>
        <h2 className="mt-2 text-2xl font-semibold capitalize">{result.status.replace("_", " ")}</h2>
        <p className="mt-3 text-sm text-white/70">Estimated session time: {result.estimatedMinutes} minutes</p>
        <p className="text-sm text-white/70">Estimated price: ${result.estimatedPrice}</p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-white/65">
          {result.setupRequirements.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
      {result.recommendedFeatures.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {result.recommendedFeatures.map((feature) => <FeatureCard key={feature.id} feature={feature} />)}
        </div>
      )}
    </div>
  );
}
