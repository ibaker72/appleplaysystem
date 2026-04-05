export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="surface rounded-premium p-8 text-center">
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm text-white/60">{description}</p>
    </div>
  );
}
