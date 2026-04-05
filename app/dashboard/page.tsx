import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireUser } from "@/lib/auth/require-user";
import { getUserVehicles } from "@/lib/vehicles/save-vehicle";
import { getUserOrders } from "@/lib/orders/get-user-orders";
import { getUserBookings } from "@/lib/bookings/get-user-bookings";

export default async function DashboardPage() {
  const user = await requireUser("/dashboard");

  let vehicles: Awaited<ReturnType<typeof getUserVehicles>> = [];
  let orders: Awaited<ReturnType<typeof getUserOrders>> = [];
  let bookings: Awaited<ReturnType<typeof getUserBookings>> = [];

  try {
    [vehicles, orders, bookings] = await Promise.all([
      getUserVehicles(user.id),
      getUserOrders(user.id),
      getUserBookings(user.id),
    ]);
  } catch {
    // Graceful degradation — show empty states
  }

  const nextBooking = bookings.find((b) => b.status === "pending" || b.status === "scheduled");
  const setupReqs = (nextBooking as Record<string, unknown> | undefined)?.setup_requirements as
    | { completed: boolean }[]
    | undefined;
  const checklist = setupReqs ?? [];
  const completed = checklist.filter((item) => item.completed).length;

  return (
    <DashboardShell title="Owner Dashboard">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="surface rounded-premium p-5">
          <p className="text-sm text-white/60">Saved vehicles</p>
          <p className="mt-2 text-3xl font-semibold">{vehicles.length}</p>
          <Link href="/dashboard/vehicles" className="mt-2 inline-block text-sm text-white/70 hover:text-white">
            Manage vehicles →
          </Link>
        </div>
        <div className="surface rounded-premium p-5">
          <p className="text-sm text-white/60">Orders</p>
          <p className="mt-2 text-3xl font-semibold">{orders.length}</p>
          <Link href="/dashboard/orders" className="mt-2 inline-block text-sm text-white/70 hover:text-white">
            View orders →
          </Link>
        </div>
        <div className="surface rounded-premium p-5">
          <p className="text-sm text-white/60">Sessions</p>
          <p className="mt-2 text-3xl font-semibold">{bookings.length}</p>
          <Link href="/dashboard/sessions" className="mt-2 inline-block text-sm text-white/70 hover:text-white">
            View sessions →
          </Link>
        </div>
      </div>

      {nextBooking ? (
        <div className="surface rounded-premium p-5">
          <h3 className="text-lg font-medium">Upcoming session</h3>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-white/10 px-2.5 py-1">{nextBooking.status}</span>
            <span className="rounded-full bg-white/10 px-2.5 py-1">
              {nextBooking.starts_at ? new Date(nextBooking.starts_at).toLocaleString() : "Not scheduled"}
            </span>
          </div>
          {checklist.length > 0 ? (
            <div className="mt-3">
              <p className="text-sm text-white/60">
                Setup progress: {completed}/{checklist.length}
              </p>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all"
                  style={{ width: `${(completed / checklist.length) * 100}%` }}
                />
              </div>
            </div>
          ) : null}
          <Link
            className="mt-3 inline-block text-sm text-white/80 underline"
            href={`/setup-instructions/${nextBooking.order_id}`}
          >
            Open setup instructions
          </Link>
        </div>
      ) : (
        <EmptyState
          title="No upcoming sessions"
          description="Complete checkout on an order and your next session will appear here."
        />
      )}

      {vehicles.length === 0 && orders.length === 0 ? (
        <div className="surface rounded-premium p-6 text-center">
          <p className="text-sm text-white/60">Ready to get started?</p>
          <Link
            href="/check-compatibility"
            className="mt-3 inline-block rounded-xl bg-silver px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white"
          >
            Check vehicle compatibility
          </Link>
        </div>
      ) : null}
    </DashboardShell>
  );
}
