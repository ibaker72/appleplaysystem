import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Skeleton } from "@/components/ui/Skeleton";

export default function SessionsLoading() {
  return (
    <DashboardShell title="Sessions">
      <Skeleton className="h-44" />
      <Skeleton className="h-44" />
    </DashboardShell>
  );
}
