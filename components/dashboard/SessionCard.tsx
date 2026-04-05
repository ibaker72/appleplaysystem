import type { Booking } from "@/lib/types/domain";

export function SessionCard({ booking }: { booking: Booking }) {
  return (
    <div className="surface rounded-premium p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-white/50">Upcoming session</p>
      <h3 className="mt-2 text-lg font-medium">{new Date(booking.startsAt).toLocaleString()}</h3>
      <p className="mt-2 text-sm text-white/70">Technician: {booking.technicianName}</p>
      <p className="text-sm text-white/70">Status: {booking.status}</p>
    </div>
  );
}
