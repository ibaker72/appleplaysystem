import { PremiumSection } from "@/components/marketing/PremiumSection";
import { requireUser } from "@/lib/auth/require-user";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export default async function SetupInstructionsPage({ params }: { params: Promise<{ orderId: string }> }) {
  const user = await requireUser();
  const { orderId } = await params;
  const supabase = createAdminSupabaseClient();

  const { data: booking } = await supabase
    .from("bookings")
    .select("id, orders!inner(customer_id)")
    .eq("order_id", orderId)
    .eq("orders.customer_id", user.id)
    .maybeSingle();

  if (!booking) {
    return (
      <PremiumSection eyebrow="Setup" title="Setup instructions unavailable">
        <div className="surface rounded-premium p-6 text-sm text-white/70">No booking found for this order yet.</div>
      </PremiumSection>
    );
  }

  const { data: requirements } = await supabase
    .from("setup_requirements")
    .select("id, requirement, completed")
    .eq("booking_id", booking.id)
    .order("created_at", { ascending: true });

  return (
    <PremiumSection eyebrow="Setup" title={`Pre-session setup for order ${orderId}`}>
      <div className="surface rounded-premium p-6">
        <ul className="space-y-2 text-sm text-white/75">
          {(requirements ?? []).map((item) => (
            <li key={item.id}>• {item.requirement} {item.completed ? "(done)" : "(pending)"}</li>
          ))}
        </ul>
      </div>
    </PremiumSection>
  );
}
