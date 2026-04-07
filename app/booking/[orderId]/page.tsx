import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { PremiumSection } from "@/components/marketing/PremiumSection";
import { requireUser } from "@/lib/auth/require-user";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const timelineSteps = [
  { label: "Order placed", description: "Your order has been created and payment processed." },
  { label: "Setup confirmed", description: "Pre-session requirements verified and ready." },
  { label: "Technician assigned", description: "A specialist is allocated to your session." },
  { label: "Remote session", description: "Live remote coding session with your technician." },
  { label: "Completion report", description: "Summary of all changes applied to your vehicle." },
];

function getStepIndex(orderStatus: string, bookingStatus: string | null): number {
  if (!bookingStatus || bookingStatus === "pending") return 1;
  if (bookingStatus === "scheduled") return 2;
  if (bookingStatus === "in_progress") return 3;
  if (bookingStatus === "completed") return 4;
  if (orderStatus === "completed") return 5;
  return 0;
}

export default async function BookingPage({ params }: { params: Promise<{ orderId: string }> }) {
  const user = await requireUser();
  const { orderId } = await params;
  if (!z.string().uuid().safeParse(orderId).success) notFound();
  const supabase = createAdminSupabaseClient();

  const { data: order } = await supabase
    .from("orders")
    .select("id, status, payment_status, total_usd")
    .eq("id", orderId)
    .eq("customer_id", user.id)
    .single();

  if (!order) {
    return (
      <PremiumSection eyebrow="Booking" title="Order not found">
        <div className="surface rounded-premium p-6 text-sm text-white/70">
          <p>This order could not be found or does not belong to your account.</p>
          <Link href="/dashboard/orders" className="mt-3 inline-block text-white/80 underline">Back to orders</Link>
        </div>
      </PremiumSection>
    );
  }

  const { data: booking } = await supabase
    .from("bookings")
    .select("id, status, starts_at, technician_id, remote_session_link")
    .eq("order_id", orderId)
    .maybeSingle();

  const currentStep = getStepIndex(order.status, booking?.status ?? null);

  return (
    <PremiumSection eyebrow="Booking" title={`Session timeline`}>
      <div className="surface rounded-premium p-6">
        <div className="mb-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-white/10 px-2.5 py-1">Order {order.id.slice(0, 8)}</span>
          <span className="rounded-full bg-white/10 px-2.5 py-1">{order.payment_status}</span>
          {booking ? (
            <span className="rounded-full bg-white/10 px-2.5 py-1">Session: {booking.status}</span>
          ) : null}
        </div>

        <ol className="space-y-1">
          {timelineSteps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            return (
              <li key={step.label} className="flex items-start gap-3 py-3">
                <span
                  className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                    isCompleted
                      ? "bg-emerald-400/20 text-emerald-200"
                      : isCurrent
                        ? "bg-electric/20 text-electric"
                        : "bg-white/10 text-white/40"
                  }`}
                >
                  {isCompleted ? "✓" : index + 1}
                </span>
                <div>
                  <p className={`text-sm font-medium ${isCurrent ? "text-white" : isCompleted ? "text-white/80" : "text-white/50"}`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-white/50">{step.description}</p>
                </div>
              </li>
            );
          })}
        </ol>

        {booking?.starts_at ? (
          <div className="mt-4 rounded-xl bg-white/5 p-3 text-sm text-white/70">
            Scheduled: {new Date(booking.starts_at).toLocaleString()}
          </div>
        ) : null}

        {booking?.remote_session_link &&
          (booking.status === "scheduled" || booking.status === "in_progress") ? (
          <a
            href={booking.remote_session_link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-silver px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white"
          >
            Join Remote Session ↗
          </a>
        ) : null}
      </div>

      <Link href="/dashboard/orders" className="mt-4 inline-block text-sm text-white/50 hover:text-white/80">
        ← Back to orders
      </Link>
    </PremiumSection>
  );
}
