import { CheckoutButton } from "@/components/dashboard/CheckoutButton";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireUser } from "@/lib/auth/require-user";
import { getUserOrders } from "@/lib/orders/get-user-orders";

export default async function OrdersPage() {
  const user = await requireUser("/dashboard/orders");
  const orders = await getUserOrders(user.id);

  return (
    <DashboardShell title="Orders">
      {orders.length === 0 ? <EmptyState title="No orders yet" description="Build your first compatible package to create an order." /> : null}
      {orders.map((order) => (
        <div key={order.id} className="surface flex flex-col justify-between gap-3 rounded-premium p-5 md:flex-row md:items-center">
          <div>
            <p className="font-medium">Order {order.id.slice(0, 8)}</p>
            <p className="text-sm text-white/65">${order.total_usd} · {new Date(order.created_at).toLocaleDateString()}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs">{order.status}</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs">{order.payment_status}</span>
            {order.payment_status === "unpaid" ? <CheckoutButton orderId={order.id} /> : null}
          </div>
        </div>
      ))}
    </DashboardShell>
  );
}
