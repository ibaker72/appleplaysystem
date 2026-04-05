import type { Vehicle } from "@/lib/types/domain";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="surface rounded-premium p-5">
      <h3 className="text-lg font-medium">{vehicle.brand} {vehicle.model}</h3>
      <p className="mt-2 text-sm text-white/70">{vehicle.year} · {vehicle.chassis} · {vehicle.headUnit}</p>
      <p className="mt-1 text-xs text-white/55">VIN: {vehicle.vin ?? "Not added"}</p>
    </div>
  );
}
