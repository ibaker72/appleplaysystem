export default function LoadingResults() {
  return (
    <div className="container-shell py-20">
      <div className="surface mx-auto max-w-lg rounded-premium p-8 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-electric" />
        <p className="mt-4 text-sm text-white/60">Checking vehicle compatibility…</p>
      </div>
    </div>
  );
}
