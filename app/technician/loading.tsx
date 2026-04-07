import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Skeleton } from "@/components/ui/Skeleton";

export default function TechnicianLoading() {
  return (
    <DashboardShell title="Technician Portal">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    </DashboardShell>
  );
}
