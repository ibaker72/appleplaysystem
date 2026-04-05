import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function getUserBookings(customerId: string) {
  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("bookings")
    .select(`
      id,
      order_id,
      starts_at,
      status,
      setup_requirements(completed)
    `)
    .eq("orders.customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) {
    const fallback = await supabase
      .from("bookings")
      .select(`
        id,
        order_id,
        starts_at,
        status,
        orders!inner(customer_id),
        setup_requirements(completed)
      `)
      .eq("orders.customer_id", customerId)
      .order("created_at", { ascending: false });

    if (fallback.error) {
      throw new Error(`Failed to load bookings: ${fallback.error.message}`);
    }

    return fallback.data;
  }

  return data;
}
