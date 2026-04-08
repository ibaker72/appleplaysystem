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

  // Fetch vehicle brand so setup requirements are brand-specific
  const { data: orderForBrand } = await supabase
    .from("orders")
    .select("vehicle_id, vehicles:vehicle_id(brand)")
    .eq("id", orderId)
    .single();

  type VehicleJoin = { brand: string } | null;
  const vehicleJoin = (Array.isArray((orderForBrand as Record<string, unknown> | null)?.vehicles)
    ? ((orderForBrand as Record<string, unknown>).vehicles as VehicleJoin[])[0]
    : (orderForBrand as Record<string, unknown> | null)?.vehicles as VehicleJoin);
  const brand = vehicleJoin?.brand;

  await createDefaultSetupRequirements(data.id, brand);

  // Send booking confirmation email (fire-and-forget)
  try {
    const { data: order } = await supabase
      .from("orders")
      .select("id, customer_id")
      .eq("id", orderId)
      .single();

    if (order) {
      const { data: authUser } = await supabase.auth.admin.getUserById(order.customer_id);
      const { data: profile } = await supabase
        .from("customer_profiles")
        .select("full_name")
        .eq("user_id", order.customer_id)
        .maybeSingle();

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
