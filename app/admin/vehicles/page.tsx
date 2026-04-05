import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export default async function AdminVehiclesPage() {
  await requireAdmin();
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase
    .from("vehicles")
    .select("id, customer_id, brand, model, year, chassis, head_unit")
    .order("created_at", { ascending: false })
    .limit(100);

  const rows = (data ?? []).map((vehicle) => ({
    id: vehicle.id.slice(0, 8),
    customer: vehicle.customer_id.slice(0, 8),
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    chassis: vehicle.chassis,
  }));

  return (
    <DashboardShell title="Admin · Vehicles">
      <AdminDataTable
        title="Vehicles"
        rows={rows}
        columns={[
          { key: "id", label: "ID" },
          { key: "customer", label: "Customer" },
          { key: "brand", label: "Brand" },
          { key: "model", label: "Model" },
          { key: "year", label: "Year" },
          { key: "chassis", label: "Chassis" },
        ]}
      />
    </DashboardShell>
  );
}
