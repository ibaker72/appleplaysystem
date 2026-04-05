export function BrandPill({ name, status }: { name: string; status: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
      <p className="font-medium">{name}</p>
      <p className="text-xs text-white/60">{status}</p>
    </div>
  );
}
