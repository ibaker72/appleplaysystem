import Link from "next/link";
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

  const orders = data ?? [];

  return (
    <DashboardShell title="Admin · Orders">
      <section className="surface rounded-premium p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Orders</h2>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/50">
            {orders.length} {orders.length === 1 ? "record" : "records"}
          </span>
        </div>

        {orders.length === 0 ? (
          <p className="py-8 text-center text-sm text-white/40">No records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-white/55">
                <tr>
                  <th className="pb-3 pr-4 font-medium">Order</th>
                  <th className="pb-3 pr-4 font-medium">Customer</th>
                  <th className="pb-3 pr-4 font-medium">Vehicle</th>
                  <th className="pb-3 pr-4 font-medium">Order Status</th>
                  <th className="pb-3 pr-4 font-medium">Payment</th>
                  <th className="pb-3 pr-4 font-medium">Total</th>
                  <th className="pb-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-white/5">
                    <td className="py-3 pr-4">{order.id.slice(0, 8)}</td>
                    <td className="py-3 pr-4">{order.customer_id.slice(0, 8)}</td>
                    <td className="py-3 pr-4">{order.vehicle_id.slice(0, 8)}</td>
                    <td className="py-3 pr-4">{order.status}</td>
                    <td className="py-3 pr-4">{order.payment_status}</td>
                    <td className="py-3 pr-4">${order.total_usd}</td>
                    <td className="py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-electric hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </DashboardShell>
  );
}
