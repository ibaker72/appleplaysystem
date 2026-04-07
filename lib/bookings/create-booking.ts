import "server-only";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createDefaultSetupRequirements } from "@/lib/setup/create-default-setup-requirements";
import { sendEmail } from "@/lib/email/send";
import { bookingConfirmationEmail } from "@/lib/email/templates";

export async function createBookingForOrder(orderId: string) {
  const supabase = createAdminSupabaseClient();

  const { data: existing, error: existingError } = await supabase
    .from("bookings")
    .select("id")
    .eq("order_id", orderId)
    .maybeSingle();

  if (existingError) {
    throw new Error(`Failed to check existing booking: ${existingError.message}`);
  }

  if (existing) {
    return existing;
  }

  const { data, error } = await supabase
    .from("bookings")
    .insert({ order_id: orderId, status: "pending" })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Failed to create booking: ${error.message}`);
  }

  await createDefaultSetupRequirements(data.id);

  // Send booking confirmation email (fire-and-forget)
  try {
    const { data: order } = await supabase
      .from("orders")
      .select("id, customer_id, customer_profiles:customer_id(full_name)")
      .eq("id", orderId)
      .single();

    if (order) {
      const { data: authUser } = await supabase.auth.admin.getUserById(order.customer_id);
      const profile = (order as Record<string, unknown>).customer_profiles as { full_name: string | null } | null;

      if (authUser?.user?.email) {
        const email = bookingConfirmationEmail({
          orderId,
          bookingId: data.id,
          customerName: profile?.full_name ?? "Customer",
        });
        sendEmail({ to: authUser.user.email, ...email });
      }
    }
  } catch (emailErr) {
    console.error("[bookings] Email send error:", emailErr);
  }

  return data;
}

export async function scheduleBookingForUser(input: { bookingId: string; customerId: string; startsAt: string }) {
  const supabase = createAdminSupabaseClient();
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select("id, orders!inner(customer_id)")
    .eq("id", input.bookingId)
    .eq("orders.customer_id", input.customerId)
    .single();

  if (bookingError || !booking) {
    throw new Error("Booking not found for this account.");
  }

  const { error } = await supabase
    .from("bookings")
    .update({ starts_at: input.startsAt, status: "scheduled" })
    .eq("id", input.bookingId);

  if (error) {
    throw new Error(`Failed to schedule booking: ${error.message}`);
  }
}
