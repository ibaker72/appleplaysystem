import "server-only";
import { z } from "zod";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/send";
import { sessionCompletionEmail } from "@/lib/email/templates";

const uuidSchema = z.string().uuid();
const bookingStatusSchema = z.enum(["pending", "scheduled", "in_progress", "completed", "cancelled"]);

export async function assignTechnician(bookingId: string, technicianId: string | null) {
  uuidSchema.parse(bookingId);
  if (technicianId) uuidSchema.parse(technicianId);

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("bookings")
    .update({
      technician_id: technicianId || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", bookingId);

  if (error) throw new Error(`Failed to assign technician: ${error.message}`);
}

export async function updateBookingStatus(bookingId: string, status: string) {
  uuidSchema.parse(bookingId);
  const validStatus = bookingStatusSchema.parse(status);

  const supabase = createAdminSupabaseClient();
  const updates: Record<string, unknown> = {
    status: validStatus,
    updated_at: new Date().toISOString(),
  };

  // When completing a session, mark the parent order as completed and email the customer
  if (validStatus === "completed") {
    const { data: booking } = await supabase
      .from("bookings")
      .select("order_id")
      .eq("id", bookingId)
      .single();

    if (booking) {
      await supabase
        .from("orders")
        .update({ status: "completed", updated_at: new Date().toISOString() })
        .eq("id", booking.order_id);

      // Send completion email (fire-and-forget)
      try {
        const [{ data: order }, { data: orderItems }] = await Promise.all([
          supabase
            .from("orders")
            .select("customer_id")
            .eq("id", booking.order_id)
            .single(),
          supabase
            .from("order_items")
            .select("features:feature_id(title)")
            .eq("order_id", booking.order_id),
        ]);

        if (order) {
          const { data: authUser } = await supabase.auth.admin.getUserById(order.customer_id);
          const { data: profile } = await supabase
            .from("customer_profiles")
            .select("full_name")
            .eq("user_id", order.customer_id)
            .maybeSingle();

          if (authUser?.user?.email) {
            type FeatureJoin = { title: string } | null;
            const featureNames = (orderItems ?? []).map((item) => {
              const f = (Array.isArray(item.features) ? item.features[0] : item.features) as FeatureJoin;
              return f?.title ?? "Unknown";
            });

            const email = sessionCompletionEmail({
              orderId: booking.order_id,
              customerName: profile?.full_name ?? "Customer",
              featureNames,
              completedAt: new Date().toISOString(),
            });
            sendEmail({ to: authUser.user.email, ...email });
          }
        }
      } catch (emailErr) {
        console.error("[session-actions] Completion email error:", emailErr);
      }
    }
  }

  const { error } = await supabase
    .from("bookings")
    .update(updates)
    .eq("id", bookingId);

  if (error) throw new Error(`Failed to update booking: ${error.message}`);
}

export async function setRemoteSessionLink(bookingId: string, link: string) {
  uuidSchema.parse(bookingId);
  if (link) {
    z.string().url().parse(link);
  }

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("bookings")
    .update({ remote_session_link: link, updated_at: new Date().toISOString() })
    .eq("id", bookingId);

  if (error) throw new Error(`Failed to set session link: ${error.message}`);
}

export async function setSessionStartTime(bookingId: string, startsAt: string) {
  uuidSchema.parse(bookingId);
  const parsed = z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/)).parse(startsAt);

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("bookings")
    .update({
      starts_at: new Date(parsed).toISOString(),
      status: "scheduled",
      updated_at: new Date().toISOString(),
    })
    .eq("id", bookingId);

  if (error) throw new Error(`Failed to set start time: ${error.message}`);
}

export async function addTechnicianNote(bookingId: string, technicianId: string, note: string) {
  uuidSchema.parse(bookingId);
  uuidSchema.parse(technicianId);
  z.string().trim().min(1).max(2000).parse(note);

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("technician_notes")
    .insert({ booking_id: bookingId, technician_id: technicianId, note });

  if (error) throw new Error(`Failed to add note: ${error.message}`);
}
