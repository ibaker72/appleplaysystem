import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireUser } from "@/lib/auth/require-user";
import { getUserVehicles } from "@/lib/vehicles/save-vehicle";

export default async function VehiclesPage() {
  const user = await requireUser("/dashboard/vehicles");
  const vehicles = await getUserVehicles(user.id);

  return (
    <DashboardShell title="Vehicles">
      {vehicles.length === 0 ? <EmptyState title="No vehicles saved" description="Save your vehicle from the compatibility checker to manage it here." /> : null}
      {vehicles.map((vehicle) => (
        <div key={vehicle.id} className="surface rounded-premium p-5">
          <h3 className="text-lg font-medium">{vehicle.brand} {vehicle.model}</h3>
          <p className="mt-2 text-sm text-white/70">{vehicle.year} · {vehicle.chassis} · {vehicle.head_unit}</p>
          <p className="mt-1 text-xs text-white/55">VIN: {vehicle.vin ?? "Not added"}</p>
        </div>
      ))}
    </DashboardShell>
  );
}
