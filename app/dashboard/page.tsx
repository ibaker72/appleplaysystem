import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { SessionCard } from "@/components/dashboard/SessionCard";
import { SetupChecklist } from "@/components/dashboard/SetupChecklist";
import { VehicleCard } from "@/components/dashboard/VehicleCard";
import { bookings, vehicles } from "@/lib/data/mock";

export default function DashboardPage() {
  return (
    <DashboardShell title="Owner Dashboard">
      <div className="grid gap-4 md:grid-cols-2">
        <SessionCard booking={bookings[0]} />
        <SetupChecklist />
      </div>
      <VehicleCard vehicle={vehicles[0]} />
    </DashboardShell>
  );
}
