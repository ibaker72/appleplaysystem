import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export default async function AdminSessionsPage() {
  await requireAdmin();
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase
    .from("bookings")
    .select("id, order_id, starts_at, technician_id, status")
    .order("created_at", { ascending: false })
    .limit(100);

  const bookings = data ?? [];

  return (
    <DashboardShell title="Admin · Sessions">
      <section className="surface rounded-premium p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Sessions</h2>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/50">
            {bookings.length} {bookings.length === 1 ? "record" : "records"}
          </span>
        </div>

        {bookings.length === 0 ? (
          <p className="py-8 text-center text-sm text-white/40">No records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-white/55">
                <tr>
                  <th className="pb-3 pr-4 font-medium">Session</th>
                  <th className="pb-3 pr-4 font-medium">Order</th>
                  <th className="pb-3 pr-4 font-medium">Time</th>
                  <th className="pb-3 pr-4 font-medium">Technician</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-t border-white/5">
                    <td className="py-3 pr-4">{booking.id.slice(0, 8)}</td>
                    <td className="py-3 pr-4">{booking.order_id.slice(0, 8)}</td>
                    <td className="py-3 pr-4">
                      {booking.starts_at
                        ? new Date(booking.starts_at).toLocaleString()
                        : "Pending"}
                    </td>
                    <td className="py-3 pr-4">
                      {booking.technician_id?.slice(0, 8) ?? "Unassigned"}
                    </td>
                    <td className="py-3 pr-4">{booking.status}</td>
                    <td className="py-3">
                      <Link
                        href={`/admin/sessions/${booking.id}`}
                        className="text-electric hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </DashboardShell>
  );
}
