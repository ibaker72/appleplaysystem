import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getCronSecret, getSiteUrl } from "@/lib/env";
import { sendEmail } from "@/lib/email/send";
import { bookingReminderEmail } from "@/lib/email/templates";

export async function GET(request: Request) {
  const cronSecret = getCronSecret();
  if (!cronSecret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminSupabaseClient();
  const now = new Date();
  const from = new Date(now.getTime() + 23 * 60 * 60 * 1000).toISOString();
  const to = new Date(now.getTime() + 25 * 60 * 60 * 1000).toISOString();

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("id, order_id, starts_at, orders!inner(customer_id, customer_profiles:customer_id(full_name))")
    .eq("status", "scheduled")
    .gte("starts_at", from)
    .lte("starts_at", to);

  if (error) {
    console.error("[cron/booking-reminders] Query error:", error.message);
    return NextResponse.json({ error: "Failed to query bookings" }, { status: 500 });
  }

  let sentCount = 0;
  const siteUrl = getSiteUrl();

  for (const booking of bookings ?? []) {
    try {
      const order = booking.orders as unknown as {
        customer_id: string;
        customer_profiles: { full_name: string | null } | null;
      };

      const { data: authUser } = await supabase.auth.admin.getUserById(order.customer_id);
      if (!authUser?.user?.email) continue;

      const email = bookingReminderEmail({
        orderId: booking.order_id,
        startsAt: booking.starts_at!,
        customerName: order.customer_profiles?.full_name ?? "Customer",
        setupLink: `${siteUrl}/setup-instructions`,
      });

      await sendEmail({ to: authUser.user.email, ...email });
      sentCount++;
    } catch (err) {
      console.error("[cron/booking-reminders] Error sending reminder:", err);
    }
  }

  return NextResponse.json({ sent: sentCount });
}
