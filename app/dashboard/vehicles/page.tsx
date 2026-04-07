import type { Metadata } from "next";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = { title: "Vehicles | Remote Code DE" };
import { EmptyState } from "@/components/ui/EmptyState";
import { requireUser } from "@/lib/auth/require-user";
import { getUserVehicles } from "@/lib/vehicles/save-vehicle";

export default async function VehiclesPage() {
  const user = await requireUser("/dashboard/vehicles");
  const vehicles = await getUserVehicles(user.id);

  return (
    <DashboardShell title="Vehicles">
      {vehicles.length === 0 ? (
        <EmptyState title="No vehicles saved" description="Save your vehicle from the compatibility checker to manage it here." />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="surface rounded-premium p-5">
            <h3 className="text-lg font-medium">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="mt-2 text-sm text-white/70">
              {vehicle.year} · {vehicle.chassis}
              {vehicle.head_unit ? ` · ${vehicle.head_unit}` : ""}
            </p>
            {vehicle.vin ? (
              <p className="mt-1 text-xs text-white/55">VIN: {vehicle.vin}</p>
            ) : null}
            <Link
              href={`/check-compatibility/results?brand=${vehicle.brand}&model=${encodeURIComponent(vehicle.model)}&year=${vehicle.year}&chassis=${vehicle.chassis}&headUnit=${encodeURIComponent(vehicle.head_unit ?? "")}`}
              className="mt-3 inline-block text-xs text-white/60 hover:text-white/80"
            >
              Check compatibility →
            </Link>
          </div>
        ))}
      </div>

      {vehicles.length > 0 ? (
        <Link
          href="/check-compatibility"
          className="inline-block text-sm text-white/50 hover:text-white/80"
        >
          + Add another vehicle
        </Link>
      ) : null}
    </DashboardShell>
  );
}
