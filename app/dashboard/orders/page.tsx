import Link from "next/link";
import { CheckoutButton } from "@/components/dashboard/CheckoutButton";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireUser } from "@/lib/auth/require-user";
import { getUserOrders } from "@/lib/orders/get-user-orders";

const paymentStyles: Record<string, string> = {
  paid: "bg-emerald-400/15 text-emerald-200",
  unpaid: "bg-amber-400/15 text-amber-200",
  refunded: "bg-white/10 text-white/60",
  failed: "bg-red-400/15 text-red-200",
};

const statusStyles: Record<string, string> = {
  draft: "bg-white/10 text-white/60",
  pending: "bg-amber-400/15 text-amber-200",
  confirmed: "bg-electric/15 text-electric",
  completed: "bg-emerald-400/15 text-emerald-200",
  cancelled: "bg-red-400/15 text-red-200",
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const user = await requireUser("/dashboard/orders");
  const orders = await getUserOrders(user.id);
  const params = await searchParams;

  return (
    <DashboardShell title="Orders">
      {params.checkout === "success" ? (
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">
          Payment confirmed. Your session booking is being prepared.
        </div>
      ) : null}
      {params.checkout === "cancelled" ? (
        <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-200">
          Checkout was cancelled. You can pay anytime from this page.
        </div>
      ) : null}
      {params.created ? (
        <div className="rounded-xl border border-electric/20 bg-electric/10 p-4 text-sm text-electric">
          Order created. Complete checkout to begin your session.
        </div>
      ) : null}

      {orders.length === 0 ? (
        <EmptyState title="No orders yet" description="Build your first compatible package to create an order." />
      ) : null}

      {orders.map((order) => (
        <div
          key={order.id}
          className="surface flex flex-col justify-between gap-3 rounded-premium p-5 md:flex-row md:items-center"
        >
          <div>
            <p className="font-medium">Order {order.id.slice(0, 8)}</p>
            <p className="text-sm text-white/65">
              ${order.total_usd} · {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[order.status] ?? "bg-white/10 text-white/60"}`}>
              {order.status}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${paymentStyles[order.payment_status] ?? "bg-white/10 text-white/60"}`}>
              {order.payment_status}
            </span>
            {order.payment_status === "unpaid" ? <CheckoutButton orderId={order.id} /> : null}
            {order.payment_status === "paid" ? (
              <Link
                href={`/booking/${order.id}`}
                className="rounded-xl border border-white/20 bg-white/5 px-3 py-1.5 text-xs text-white/80 transition hover:bg-white/10"
              >
                View session
              </Link>
            ) : null}
          </div>
        </div>
      ))}
    </DashboardShell>
  );
}
