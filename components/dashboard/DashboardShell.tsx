export function DashboardShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="container-shell py-10">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <div className="mt-6 grid gap-4">{children}</div>
    </div>
  );
}
