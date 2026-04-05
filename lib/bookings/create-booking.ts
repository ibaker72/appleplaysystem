import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createDefaultSetupRequirements } from "@/lib/setup/create-default-setup-requirements";

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
