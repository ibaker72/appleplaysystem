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
      orders!inner(customer_id),
      setup_requirements(id, requirement, completed)
    `)
    .eq("orders.customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load bookings: ${error.message}`);
  }

  return data ?? [];
}
