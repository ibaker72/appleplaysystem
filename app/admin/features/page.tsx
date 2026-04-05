import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export default async function AdminFeaturesPage() {
  await requireAdmin();
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase
    .from("features")
    .select("id, brand, title, session_minutes, base_price_usd")
    .order("created_at", { ascending: false })
    .limit(100);

  const rows = (data ?? []).map((feature) => ({
    id: feature.id.slice(0, 8),
    title: feature.title,
    brand: feature.brand,
    time: `${feature.session_minutes}m`,
    price: `$${feature.base_price_usd}`,
  }));

  return (
    <DashboardShell title="Admin · Features">
      <AdminDataTable
        title="Features"
        rows={rows}
        columns={[
          { key: "id", label: "ID" },
          { key: "title", label: "Feature" },
          { key: "brand", label: "Brand" },
          { key: "time", label: "Session" },
          { key: "price", label: "Price" },
        ]}
      />
    </DashboardShell>
  );
}
