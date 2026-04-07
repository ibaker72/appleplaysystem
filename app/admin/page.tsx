import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const sections = [
  { label: "Orders", href: "/admin/orders", description: "View and manage all customer orders." },
  { label: "Sessions", href: "/admin/sessions", description: "Monitor booking and session status." },
  { label: "Vehicles", href: "/admin/vehicles", description: "Browse registered customer vehicles." },
  { label: "Features", href: "/admin/features", description: "View available feature catalog." },
  { label: "Customers", href: "/admin/customers", description: "Customer profile directory." },
  { label: "Analytics", href: "/admin/analytics", description: "Revenue, conversion, and feature popularity." },
];

async function getStats() {
  const supabase = createAdminSupabaseClient();

  const [ordersResult, paidResult, revenueResult, activeSessionsResult, completedSessionsResult] =
    await Promise.all([
      supabase.from("orders").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("id", { count: "exact", head: true }).eq("payment_status", "paid"),
      supabase.from("orders").select("total_usd").eq("payment_status", "paid"),
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .in("status", ["pending", "scheduled", "in_progress"]),
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("status", "completed"),
    ]);

  const totalOrders = ordersResult.count ?? 0;
  const paidOrders = paidResult.count ?? 0;
  const totalRevenue = (revenueResult.data ?? []).reduce(
    (sum, o) => sum + (o.total_usd ?? 0),
    0
  );
  const activeSessions = activeSessionsResult.count ?? 0;
  const completedSessions = completedSessionsResult.count ?? 0;
  const conversionRate = totalOrders > 0 ? ((paidOrders / totalOrders) * 100).toFixed(1) : "0";

  return { totalRevenue, totalOrders, paidOrders, conversionRate, activeSessions, completedSessions };
}

export default async function AdminPage() {
  await requireAdmin();
  const stats = await getStats();

  const kpis = [
    { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, description: "From paid orders" },
    { label: "Total Orders", value: stats.totalOrders.toString(), description: "All time" },
    { label: "Conversion Rate", value: `${stats.conversionRate}%`, description: `${stats.paidOrders} of ${stats.totalOrders} paid` },
    { label: "Active Sessions", value: stats.activeSessions.toString(), description: "Pending, scheduled, or in progress" },
    { label: "Completed Sessions", value: stats.completedSessions.toString(), description: "Successfully finished" },
  ];

  return (
    <DashboardShell title="Admin Console">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="surface rounded-premium p-5">
            <p className="text-sm text-white/60">{kpi.label}</p>
            <p className="mt-1 text-3xl font-semibold">{kpi.value}</p>
            <p className="mt-1 text-xs text-white/40">{kpi.description}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="surface rounded-premium p-5 transition hover:border-white/15"
          >
            <h3 className="font-medium">{section.label}</h3>
            <p className="mt-1 text-sm text-white/60">{section.description}</p>
          </Link>
        ))}
      </div>
    </DashboardShell>
  );
}
