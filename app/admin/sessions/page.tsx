import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const PAGE_SIZE = 25;

const statusStyles: Record<string, string> = {
  pending: "bg-amber-400/15 text-amber-200",
  scheduled: "bg-electric/15 text-electric",
  in_progress: "bg-blue-400/15 text-blue-200",
  completed: "bg-emerald-400/15 text-emerald-200",
  cancelled: "bg-white/10 text-white/50",
};

const ALL_STATUSES = ["pending", "scheduled", "in_progress", "completed", "cancelled"] as const;

export default async function AdminSessionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const statusFilter = ALL_STATUSES.includes(params.status as typeof ALL_STATUSES[number])
    ? (params.status as typeof ALL_STATUSES[number])
    : undefined;

  const supabase = createAdminSupabaseClient();

  let query = supabase
    .from("bookings")
    .select("id, order_id, starts_at, technician_id, status", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (statusFilter) {
    query = query.eq("status", statusFilter);
  }

  const { data, count } = await query;
  const bookings = data ?? [];
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  function buildUrl(p: number, s?: string) {
    const sp = new URLSearchParams();
    if (p > 1) sp.set("page", String(p));
    if (s) sp.set("status", s);
    const qs = sp.toString();
    return `/admin/sessions${qs ? `?${qs}` : ""}`;
  }

  return (
    <DashboardShell title="Admin · Sessions">
      <section className="surface rounded-premium p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-medium">Sessions</h2>

          {/* Status filter */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={buildUrl(1)}
              className={`rounded-full px-3 py-1 text-xs transition ${!statusFilter ? "bg-electric/20 text-electric" : "bg-white/5 text-white/50 hover:bg-white/10"}`}
            >
              All
            </Link>
            {ALL_STATUSES.map((s) => (
              <Link
                key={s}
                href={buildUrl(1, s)}
                className={`rounded-full px-3 py-1 text-xs transition ${statusFilter === s ? "bg-electric/20 text-electric" : "bg-white/5 text-white/50 hover:bg-white/10"}`}
              >
                {s.replace("_", " ")}
              </Link>
            ))}
          </div>

          <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/50">
            {count ?? 0} {(count ?? 0) === 1 ? "record" : "records"}
          </span>
        </div>

        {bookings.length === 0 ? (
          <p className="py-8 text-center text-sm text-white/40">No records found.</p>
        ) : (
          <>
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
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[booking.status] ?? "bg-white/10 text-white/60"}`}
                        >
                          {booking.status.replace("_", " ")}
                        </span>
                      </td>
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

            {/* Pagination */}
            {totalPages > 1 ? (
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-white/40 text-xs">
                  Page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                  {page > 1 ? (
                    <Link
                      href={buildUrl(page - 1, statusFilter)}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 transition hover:bg-white/10"
                    >
                      Previous
                    </Link>
                  ) : null}
                  {page < totalPages ? (
                    <Link
                      href={buildUrl(page + 1, statusFilter)}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 transition hover:bg-white/10"
                    >
                      Next
                    </Link>
                  ) : null}
                </div>
              </div>
            ) : null}
          </>
        )}
      </section>
    </DashboardShell>
  );
}
