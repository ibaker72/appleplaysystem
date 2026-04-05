import type { CatalogFeature } from "@/lib/features/get-features";
import { Button } from "@/components/ui/button";

export function FeatureCard({ feature }: { feature: CatalogFeature }) {
  return (
    <article className="surface rounded-premium p-5">
      <p className="text-xs uppercase tracking-wide text-white/50">{feature.brand}</p>
      <h3 className="mt-2 text-lg font-medium">{feature.title}</h3>
      <p className="mt-2 text-sm text-white/65">{feature.description}</p>
      <div className="mt-4 space-y-1 text-xs text-white/60">
        <p>Estimated session: {feature.sessionMinutes} min</p>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <p className="text-sm">From <span className="font-semibold text-white">${feature.priceUsd}</span></p>
        <Button href={`/checkout/${feature.id}`}>Select</Button>
      </div>
    </article>
  );
}
