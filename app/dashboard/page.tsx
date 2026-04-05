import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireUser } from "@/lib/auth/require-user";
import { getUserVehicles } from "@/lib/vehicles/save-vehicle";
import { getUserOrders } from "@/lib/orders/get-user-orders";
import { getUserBookings } from "@/lib/bookings/get-user-bookings";

export default async function DashboardPage() {
  const user = await requireUser("/dashboard");
  const [vehicles, orders, bookings] = await Promise.all([
    getUserVehicles(user.id),
    getUserOrders(user.id),
    getUserBookings(user.id)
  ]);

  const nextBooking = bookings[0];
  const checklist = (nextBooking?.setup_requirements ?? []) as { completed: boolean }[];
  const completed = checklist.filter((item) => item.completed).length;

  return (
    <DashboardShell title="Owner Dashboard">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="surface rounded-premium p-5">
          <p className="text-sm text-white/60">Saved vehicles</p>
          <p className="mt-2 text-3xl font-semibold">{vehicles.length}</p>
          <Link href="/dashboard/vehicles" className="mt-2 inline-block text-sm text-white/70 hover:text-white">Manage vehicles</Link>
        </div>
        <div className="surface rounded-premium p-5">
          <p className="text-sm text-white/60">Recent orders</p>
          <p className="mt-2 text-3xl font-semibold">{orders.length}</p>
          <Link href="/dashboard/orders" className="mt-2 inline-block text-sm text-white/70 hover:text-white">View orders</Link>
        </div>
      </div>

      {nextBooking ? (
        <div className="surface rounded-premium p-5">
          <h3 className="text-lg font-medium">Upcoming / pending session</h3>
          <p className="mt-2 text-sm text-white/70">Status: {nextBooking.status}</p>
          <p className="text-sm text-white/70">Start: {nextBooking.starts_at ? new Date(nextBooking.starts_at).toLocaleString() : "Not scheduled"}</p>
          <p className="mt-2 text-sm text-white/70">Setup progress: {checklist.length ? `${completed}/${checklist.length}` : "No checklist yet"}</p>
          <Link className="mt-2 inline-block text-sm text-white/80 underline" href={`/setup-instructions/${nextBooking.order_id}`}>Open setup instructions</Link>
        </div>
      ) : (
        <EmptyState title="No sessions yet" description="Complete checkout and your first pending booking will appear here." />
      )}
    </DashboardShell>
  );
}
