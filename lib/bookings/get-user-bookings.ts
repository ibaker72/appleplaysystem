import "server-only";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export interface UserBooking {
  id: string;
  order_id: string;
  starts_at: string | null;
  status: string;
  remote_session_link: string | null;
  setup_requirements: Array<{
    id: string;
    requirement: string;
    completed: boolean;
  }>;
}

export async function getUserBookings(customerId: string): Promise<UserBooking[]> {
  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("bookings")
    .select(`
      id,
      order_id,
      starts_at,
      status,
      remote_session_link,
      orders!inner(customer_id),
      setup_requirements(id, requirement, completed)
    `)
    .eq("orders.customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load bookings: ${error.message}`);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    order_id: row.order_id,
    starts_at: row.starts_at,
    status: row.status,
    remote_session_link: row.remote_session_link,
    setup_requirements: Array.isArray(row.setup_requirements)
      ? row.setup_requirements.map((r) => ({
          id: r.id,
          requirement: r.requirement,
          completed: r.completed,
        }))
      : [],
  }));
}
