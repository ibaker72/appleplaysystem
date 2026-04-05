import type { CompatibilityResult } from "@/types/compatibility";

const statusConfig = {
  compatible: {
    label: "Compatible",
    bg: "bg-emerald-400/10 border-emerald-400/20",
    text: "text-emerald-200",
    dot: "bg-emerald-400",
  },
  not_supported: {
    label: "Not Supported",
    bg: "bg-white/5 border-white/10",
    text: "text-white/70",
    dot: "bg-white/40",
  },
} as const;

export function CompatibilityResultCard({ result }: { result: CompatibilityResult }) {
  const config = statusConfig[result.status];

  return (
    <div className={`surface rounded-premium border p-6 ${config.bg}`}>
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${config.dot}`} />
        <p className="text-xs uppercase tracking-[0.2em] text-white/50">Compatibility</p>
      </div>
      <h2 className={`mt-2 text-2xl font-semibold ${config.text}`}>{config.label}</h2>

      {result.reason ? <p className="mt-3 text-sm text-white/70">{result.reason}</p> : null}

      {result.matchedConfig ? (
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/55">
          <span className="rounded-full bg-white/5 px-2.5 py-1">{result.matchedConfig.brand}</span>
          <span className="rounded-full bg-white/5 px-2.5 py-1">{result.matchedConfig.model}</span>
          <span className="rounded-full bg-white/5 px-2.5 py-1">{result.matchedConfig.chassis}</span>
          {result.matchedConfig.headUnit ? (
            <span className="rounded-full bg-white/5 px-2.5 py-1">{result.matchedConfig.headUnit}</span>
          ) : null}
          <span className="rounded-full bg-white/5 px-2.5 py-1">
            {result.matchedConfig.minYear}–{result.matchedConfig.maxYear}
          </span>
        </div>
      ) : null}

      {result.supported ? (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/5 p-3">
            <p className="text-xs text-white/50">Est. session</p>
            <p className="mt-1 text-lg font-semibold">{result.estimatedSessionMinutes} min</p>
          </div>
          <div className="rounded-xl bg-white/5 p-3">
            <p className="text-xs text-white/50">Est. total</p>
            <p className="mt-1 text-lg font-semibold">${result.estimatedTotalUsd}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
