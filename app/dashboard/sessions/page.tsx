import Link from "next/link";
import { revalidatePath } from "next/cache";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireUser } from "@/lib/auth/require-user";
import { getUserBookings } from "@/lib/bookings/get-user-bookings";
import { scheduleBookingForUser } from "@/lib/bookings/create-booking";

const sessionStatusStyles: Record<string, string> = {
  pending: "bg-amber-400/15 text-amber-200",
  scheduled: "bg-electric/15 text-electric",
  in_progress: "bg-blue-400/15 text-blue-200",
  completed: "bg-emerald-400/15 text-emerald-200",
  cancelled: "bg-white/10 text-white/50",
};

async function scheduleBookingAction(formData: FormData) {
  "use server";
  const user = await requireUser("/dashboard/sessions");
  const bookingId = String(formData.get("booking_id"));
  const startsAt = String(formData.get("starts_at"));

  if (!startsAt) {
    return;
  }

  await scheduleBookingForUser({
    bookingId,
    customerId: user.id,
    startsAt: new Date(startsAt).toISOString(),
  });
  revalidatePath("/dashboard/sessions");
}

export default async function SessionsPage() {
  const user = await requireUser("/dashboard/sessions");
  const bookings = await getUserBookings(user.id);

  return (
    <DashboardShell title="Sessions">
      {bookings.length === 0 ? (
        <EmptyState
          title="No sessions yet"
          description="Once an order is paid, your remote session will appear here."
        />
      ) : null}

      {bookings.map((booking) => {
        const setupReqs = (booking as Record<string, unknown>).setup_requirements as
          | { id: string; completed: boolean }[]
          | undefined;
        const checklist = setupReqs ?? [];
        const completedCount = checklist.filter((r) => r.completed).length;

        return (
          <div key={booking.id} className="surface rounded-premium p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium">Session {booking.id.slice(0, 8)}</p>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${sessionStatusStyles[booking.status] ?? "bg-white/10 text-white/60"}`}
              >
                {booking.status}
              </span>
            </div>

            <p className="mt-2 text-sm text-white/70">
              {booking.starts_at
                ? `Scheduled: ${new Date(booking.starts_at).toLocaleString()}`
                : "Not yet scheduled"}
            </p>

            {checklist.length > 0 ? (
              <div className="mt-2">
                <p className="text-xs text-white/50">
                  Setup: {completedCount}/{checklist.length} complete
                </p>
                <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-emerald-400"
                    style={{ width: `${(completedCount / checklist.length) * 100}%` }}
                  />
                </div>
              </div>
            ) : null}

            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href={`/setup-instructions/${booking.order_id}`}
                className="rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/80 transition hover:bg-white/10"
              >
                Setup checklist
              </Link>
              <Link
                href={`/booking/${booking.order_id}`}
                className="rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/80 transition hover:bg-white/10"
              >
                View timeline
              </Link>
            </div>

            {booking.status === "pending" ? (
              <form action={scheduleBookingAction} className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                <input type="hidden" name="booking_id" value={booking.id} />
                <input
                  type="datetime-local"
                  name="starts_at"
                  required
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none ring-electric focus:ring-1"
                />
                <button
                  type="submit"
                  className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-xs transition hover:bg-white/10"
                >
                  Request time
                </button>
              </form>
            ) : null}
          </div>
        );
      })}
    </DashboardShell>
  );
}
