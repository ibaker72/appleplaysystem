import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { SessionCard } from "@/components/dashboard/SessionCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { bookings } from "@/lib/data/mock";

export default function SessionsPage() {
  return (
    <DashboardShell title="Sessions">
      {bookings.length ? bookings.map((booking) => <SessionCard key={booking.id} booking={booking} />) : <EmptyState title="No sessions yet" description="Once an order is paid, your remote session will appear here." />}
    </DashboardShell>
  );
}
