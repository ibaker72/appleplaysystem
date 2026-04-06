import "server-only";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function updateOrderStatus(orderId: string, status: string) {
  const validStatuses = ["draft", "pending", "confirmed", "completed", "cancelled"];
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid order status");
  }

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (error) throw new Error(`Failed to update order: ${error.message}`);
}

export async function updatePaymentStatus(orderId: string, paymentStatus: string) {
  const validStatuses = ["unpaid", "paid", "refunded", "failed"];
  if (!validStatuses.includes(paymentStatus)) {
    throw new Error("Invalid payment status");
  }

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("orders")
    .update({ payment_status: paymentStatus, updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (error) throw new Error(`Failed to update payment status: ${error.message}`);
}
