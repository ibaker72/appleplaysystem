import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireUser } from "@/lib/auth/require-user";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export default async function AdminVehiclesPage() {
  await requireUser("/admin/vehicles");
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase.from("vehicles").select("id, customer_id, brand, model, year, chassis").order("created_at", { ascending: false });
  const rows = (data ?? []).map((vehicle) => ({ id: vehicle.id.slice(0, 8), customer: vehicle.customer_id.slice(0, 8), brand: vehicle.brand, model: vehicle.model, year: vehicle.year, chassis: vehicle.chassis }));
  return <DashboardShell title="Admin · Vehicles"><AdminDataTable title="Vehicles" rows={rows} columns={[{ key: "id", label: "ID" }, { key: "customer", label: "Customer" }, { key: "brand", label: "Brand" }, { key: "model", label: "Model" }, { key: "year", label: "Year" }, { key: "chassis", label: "Chassis" }]} /></DashboardShell>;
}
