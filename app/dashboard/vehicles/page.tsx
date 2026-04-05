import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { VehicleCard } from "@/components/dashboard/VehicleCard";
import { vehicles } from "@/lib/data/mock";

export default function VehiclesPage() {
  return <DashboardShell title="Vehicles">{vehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}</DashboardShell>;
}
