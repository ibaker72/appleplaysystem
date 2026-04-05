import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireUser } from "@/lib/auth/require-user";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export default async function AdminCustomersPage() {
  await requireUser("/admin/customers");
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase
    .from("customer_profiles")
    .select("user_id, full_name, phone")
    .order("created_at", { ascending: false });

  const rows = (data ?? []).map((customer) => ({
    id: customer.user_id.slice(0, 8),
    name: customer.full_name ?? "-",
    phone: customer.phone ?? "-"
  }));

  return <DashboardShell title="Admin · Customers"><AdminDataTable title="Customers" rows={rows} columns={[{ key: "id", label: "User ID" }, { key: "name", label: "Name" }, { key: "phone", label: "Phone" }]} /></DashboardShell>;
}
