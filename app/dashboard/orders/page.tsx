import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { OrderStatusBadge } from "@/components/dashboard/OrderStatusBadge";
import { orders } from "@/lib/data/mock";

export default function OrdersPage() {
  return (
    <DashboardShell title="Orders">
      {orders.map((order) => (
        <div key={order.id} className="surface flex items-center justify-between rounded-premium p-5">
          <div>
            <p className="font-medium">Order {order.id}</p>
            <p className="text-sm text-white/65">${order.totalUsd} · {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
      ))}
    </DashboardShell>
  );
}
