const brandAccents: Record<string, { border: string; color: string }> = {
  BMW: { border: "border-l-blue-500", color: "#1a73e8" },
  Audi: { border: "border-l-red-500", color: "#c41e3a" },
  "Mercedes-Benz": { border: "border-l-gray-400", color: "#a0a0a0" },
};

function BrandMonogram({ name }: { name: string }) {
  if (name === "BMW") {
    return (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="shrink-0">
        <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="1.5" className="text-blue-400/60" />
        <text x="14" y="15" textAnchor="middle" dominantBaseline="central" fill="currentColor" className="text-blue-300" fontSize="7" fontWeight="600">BMW</text>
      </svg>
    );
  }
  if (name === "Audi") {
    return (
      <svg width="28" height="28" viewBox="0 0 40 16" fill="none" className="shrink-0">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" className="text-red-400/60" />
        <circle cx="16" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" className="text-red-400/60" />
        <circle cx="24" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" className="text-red-400/60" />
        <circle cx="32" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" className="text-red-400/60" />
      </svg>
    );
  }
  if (name === "Mercedes-Benz") {
    return (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="shrink-0">
        <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="1.2" className="text-gray-400/60" />
        <line x1="14" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="1.2" className="text-gray-400/60" />
        <line x1="14" y1="14" x2="3.6" y2="22" stroke="currentColor" strokeWidth="1.2" className="text-gray-400/60" />
        <line x1="14" y1="14" x2="24.4" y2="22" stroke="currentColor" strokeWidth="1.2" className="text-gray-400/60" />
      </svg>
    );
  }
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/20 text-xs font-semibold text-white/60">
      {name.charAt(0)}
    </div>
  );
}

export function BrandPill({ name, status }: { name: string; status: string }) {
  const accent = brandAccents[name];
  return (
    <div className={`flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm ${accent ? `border-l-2 ${accent.border}` : ""}`}>
      <BrandMonogram name={name} />
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-xs text-white/60">{status}</p>
      </div>
    </div>
  );
}
