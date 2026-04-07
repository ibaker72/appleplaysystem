import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminLoading() {
  return (
    <DashboardShell title="Admin Console">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    </DashboardShell>
  );
}
