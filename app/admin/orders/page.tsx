import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export default async function AdminOrdersPage() {
  await requireAdmin();
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase
    .from("orders")
    .select("id, customer_id, vehicle_id, status, payment_status, total_usd, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  const rows = (data ?? []).map((order) => ({
    id: order.id.slice(0, 8),
    customer: order.customer_id.slice(0, 8),
    vehicle: order.vehicle_id.slice(0, 8),
    status: order.status,
    payment: order.payment_status,
    total: `$${order.total_usd}`,
  }));

  return (
    <DashboardShell title="Admin · Orders">
      <AdminDataTable
        title="Orders"
        rows={rows}
        columns={[
          { key: "id", label: "Order" },
          { key: "customer", label: "Customer" },
          { key: "vehicle", label: "Vehicle" },
          { key: "status", label: "Order Status" },
          { key: "payment", label: "Payment" },
          { key: "total", label: "Total" },
        ]}
      />
    </DashboardShell>
  );
}
