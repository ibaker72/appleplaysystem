import Link from "next/link";
import { revalidatePath } from "next/cache";
import { PremiumSection } from "@/components/marketing/PremiumSection";
import { requireUser } from "@/lib/auth/require-user";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

async function toggleRequirementAction(formData: FormData) {
  "use server";
  const user = await requireUser();
  const requirementId = String(formData.get("requirement_id"));
  const orderId = String(formData.get("order_id"));
  const completed = formData.get("completed") === "true";

  const supabase = createAdminSupabaseClient();

  // Verify ownership through booking → order → customer chain
  const { data: req } = await supabase
    .from("setup_requirements")
    .select("id, bookings!inner(order_id, orders!inner(customer_id))")
    .eq("id", requirementId)
    .single();

  if (!req) return;

  // Type-safe access of nested join
  const booking = Array.isArray(req.bookings) ? req.bookings[0] : req.bookings;
  const order = booking && typeof booking === "object" && "orders" in booking
    ? (Array.isArray((booking as Record<string, unknown>).orders) ? ((booking as Record<string, unknown>).orders as Record<string, unknown>[])[0] : (booking as Record<string, unknown>).orders) as Record<string, unknown> | null
    : null;

  if (!order || order.customer_id !== user.id) return;

  await supabase
    .from("setup_requirements")
    .update({ completed: !completed })
    .eq("id", requirementId);

  revalidatePath(`/setup-instructions/${orderId}`);
}

export default async function SetupInstructionsPage({ params }: { params: Promise<{ orderId: string }> }) {
  const user = await requireUser();
  const { orderId } = await params;
  const supabase = createAdminSupabaseClient();

  const { data: booking } = await supabase
    .from("bookings")
    .select("id, status, orders!inner(customer_id)")
    .eq("order_id", orderId)
    .eq("orders.customer_id", user.id)
    .maybeSingle();

  if (!booking) {
    return (
      <PremiumSection eyebrow="Setup" title="Setup instructions unavailable">
        <div className="surface rounded-premium p-6 text-sm text-white/70">
          <p>No booking found for this order yet. Setup instructions appear after payment is confirmed.</p>
          <Link href="/dashboard/orders" className="mt-3 inline-block text-white/80 underline">
            Back to orders
          </Link>
        </div>
      </PremiumSection>
    );
  }

  const { data: requirements } = await supabase
    .from("setup_requirements")
    .select("id, requirement, completed")
    .eq("booking_id", booking.id)
    .order("created_at", { ascending: true });

  const items = requirements ?? [];
  const completedCount = items.filter((r) => r.completed).length;
  const totalCount = items.length;

  return (
    <PremiumSection eyebrow="Setup" title="Pre-session setup checklist">
      <div className="surface rounded-premium p-6">
        {totalCount > 0 ? (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-white/60">Complete each item before your session.</p>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs">
                {completedCount}/{totalCount}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                style={{ width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : "0%" }}
              />
            </div>
            <ul className="mt-4 space-y-2">
              {items.map((item) => (
                <li key={item.id}>
                  <form action={toggleRequirementAction} className="flex items-center gap-3 rounded-xl border border-white/5 p-3 transition hover:border-white/15">
                    <input type="hidden" name="requirement_id" value={item.id} />
                    <input type="hidden" name="order_id" value={orderId} />
                    <input type="hidden" name="completed" value={String(item.completed)} />
                    <button type="submit" className="flex items-center gap-3 text-left w-full">
                      <span
                        className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs ${
                          item.completed
                            ? "border-emerald-400/40 bg-emerald-400/20 text-emerald-200"
                            : "border-white/20 bg-white/5 text-transparent"
                        }`}
                      >
                        ✓
                      </span>
                      <span className={`text-sm ${item.completed ? "text-white/50 line-through" : "text-white/80"}`}>
                        {item.requirement}
                      </span>
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-sm text-white/60">No setup requirements have been created for this booking yet.</p>
        )}
      </div>

      <div className="mt-4 flex gap-3">
        <Link href={`/booking/${orderId}`} className="text-sm text-white/50 hover:text-white/80">
          View session timeline
        </Link>
        <Link href="/dashboard" className="text-sm text-white/50 hover:text-white/80">
          ← Dashboard
        </Link>
      </div>
    </PremiumSection>
  );
}
