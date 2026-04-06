import Link from "next/link";
import { revalidatePath } from "next/cache";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import {
  assignTechnician,
  updateBookingStatus,
  setRemoteSessionLink,
  addTechnicianNote,
} from "@/lib/admin/session-actions";

const sessionStatusStyles: Record<string, string> = {
  pending: "bg-amber-400/15 text-amber-200",
  scheduled: "bg-electric/15 text-electric",
  in_progress: "bg-blue-400/15 text-blue-200",
  completed: "bg-emerald-400/15 text-emerald-200",
  cancelled: "bg-white/10 text-white/50",
};

export default async function AdminSessionDetailPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  await requireAdmin();
  const { sessionId } = await params;
  const supabase = createAdminSupabaseClient();

  const { data: booking } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (!booking) {
    return (
      <DashboardShell title="Admin · Session Not Found">
        <div className="surface rounded-premium p-6 text-sm text-white/70">
          <p>Session not found.</p>
          <Link href="/admin/sessions" className="mt-3 inline-block text-sm text-white/50 hover:text-white/80">
            ← Back to sessions
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const [{ data: order }, { data: setupReqs }, { data: notes }] = await Promise.all([
    supabase
      .from("orders")
      .select("id, customer_id, vehicle_id, status, total_usd, customer_profiles:customer_id(full_name, phone), vehicles:vehicle_id(brand, model, year, chassis, head_unit)")
      .eq("id", booking.order_id)
      .single(),
    supabase
      .from("setup_requirements")
      .select("id, requirement, completed")
      .eq("booking_id", sessionId)
      .order("created_at", { ascending: true }),
    supabase
      .from("technician_notes")
      .select("id, technician_id, note, created_at")
      .eq("booking_id", sessionId)
      .order("created_at", { ascending: false }),
  ]);

  const customer = order?.customer_profiles as unknown as { full_name: string | null; phone: string | null } | null;
  const vehicle = order?.vehicles as unknown as { brand: string; model: string; year: number; chassis: string; head_unit: string | null } | null;

  async function handleUpdateStatus(formData: FormData) {
    "use server";
    await requireAdmin();
    const status = String(formData.get("status"));
    await updateBookingStatus(sessionId, status);
    revalidatePath(`/admin/sessions/${sessionId}`);
  }

  async function handleAssignTechnician(formData: FormData) {
    "use server";
    await requireAdmin();
    const techId = String(formData.get("technician_id")).trim();
    await assignTechnician(sessionId, techId || null);
    revalidatePath(`/admin/sessions/${sessionId}`);
  }

  async function handleSetLink(formData: FormData) {
    "use server";
    await requireAdmin();
    const link = String(formData.get("remote_session_link")).trim();
    await setRemoteSessionLink(sessionId, link);
    revalidatePath(`/admin/sessions/${sessionId}`);
  }

  async function handleAddNote(formData: FormData) {
    "use server";
    await requireAdmin();
    const note = String(formData.get("note")).trim();
    const techId = String(formData.get("technician_id")).trim();
    if (!note || !techId) return;
    await addTechnicianNote(sessionId, techId, note);
    revalidatePath(`/admin/sessions/${sessionId}`);
  }

  return (
    <DashboardShell title="Admin · Session Detail">
      <Link href="/admin/sessions" className="text-sm text-white/50 hover:text-white/80">
        ← Back to sessions
      </Link>

      {/* Session info */}
      <div className="surface rounded-premium p-5">
        <h2 className="mb-4 text-lg font-medium">Session {booking.id}</h2>
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <span className="text-white/50">Status</span>
            <p>
              <span
                className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${sessionStatusStyles[booking.status] ?? "bg-white/10 text-white/60"}`}
              >
                {booking.status}
              </span>
            </p>
          </div>
          <div>
            <span className="text-white/50">Scheduled</span>
            <p>
              {booking.starts_at
                ? new Date(booking.starts_at).toLocaleString()
                : "Not yet scheduled"}
            </p>
          </div>
          <div>
            <span className="text-white/50">Technician</span>
            <p>{booking.technician_id ?? "Unassigned"}</p>
          </div>
          <div>
            <span className="text-white/50">Remote Session Link</span>
            <p className="truncate">{booking.remote_session_link ?? "Not set"}</p>
          </div>
          <div>
            <span className="text-white/50">Order</span>
            <p>
              <Link
                href={`/admin/orders/${booking.order_id}`}
                className="text-electric hover:underline"
              >
                {booking.order_id.slice(0, 8)}
              </Link>
            </p>
          </div>
          {customer ? (
            <div>
              <span className="text-white/50">Customer</span>
              <p>{customer.full_name ?? "Unknown"}</p>
              {customer.phone ? <p className="text-white/50">{customer.phone}</p> : null}
            </div>
          ) : null}
          {vehicle ? (
            <div className="sm:col-span-2">
              <span className="text-white/50">Vehicle</span>
              <p>
                {vehicle.year} {vehicle.brand} {vehicle.model} ({vehicle.chassis}
                {vehicle.head_unit ? ` / ${vehicle.head_unit}` : ""})
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Setup requirements */}
      {(setupReqs ?? []).length > 0 ? (
        <div className="surface rounded-premium p-5">
          <h3 className="mb-3 text-sm font-medium text-white/70">Setup Requirements</h3>
          <ul className="space-y-1.5 text-sm">
            {(setupReqs ?? []).map((req) => (
              <li key={req.id} className="flex items-center gap-2">
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                    req.completed
                      ? "bg-emerald-400/20 text-emerald-200"
                      : "bg-white/10 text-white/40"
                  }`}
                >
                  {req.completed ? "✓" : "·"}
                </span>
                <span className={req.completed ? "text-white/60" : ""}>{req.requirement}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Update booking status */}
      <div className="surface rounded-premium p-5">
        <h3 className="mb-3 text-sm font-medium text-white/70">Update Session Status</h3>
        <form action={handleUpdateStatus} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <select
            name="status"
            defaultValue={booking.status}
            className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none ring-electric focus:ring-1 sm:w-auto"
          >
            {["pending", "scheduled", "in_progress", "completed", "cancelled"].map((s) => (
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

      {/* Assign technician */}
      <div className="surface rounded-premium p-5">
        <h3 className="mb-3 text-sm font-medium text-white/70">Assign Technician</h3>
        <form action={handleAssignTechnician} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <input
            name="technician_id"
            type="text"
            placeholder="Technician user ID"
            defaultValue={booking.technician_id ?? ""}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none ring-electric focus:ring-1 sm:w-auto"
          />
          <button
            type="submit"
            className="rounded-xl bg-silver px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white"
          >
            Assign
          </button>
        </form>
      </div>

      {/* Remote session link */}
      <div className="surface rounded-premium p-5">
        <h3 className="mb-3 text-sm font-medium text-white/70">Remote Session Link</h3>
        <form action={handleSetLink} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <input
            name="remote_session_link"
            type="url"
            placeholder="https://..."
            defaultValue={booking.remote_session_link ?? ""}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none ring-electric focus:ring-1 sm:flex-1"
          />
          <button
            type="submit"
            className="rounded-xl bg-silver px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white"
          >
            Save Link
          </button>
        </form>
      </div>

      {/* Add technician note */}
      <div className="surface rounded-premium p-5">
        <h3 className="mb-3 text-sm font-medium text-white/70">Add Technician Note</h3>
        <form action={handleAddNote} className="space-y-3">
          <input
            name="technician_id"
            type="text"
            placeholder="Technician user ID"
            defaultValue={booking.technician_id ?? ""}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none ring-electric focus:ring-1"
          />
          <textarea
            name="note"
            required
            rows={3}
            placeholder="Enter note..."
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none ring-electric focus:ring-1"
          />
          <button
            type="submit"
            className="rounded-xl bg-silver px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white"
          >
            Add Note
          </button>
        </form>
      </div>

      {/* Existing notes */}
      {(notes ?? []).length > 0 ? (
        <div className="surface rounded-premium p-5">
          <h3 className="mb-3 text-sm font-medium text-white/70">Technician Notes</h3>
          <div className="space-y-3">
            {(notes ?? []).map((note) => (
              <div key={note.id} className="rounded-xl bg-white/5 p-3">
                <p className="text-sm">{note.note}</p>
                <p className="mt-1 text-xs text-white/40">
                  By {note.technician_id.slice(0, 8)} · {new Date(note.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </DashboardShell>
  );
}
