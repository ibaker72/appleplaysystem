import "server-only";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function assignTechnician(bookingId: string, technicianId: string | null) {
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
  const validStatuses = ["pending", "scheduled", "in_progress", "completed", "cancelled"];
  if (!validStatuses.includes(status)) throw new Error("Invalid booking status");

  const supabase = createAdminSupabaseClient();
  const updates: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };

  // When completing a session, also mark the parent order as completed
  if (status === "completed") {
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
    }
  }

  const { error } = await supabase
    .from("bookings")
    .update(updates)
    .eq("id", bookingId);

  if (error) throw new Error(`Failed to update booking: ${error.message}`);
}

export async function setRemoteSessionLink(bookingId: string, link: string) {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("bookings")
    .update({ remote_session_link: link, updated_at: new Date().toISOString() })
    .eq("id", bookingId);

  if (error) throw new Error(`Failed to set session link: ${error.message}`);
}

export async function addTechnicianNote(bookingId: string, technicianId: string, note: string) {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("technician_notes")
    .insert({ booking_id: bookingId, technician_id: technicianId, note });

  if (error) throw new Error(`Failed to add note: ${error.message}`);
}
