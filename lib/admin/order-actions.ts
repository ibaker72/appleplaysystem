import "server-only";
import { z } from "zod";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const orderStatusSchema = z.enum(["draft", "pending", "confirmed", "completed", "cancelled"]);
const paymentStatusSchema = z.enum(["unpaid", "paid", "refunded", "failed"]);

export async function updateOrderStatus(orderId: string, status: string) {
  z.string().uuid().parse(orderId);
  const validStatus = orderStatusSchema.parse(status);

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("orders")
    .update({ status: validStatus, updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (error) throw new Error(`Failed to update order: ${error.message}`);
}

export async function updatePaymentStatus(orderId: string, paymentStatus: string) {
  z.string().uuid().parse(orderId);
  const validStatus = paymentStatusSchema.parse(paymentStatus);

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("orders")
    .update({ payment_status: validStatus, updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (error) throw new Error(`Failed to update payment status: ${error.message}`);
}
