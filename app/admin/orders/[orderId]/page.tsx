import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { updateOrderStatus, updatePaymentStatus } from "@/lib/admin/order-actions";
import { createBookingForOrder } from "@/lib/bookings/create-booking";

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

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  await requireAdmin();
  const { orderId } = await params;
  const supabase = createAdminSupabaseClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (!order) {
    return (
      <DashboardShell title="Admin · Order Not Found">
        <div className="surface rounded-premium p-6 text-sm text-white/70">
          <p>Order not found.</p>
          <Link href="/admin/orders" className="mt-3 inline-block text-sm text-white/50 hover:text-white/80">
            ← Back to orders
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const [{ data: items }, { data: vehicle }, { data: profile }, { data: booking }] =
    await Promise.all([
      supabase
        .from("order_items")
        .select("id, price_usd, features(id, title, session_minutes)")
        .eq("order_id", orderId),
      supabase
        .from("vehicles")
        .select("id, brand, model, year, chassis, head_unit, vin")
        .eq("id", order.vehicle_id)
        .single(),
      supabase
        .from("customer_profiles")
        .select("user_id, full_name, phone")
        .eq("user_id", order.customer_id)
        .single(),
      supabase
        .from("bookings")
        .select("id, status, starts_at, technician_id")
        .eq("order_id", orderId)
        .maybeSingle(),
    ]);

  async function handleUpdateStatus(formData: FormData) {
    "use server";
    await requireAdmin();
    const status = String(formData.get("status"));
    await updateOrderStatus(orderId, status);
    revalidatePath(`/admin/orders/${orderId}`);
  }

  async function handleUpdatePayment(formData: FormData) {
    "use server";
    await requireAdmin();
    const paymentStatus = String(formData.get("payment_status"));
    await updatePaymentStatus(orderId, paymentStatus);
    revalidatePath(`/admin/orders/${orderId}`);
  }

  async function handleCreateBooking() {
    "use server";
    await requireAdmin();
    await createBookingForOrder(orderId);
    revalidatePath(`/admin/orders/${orderId}`);
  }

  return (
    <DashboardShell title="Admin · Order Detail">
      <Link href="/admin/orders" className="text-sm text-white/50 hover:text-white/80">
        ← Back to orders
      </Link>

      {/* Order info */}
      <div className="surface rounded-premium p-5">
        <h2 className="mb-4 text-lg font-medium">Order {order.id}</h2>
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <span className="text-white/50">Customer</span>
            <p>{profile?.full_name ?? order.customer_id.slice(0, 8)}</p>
            {profile?.phone ? <p className="text-white/50">{profile.phone}</p> : null}
          </div>
          <div>
            <span className="text-white/50">Vehicle</span>
            {vehicle ? (
              <p>
                {vehicle.year} {vehicle.brand} {vehicle.model} ({vehicle.chassis}
                {vehicle.head_unit ? ` / ${vehicle.head_unit}` : ""})
              </p>
            ) : (
              <p>{order.vehicle_id.slice(0, 8)}</p>
            )}
            {vehicle?.vin ? <p className="text-white/50">VIN: {vehicle.vin}</p> : null}
          </div>
          <div>
            <span className="text-white/50">Status</span>
            <p>
              <span
                className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[order.status] ?? "bg-white/10 text-white/60"}`}
              >
                {order.status}
              </span>
            </p>
          </div>
          <div>
            <span className="text-white/50">Payment</span>
            <p>
              <span
                className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${paymentStyles[order.payment_status] ?? "bg-white/10 text-white/60"}`}
              >
                {order.payment_status}
              </span>
            </p>
          </div>
          <div>
            <span className="text-white/50">Total</span>
            <p>${order.total_usd}</p>
          </div>
          <div>
            <span className="text-white/50">Created</span>
            <p>{new Date(order.created_at).toLocaleString()}</p>
          </div>
          {order.stripe_checkout_session_id ? (
            <div>
              <span className="text-white/50">Stripe Checkout</span>
              <p className="truncate text-xs">{order.stripe_checkout_session_id}</p>
            </div>
          ) : null}
          {order.stripe_payment_intent_id ? (
            <div>
              <span className="text-white/50">Stripe Payment Intent</span>
              <p className="truncate text-xs">{order.stripe_payment_intent_id}</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Line items */}
      <div className="surface rounded-premium p-5">
        <h3 className="mb-3 text-sm font-medium text-white/70">Line Items</h3>
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
                const feature = item.features as unknown as {
                  id: string;
                  title: string;
                  session_minutes: number;
                } | null;
                return (
                  <tr key={item.id} className="border-t border-white/5">
                    <td className="py-2 pr-4">{feature?.title ?? "Unknown"}</td>
                    <td className="py-2 pr-4">{feature?.session_minutes ?? "—"}m</td>
                    <td className="py-2">${item.price_usd}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Update order status */}
      <div className="surface rounded-premium p-5">
        <h3 className="mb-3 text-sm font-medium text-white/70">Update Order Status</h3>
        <form action={handleUpdateStatus} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <select
            name="status"
            defaultValue={order.status}
            className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none ring-electric focus:ring-1 sm:w-auto"
          >
            {["draft", "pending", "confirmed", "completed", "cancelled"].map((s) => (
              <option key={s} value={s} className="bg-panel">
                {s}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-xl bg-silver px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white"
          >
            Update Status
          </button>
        </form>
      </div>

      {/* Update payment status */}
      <div className="surface rounded-premium p-5">
        <h3 className="mb-3 text-sm font-medium text-white/70">Update Payment Status</h3>
        <form action={handleUpdatePayment} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <select
            name="payment_status"
            defaultValue={order.payment_status}
            className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none ring-electric focus:ring-1 sm:w-auto"
          >
            {["unpaid", "paid", "refunded", "failed"].map((s) => (
              <option key={s} value={s} className="bg-panel">
                {s}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-xl bg-silver px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white"
          >
            Update Payment
          </button>
        </form>
      </div>

      {/* Booking section */}
      <div className="surface rounded-premium p-5">
        <h3 className="mb-3 text-sm font-medium text-white/70">Booking</h3>
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
            {booking.technician_id ? (
              <p>Technician: {booking.technician_id.slice(0, 8)}</p>
            ) : (
              <p className="text-white/50">No technician assigned</p>
            )}
            <Link
              href={`/admin/sessions/${booking.id}`}
              className="mt-2 inline-block rounded-xl border border-white/20 bg-white/5 px-3 py-1.5 text-xs text-white/80 transition hover:bg-white/10"
            >
              View session detail
            </Link>
          </div>
        ) : order.payment_status === "paid" ? (
          <form action={handleCreateBooking}>
            <p className="mb-3 text-sm text-white/50">
              No booking exists yet for this paid order.
            </p>
            <button
              type="submit"
              className="rounded-xl bg-silver px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white"
            >
              Create Booking
            </button>
          </form>
        ) : (
          <p className="text-sm text-white/40">No booking — order is not yet paid.</p>
        )}
      </div>
    </DashboardShell>
  );
}
