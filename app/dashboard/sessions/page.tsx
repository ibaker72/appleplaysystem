import { revalidatePath } from "next/cache";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireUser } from "@/lib/auth/require-user";
import { getUserBookings } from "@/lib/bookings/get-user-bookings";
import { scheduleBookingForUser } from "@/lib/bookings/create-booking";

async function scheduleBookingAction(formData: FormData) {
  "use server";
  const user = await requireUser("/dashboard/sessions");
  const bookingId = String(formData.get("booking_id"));
  const startsAt = String(formData.get("starts_at"));

  if (!startsAt) {
    throw new Error("Please choose a requested session time");
  }

  await scheduleBookingForUser({ bookingId, customerId: user.id, startsAt: new Date(startsAt).toISOString() });
  revalidatePath("/dashboard/sessions");
}

export default async function SessionsPage() {
  const user = await requireUser("/dashboard/sessions");
  const bookings = await getUserBookings(user.id);

  return (
    <DashboardShell title="Sessions">
      {bookings.length ? bookings.map((booking) => (
        <div key={booking.id} className="surface rounded-premium p-5">
          <p className="text-sm text-white/70">Booking {booking.id.slice(0, 8)}</p>
          <p className="mt-1 text-sm text-white/70">Status: {booking.status}</p>
          <p className="text-sm text-white/70">Time: {booking.starts_at ? new Date(booking.starts_at).toLocaleString() : "Not scheduled"}</p>
          <a href={`/setup-instructions/${booking.order_id}`} className="mt-2 inline-block text-xs text-white/80 underline">Open setup instructions</a>

          <form action={scheduleBookingAction} className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <input type="hidden" name="booking_id" value={booking.id} />
            <input type="datetime-local" name="starts_at" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm" />
            <button type="submit" className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-xs">Request time</button>
          </form>
        </div>
      )) : <EmptyState title="No sessions yet" description="Once an order is paid, your remote session will appear here." />}
    </DashboardShell>
  );
}
