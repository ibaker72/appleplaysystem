import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireTechnician } from "@/lib/auth/require-technician";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { addTechnicianNote, updateBookingStatus } from "@/lib/admin/session-actions";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-400/15 text-amber-200",
  scheduled: "bg-electric/15 text-electric",
  in_progress: "bg-blue-400/15 text-blue-200",
  completed: "bg-emerald-400/15 text-emerald-200",
  cancelled: "bg-white/10 text-white/50",
};

const noteSchema = z.object({
  note: z.string().trim().min(1, "Note is required").max(2000),
});

const statusSchema = z.object({
  status: z.enum(["in_progress", "completed"]),
});

export default async function TechnicianSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const user = await requireTechnician();
  const { sessionId } = await params;
  if (!z.string().uuid().safeParse(sessionId).success) notFound();
  const supabase = createAdminSupabaseClient();

  const { data: booking } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (!booking) {
    return (
      <DashboardShell title="Technician · Session Not Found">
        <div className="surface rounded-premium p-6 text-sm text-white/70">
          <p>Session not found.</p>
          <Link href="/technician" className="mt-3 inline-block text-sm text-white/50 hover:text-white/80">
            &larr; Back to portal
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const [{ data: order }, { data: orderItems }, { data: setupReqs }, { data: notes }] =
    await Promise.all([
      supabase
        .from("orders")
        .select(
          "id, customer_id, vehicle_id, status, total_usd, customer_profiles:customer_id(full_name, phone), vehicles:vehicle_id(brand, model, year, chassis, head_unit)"
        )
        .eq("id", booking.order_id)
        .single(),
      supabase
        .from("order_items")
        .select("id, price_usd, features:feature_id(title, description)")
        .eq("order_id", booking.order_id),
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

  const customer = (order as Record<string, unknown> | null)?.customer_profiles as {
    full_name: string | null;
    phone: string | null;
  } | null;
  const vehicle = (order as Record<string, unknown> | null)?.vehicles as {
    brand: string;
    model: string;
    year: number;
    chassis: string;
    head_unit: string | null;
  } | null;

  async function handleUpdateStatus(formData: FormData) {
    "use server";
    const tech = await requireTechnician();
    const parsed = statusSchema.safeParse({ status: formData.get("status") });
    if (!parsed.success) return;
    await updateBookingStatus(sessionId, parsed.data.status);
    void tech;
    revalidatePath(`/technician/sessions/${sessionId}`);
  }

  async function handleAddNote(formData: FormData) {
    "use server";
    const tech = await requireTechnician();
    const parsed = noteSchema.safeParse({ note: formData.get("note") });
    if (!parsed.success) return;
    await addTechnicianNote(sessionId, tech.id, parsed.data.note);
    revalidatePath(`/technician/sessions/${sessionId}`);
  }

  return (
    <DashboardShell title="Technician · Session Workspace">
      <Link href="/technician" className="text-sm text-white/50 hover:text-white/80">
        &larr; Back to portal
      </Link>

      {/* Session info */}
      <div className="surface rounded-premium p-5">
        <h2 className="mb-4 text-lg font-medium">Session {booking.id.slice(0, 8)}</h2>
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <span className="text-white/50">Status</span>
            <p>
              <span
                className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[booking.status] ?? "bg-white/10 text-white/60"}`}
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
            <span className="text-white/50">Order</span>
            <p className="text-electric">{booking.order_id.slice(0, 8)}</p>
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

      {/* Remote session link */}
      {booking.remote_session_link ? (
        <div className="surface rounded-premium p-5">
          <h3 className="mb-2 text-sm font-medium text-white/70">Remote Session Link</h3>
          <a
            href={booking.remote_session_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-electric hover:underline"
          >
            {booking.remote_session_link}
          </a>
        </div>
      ) : null}

      {/* Ordered features */}
      {(orderItems ?? []).length > 0 ? (
        <div className="surface rounded-premium p-5">
          <h3 className="mb-3 text-sm font-medium text-white/70">Ordered Features</h3>
          <div className="space-y-2">
            {(orderItems ?? []).map((item) => {
              const feature = item.features as unknown as { title: string; description: string | null } | null;
              return (
                <div key={item.id} className="rounded-xl bg-white/5 p-3">
                  <p className="text-sm font-medium">{feature?.title ?? "Unknown"}</p>
                  {feature?.description ? (
                    <p className="mt-1 text-xs text-white/50">{feature.description}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

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
                  {req.completed ? "\u2713" : "\u00b7"}
                </span>
                <span className={req.completed ? "text-white/60" : ""}>{req.requirement}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Update status (technician: only in_progress or completed) */}
      <div className="surface rounded-premium p-5">
        <h3 className="mb-3 text-sm font-medium text-white/70">Update Session Status</h3>
        <form action={handleUpdateStatus} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <select
            name="status"
            defaultValue={booking.status === "in_progress" ? "completed" : "in_progress"}
            className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none ring-electric focus:ring-1 sm:w-auto"
          >
            <option value="in_progress" className="bg-panel">
              in_progress
            </option>
            <option value="completed" className="bg-panel">
              completed
            </option>
          </select>
          <button
            type="submit"
            className="rounded-xl bg-silver px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white"
          >
            Update Status
          </button>
        </form>
      </div>

      {/* Add technician note */}
      <div className="surface rounded-premium p-5">
        <h3 className="mb-3 text-sm font-medium text-white/70">Add Note</h3>
        <form action={handleAddNote} className="space-y-3">
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
                  By {note.technician_id.slice(0, 8)} &middot;{" "}
                  {new Date(note.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </DashboardShell>
  );
}
