import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

async function getAnalytics() {
  const supabase = createAdminSupabaseClient();

  // Revenue by month (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const { data: paidOrders } = await supabase
    .from("orders")
    .select("total_usd, created_at")
    .eq("payment_status", "paid")
    .gte("created_at", sixMonthsAgo.toISOString())
    .order("created_at", { ascending: true });

  const revenueByMonth = new Map<string, number>();
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    revenueByMonth.set(key, 0);
  }
  for (const order of paidOrders ?? []) {
    const d = new Date(order.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (revenueByMonth.has(key)) {
      revenueByMonth.set(key, (revenueByMonth.get(key) ?? 0) + (order.total_usd ?? 0));
    }
  }

  // Top 5 features by order count
  const { data: featurePopularity } = await supabase
    .from("order_items")
    .select("feature_id, features:feature_id(name)");

  const featureCounts = new Map<string, { name: string; count: number }>();
  for (const item of featurePopularity ?? []) {
    const feature = item.features as { name: string } | null;
    const name = feature?.name ?? "Unknown";
    const existing = featureCounts.get(item.feature_id) ?? { name, count: 0 };
    existing.count++;
    featureCounts.set(item.feature_id, existing);
  }
  const topFeatures = Array.from(featureCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Recent orders (last 10)
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("id, status, payment_status, total_usd, created_at, customer_profiles:customer_id(full_name)")
    .order("created_at", { ascending: false })
    .limit(10);

  return {
    revenueByMonth: Array.from(revenueByMonth.entries()).map(([month, revenue]) => ({ month, revenue })),
    topFeatures,
    recentOrders: recentOrders ?? [],
  };
}

const statusStyles: Record<string, string> = {
  paid: "bg-emerald-400/15 text-emerald-200",
  pending: "bg-amber-400/15 text-amber-200",
  failed: "bg-red-400/15 text-red-200",
};

export default async function AnalyticsPage() {
  await requireAdmin();
  const { revenueByMonth, topFeatures, recentOrders } = await getAnalytics();
  const maxRevenue = Math.max(...revenueByMonth.map((m) => m.revenue), 1);

  return (
    <DashboardShell title="Admin · Analytics">
      <Link href="/admin" className="text-sm text-white/50 hover:text-white/80">
        &larr; Back to admin
      </Link>

      {/* Revenue by month */}
      <div className="surface rounded-premium p-5">
        <h2 className="mb-4 text-lg font-medium">Revenue by Month</h2>
        <div className="flex items-end gap-3" style={{ height: 180 }}>
          {revenueByMonth.map((m) => {
            const heightPct = maxRevenue > 0 ? (m.revenue / maxRevenue) * 100 : 0;
            return (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs text-white/60">${m.revenue.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
                <div
                  className="w-full rounded-t-lg bg-electric/30"
                  style={{ height: `${Math.max(heightPct, 2)}%` }}
                />
                <span className="text-xs text-white/40">{m.month.slice(5)}/{m.month.slice(2, 4)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top features */}
      <div className="surface rounded-premium p-5">
        <h2 className="mb-4 text-lg font-medium">Top Features by Orders</h2>
        {topFeatures.length === 0 ? (
          <p className="text-sm text-white/50">No order data yet.</p>
        ) : (
          <div className="space-y-3">
            {topFeatures.map((f, i) => {
              const maxCount = topFeatures[0]?.count ?? 1;
              const widthPct = (f.count / maxCount) * 100;
              return (
                <div key={i}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>{f.name}</span>
                    <span className="text-white/50">{f.count} orders</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-electric/40"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent orders */}
      <div className="surface rounded-premium p-5">
        <h2 className="mb-4 text-lg font-medium">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-white/50">
                <th className="pb-2 pr-4 font-medium">Order</th>
                <th className="pb-2 pr-4 font-medium">Customer</th>
                <th className="pb-2 pr-4 font-medium">Status</th>
                <th className="pb-2 pr-4 font-medium">Total</th>
                <th className="pb-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => {
                const profile = (order as Record<string, unknown>).customer_profiles as { full_name: string | null } | null;
                return (
                  <tr key={order.id} className="border-b border-white/5">
                    <td className="py-2 pr-4">
                      <Link href={`/admin/orders/${order.id}`} className="text-electric hover:underline">
                        {order.id.slice(0, 8)}
                      </Link>
                    </td>
                    <td className="py-2 pr-4 text-white/70">{profile?.full_name ?? "Unknown"}</td>
                    <td className="py-2 pr-4">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[order.payment_status] ?? "bg-white/10 text-white/60"}`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="py-2 pr-4">${(order.total_usd ?? 0).toFixed(2)}</td>
                    <td className="py-2 text-white/50">{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
