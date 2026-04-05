import type { CompatibilityResult } from "@/types/compatibility";

export function CompatibilityResultCard({ result }: { result: CompatibilityResult }) {
  return (
    <div className="surface rounded-premium p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-white/50">Compatibility</p>
      <h2 className="mt-2 text-2xl font-semibold capitalize">{result.status.replace("_", " ")}</h2>
      {result.reason ? <p className="mt-3 text-sm text-white/70">{result.reason}</p> : null}
      <p className="mt-3 text-sm text-white/70">Estimated session time: {result.estimatedSessionMinutes} minutes</p>
      <p className="text-sm text-white/70">Estimated price: ${result.estimatedTotalUsd}</p>
    </div>
  );
}
