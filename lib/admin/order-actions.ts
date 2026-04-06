import "server-only";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { OrderStatus, PaymentStatus } from "@/types/database";

const validOrderStatuses: OrderStatus[] = ["draft", "pending", "confirmed", "completed", "cancelled"];
const validPaymentStatuses: PaymentStatus[] = ["unpaid", "paid", "refunded", "failed"];

export async function updateOrderStatus(orderId: string, status: string) {
  if (!validOrderStatuses.includes(status as OrderStatus)) {
    throw new Error("Invalid order status");
  }

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("orders")
    .update({ status: status as OrderStatus, updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (error) throw new Error(`Failed to update order: ${error.message}`);
}

export async function updatePaymentStatus(orderId: string, paymentStatus: string) {
  if (!validPaymentStatuses.includes(paymentStatus as PaymentStatus)) {
    throw new Error("Invalid payment status");
  }

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("orders")
    .update({ payment_status: paymentStatus as PaymentStatus, updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (error) throw new Error(`Failed to update payment status: ${error.message}`);
}
