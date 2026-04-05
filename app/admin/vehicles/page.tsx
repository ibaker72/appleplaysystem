import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { vehicles } from "@/lib/data/mock";

export default function AdminVehiclesPage() {
  const rows = vehicles.map((vehicle) => ({ id: vehicle.id, brand: vehicle.brand, model: vehicle.model, year: vehicle.year, chassis: vehicle.chassis }));
  return <DashboardShell title="Admin · Vehicles"><AdminDataTable title="Vehicles" rows={rows} columns={[{ key: "id", label: "ID" }, { key: "brand", label: "Brand" }, { key: "model", label: "Model" }, { key: "year", label: "Year" }, { key: "chassis", label: "Chassis" }]} /></DashboardShell>;
}
