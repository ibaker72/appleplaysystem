import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function getUserOrders(customerId: string) {
  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("orders")
    .select("id, vehicle_id, total_usd, status, payment_status, created_at")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load orders: ${error.message}`);
  }

  return data;
}
