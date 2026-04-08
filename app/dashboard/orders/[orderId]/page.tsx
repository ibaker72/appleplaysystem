import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { CheckoutButton } from "@/components/dashboard/CheckoutButton";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireUser } from "@/lib/auth/require-user";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const statusStyles: Record<string, string> = {
  draft: "bg-white/10 text-white/60",
  pending: "bg-amber-400/15 text-amber-200",
  confirmed: "bg-electric/15 text-electric",
  completed: "bg-emerald-400/15 text-emerald-200",
  cancelled: "bg-red-400/15 text-red-200",
};

const paymentStyles: Record<string, string> = {
  paid: "bg-emerald-400/15 text-emerald-200",
  unpaid: "bg-amber-400/15 text-amber-200",
  refunded: "bg-white/10 text-white/60",
  failed: "bg-red-400/15 text-red-200",
};

export default async function CustomerOrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const user = await requireUser("/dashboard/orders");
  const { orderId } = await params;
  if (!z.string().uuid().safeParse(orderId).success) notFound();
  const supabase = createAdminSupabaseClient();

  const { data: order } = await supabase
    .from("orders")
    .select("id, status, payment_status, total_usd, created_at")
    .eq("id", orderId)
    .eq("customer_id", user.id)
    .single();

  if (!order) {
    return (
      <DashboardShell title="Order Not Found">
        <div className="surface rounded-premium p-6 text-sm text-white/70">
          <p>This order could not be found or does not belong to your account.</p>
          <Link href="/dashboard/orders" className="mt-3 inline-block text-sm text-white/50 hover:text-white/80">
            ← Back to orders
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const [{ data: items }, { data: booking }] = await Promise.all([
    supabase
      .from("order_items")
      .select("id, price_usd, features(title, description, session_minutes)")
      .eq("order_id", orderId),
    supabase
      .from("bookings")
      .select("id, status, starts_at, order_id")
      .eq("order_id", orderId)
      .maybeSingle(),
  ]);

  return (
    <DashboardShell title="Order Detail">
      <Link href="/dashboard/orders" className="text-sm text-white/50 hover:text-white/80">
        ← Back to orders
      </Link>

      {/* Order header */}
      <div className="surface rounded-premium p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-medium">Order {order.id.slice(0, 8)}</h2>
            <p className="text-sm text-white/50">
              {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[order.status] ?? "bg-white/10 text-white/60"}`}
            >
              {order.status}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${paymentStyles[order.payment_status] ?? "bg-white/10 text-white/60"}`}
            >
              {order.payment_status}
            </span>
          </div>
        </div>
      </div>

      {/* Line items */}
      <div className="surface rounded-premium p-5">
        <h3 className="mb-3 text-sm font-medium text-white/70">Items</h3>
        {(items ?? []).length === 0 ? (
          <p className="text-sm text-white/40">No items.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-white/55">
              <tr>
                <th className="pb-2 pr-4 font-medium">Feature</th>
                <th className="pb-2 pr-4 font-medium">Session</th>
                <th className="pb-2 font-medium">Price</th>
              </tr>
            </thead>
            <tbody>
              {(items ?? []).map((item) => {
                type FeatureJoin = { title: string; description: string; session_minutes: number } | null;
                const feature = (Array.isArray(item.features) ? item.features[0] : item.features) as FeatureJoin;
                return (
                  <tr key={item.id} className="border-t border-white/5">
                    <td className="py-2 pr-4">
                      <p>{feature?.title ?? "Unknown"}</p>
                      {feature?.description ? (
                        <p className="text-xs text-white/40">{feature.description}</p>
                      ) : null}
                    </td>
                    <td className="py-2 pr-4">{feature?.session_minutes ?? "—"}m</td>
                    <td className="py-2">${item.price_usd}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-white/10">
                <td colSpan={2} className="py-2 pr-4 font-medium">
                  Total
                </td>
                <td className="py-2 font-medium">${order.total_usd}</td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      {/* Payment / actions */}
      <div className="surface rounded-premium p-5">
        <h3 className="mb-3 text-sm font-medium text-white/70">Payment</h3>
        <p className="text-sm">
          Status:{" "}
          <span
            className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${paymentStyles[order.payment_status] ?? "bg-white/10 text-white/60"}`}
          >
            {order.payment_status}
          </span>
        </p>
        {order.payment_status === "unpaid" ? (
          <div className="mt-3">
            <CheckoutButton orderId={order.id} />
          </div>
        ) : null}
      </div>

      {/* Booking / session info */}
      {order.payment_status === "paid" ? (
        <div className="surface rounded-premium p-5">
          <h3 className="mb-3 text-sm font-medium text-white/70">Session</h3>
          {booking ? (
            <div className="space-y-2 text-sm">
              <p>
                Status:{" "}
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs">
                  {booking.status}
                </span>
              </p>
              {booking.starts_at ? (
                <p>Scheduled: {new Date(booking.starts_at).toLocaleString()}</p>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href={`/booking/${order.id}`}
                  className="rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/80 transition hover:bg-white/10"
                >
                  View timeline
                </Link>
                <Link
                  href={`/setup-instructions/${order.id}`}
                  className="rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/80 transition hover:bg-white/10"
                >
                  Setup checklist
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-sm text-white/50">
              Your booking is being created. Please check back shortly.
            </p>
          )}
        </div>
      ) : null}
    </DashboardShell>
  );
}
