import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export default async function AdminSessionsPage() {
  await requireAdmin();
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase
    .from("bookings")
    .select("id, order_id, starts_at, technician_id, status")
    .order("created_at", { ascending: false })
    .limit(100);

  const rows = (data ?? []).map((booking) => ({
    id: booking.id.slice(0, 8),
    orderId: booking.order_id.slice(0, 8),
    startsAt: booking.starts_at ? new Date(booking.starts_at).toLocaleString() : "Pending",
    technician: booking.technician_id?.slice(0, 8) ?? "Unassigned",
    status: booking.status,
  }));

  return (
    <DashboardShell title="Admin · Sessions">
      <AdminDataTable
        title="Sessions"
        rows={rows}
        columns={[
          { key: "id", label: "Session" },
          { key: "orderId", label: "Order" },
          { key: "startsAt", label: "Time" },
          { key: "technician", label: "Technician" },
          { key: "status", label: "Status" },
        ]}
      />
    </DashboardShell>
  );
}
