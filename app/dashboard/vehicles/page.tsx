import type { Metadata } from "next";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = { title: "Vehicles | Remote Code DE" };
import { EmptyState } from "@/components/ui/EmptyState";
import { requireUser } from "@/lib/auth/require-user";
import { getUserVehicles, deleteVehicle } from "@/lib/vehicles/save-vehicle";

export default async function VehiclesPage() {
  const user = await requireUser("/dashboard/vehicles");
  const vehicles = await getUserVehicles(user.id);

  async function handleDelete(formData: FormData) {
    "use server";
    const u = await requireUser("/dashboard/vehicles");
    const vehicleId = String(formData.get("vehicle_id")).trim();
    if (!vehicleId) return;
    await deleteVehicle(vehicleId, u.id);
    revalidatePath("/dashboard/vehicles");
  }

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
            <div className="mt-3 flex items-center gap-3">
              <Link
                href={`/check-compatibility/results?brand=${vehicle.brand}&model=${encodeURIComponent(vehicle.model)}&year=${vehicle.year}&chassis=${vehicle.chassis}&headUnit=${encodeURIComponent(vehicle.head_unit ?? "")}`}
                className="text-xs text-white/60 hover:text-white/80"
              >
                Check compatibility →
              </Link>
              <form action={handleDelete}>
                <input type="hidden" name="vehicle_id" value={vehicle.id} />
                <button
                  type="submit"
                  className="text-xs text-red-400/70 transition hover:text-red-300"
                  onClick={() => {}}
                >
                  Remove
                </button>
              </form>
            </div>
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
