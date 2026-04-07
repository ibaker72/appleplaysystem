import type { Metadata } from "next";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireTechnician } from "@/lib/auth/require-technician";

export const metadata: Metadata = { title: "Technician Portal | Remote Code DE" };
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-400/15 text-amber-200",
  scheduled: "bg-electric/15 text-electric",
  in_progress: "bg-blue-400/15 text-blue-200",
  completed: "bg-emerald-400/15 text-emerald-200",
};

export default async function TechnicianPage() {
  const user = await requireTechnician();
  const supabase = createAdminSupabaseClient();

  // Assigned sessions
  const { data: assignedBookings } = await supabase
    .from("bookings")
    .select(
      "id, order_id, status, starts_at, orders!inner(customer_id, customer_profiles:customer_id(full_name), vehicles:vehicle_id(brand, model, year))"
    )
    .eq("technician_id", user.id)
    .in("status", ["scheduled", "in_progress"])
    .order("starts_at", { ascending: true });

  // Unassigned queue
  const { data: unassignedBookings } = await supabase
    .from("bookings")
    .select(
      "id, order_id, status, starts_at, orders!inner(customer_id, customer_profiles:customer_id(full_name), vehicles:vehicle_id(brand, model, year))"
    )
    .is("technician_id", null)
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  function renderBookingCard(booking: NonNullable<typeof assignedBookings>[number]) {
    const order = booking.orders as unknown as {
      customer_id: string;
      customer_profiles: { full_name: string | null } | null;
      vehicles: { brand: string; model: string; year: number } | null;
    };

    return (
      <Link
        key={booking.id}
        href={`/technician/sessions/${booking.id}`}
        className="surface rounded-premium p-4 transition hover:border-white/15"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium">
              Session {booking.id.slice(0, 8)}
            </p>
            <p className="mt-1 text-xs text-white/50">
              Order{" "}
              <span className="text-electric">{booking.order_id.slice(0, 8)}</span>
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[booking.status] ?? "bg-white/10 text-white/60"}`}
          >
            {booking.status}
          </span>
        </div>
        <div className="mt-3 space-y-1 text-sm text-white/60">
          {order.customer_profiles?.full_name ? (
            <p>{order.customer_profiles.full_name}</p>
          ) : null}
          {order.vehicles ? (
            <p>
              {order.vehicles.year} {order.vehicles.brand} {order.vehicles.model}
            </p>
          ) : null}
          <p>
            {booking.starts_at
              ? new Date(booking.starts_at).toLocaleString()
              : "Not yet scheduled"}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <DashboardShell title="Technician Portal">
      {/* Assigned sessions */}
      <div>
        <h2 className="mb-3 text-lg font-medium">My Assigned Sessions</h2>
        {(assignedBookings ?? []).length === 0 ? (
          <div className="surface rounded-premium p-5 text-sm text-white/50">
            No assigned sessions.
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {(assignedBookings ?? []).map(renderBookingCard)}
          </div>
        )}
      </div>

      {/* Unassigned queue */}
      <div>
        <h2 className="mb-3 text-lg font-medium">Unassigned Queue</h2>
        {(unassignedBookings ?? []).length === 0 ? (
          <div className="surface rounded-premium p-5 text-sm text-white/50">
            No pending unassigned sessions.
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {(unassignedBookings ?? []).map(renderBookingCard)}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
