import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireUser } from "@/lib/auth/require-user";
import { getUserVehicles } from "@/lib/vehicles/save-vehicle";
import { getUserOrders } from "@/lib/orders/get-user-orders";
import { getUserBookings } from "@/lib/bookings/get-user-bookings";

interface ChecklistStep {
  label: string;
  done: boolean;
  href: string;
  cta: string;
}

export default async function DashboardPage() {
  const user = await requireUser("/dashboard");

  let vehicles: Awaited<ReturnType<typeof getUserVehicles>> = [];
  let orders: Awaited<ReturnType<typeof getUserOrders>> = [];
  let bookings: Awaited<ReturnType<typeof getUserBookings>> = [];

  try {
    [vehicles, orders, bookings] = await Promise.all([
      getUserVehicles(user.id),
      getUserOrders(user.id),
      getUserBookings(user.id),
    ]);
  } catch {
    // Graceful degradation — show empty states
  }

  const nextBooking = bookings.find((b) => b.status === "pending" || b.status === "scheduled");
  const setupReqs = (nextBooking as Record<string, unknown> | undefined)?.setup_requirements as
    | { completed: boolean }[]
    | undefined;
  const checklist = setupReqs ?? [];
  const completed = checklist.filter((item) => item.completed).length;

  const hasPaidOrder = orders.some((o) => o.payment_status === "paid");
  const hasBooking = bookings.length > 0;
  const isFirstUser = vehicles.length === 0 && orders.length === 0;

  const onboardingSteps: ChecklistStep[] = [
    { label: "Check vehicle compatibility", done: vehicles.length > 0, href: "/check-compatibility", cta: "Check now" },
    { label: "Save your vehicle", done: vehicles.length > 0, href: "/dashboard/vehicles", cta: "Add vehicle" },
    { label: "Choose features to unlock", done: orders.length > 0, href: "/features", cta: "Browse features" },
    { label: "Complete checkout", done: hasPaidOrder, href: "/dashboard/orders", cta: "View orders" },
    { label: "Book your remote session", done: hasBooking, href: "/dashboard/sessions", cta: "View sessions" },
  ];

  const stepsCompleted = onboardingSteps.filter((s) => s.done).length;
  const allDone = stepsCompleted === onboardingSteps.length;
  const nextStep = onboardingSteps.find((s) => !s.done);

  return (
    <DashboardShell title="Owner Dashboard">
      {/* Onboarding card for new / incomplete users */}
      {!allDone && (
        <div className="surface rounded-premium p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                {isFirstUser ? "Welcome — let\u2019s get started" : "Getting started"}
              </h3>
              <p className="mt-1 text-sm text-white/60">
                {isFirstUser
                  ? "Follow these steps to unlock premium features on your vehicle."
                  : `${stepsCompleted} of ${onboardingSteps.length} steps complete`}
              </p>
            </div>
            {!isFirstUser && (
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
                {Math.round((stepsCompleted / onboardingSteps.length) * 100)}%
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all"
              style={{ width: `${(stepsCompleted / onboardingSteps.length) * 100}%` }}
            />
          </div>

          {/* Steps */}
          <ol className="mt-4 space-y-2">
            {onboardingSteps.map((step, i) => (
              <li key={step.label} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      step.done
                        ? "bg-emerald-400/20 text-emerald-300"
                        : "bg-white/10 text-white/50"
                    }`}
                  >
                    {step.done ? "\u2713" : i + 1}
                  </span>
                  <span className={step.done ? "text-white/50 line-through" : "text-white/80"}>
                    {step.label}
                  </span>
                </div>
                {!step.done && (
                  <Link
                    href={step.href}
                    className="rounded-lg bg-white/10 px-3 py-1 text-xs font-medium text-white/80 transition hover:bg-white/20"
                  >
                    {step.cta}
                  </Link>
                )}
              </li>
            ))}
          </ol>

          {/* Primary CTA for first step */}
          {nextStep && isFirstUser && (
            <Link
              href={nextStep.href}
              className="mt-5 inline-block rounded-xl bg-silver px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white"
            >
              {nextStep.cta} →
            </Link>
          )}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="surface rounded-premium p-5">
          <p className="text-sm text-white/60">Saved vehicles</p>
          <p className="mt-2 text-3xl font-semibold">{vehicles.length}</p>
          <Link href="/dashboard/vehicles" className="mt-2 inline-block text-sm text-white/70 hover:text-white">
            {vehicles.length === 0 ? "Add your first vehicle →" : "Manage vehicles →"}
          </Link>
        </div>
        <div className="surface rounded-premium p-5">
          <p className="text-sm text-white/60">Orders</p>
          <p className="mt-2 text-3xl font-semibold">{orders.length}</p>
          <Link href="/dashboard/orders" className="mt-2 inline-block text-sm text-white/70 hover:text-white">
            {orders.length === 0 ? "Browse features →" : "View orders →"}
          </Link>
        </div>
        <div className="surface rounded-premium p-5">
          <p className="text-sm text-white/60">Sessions</p>
          <p className="mt-2 text-3xl font-semibold">{bookings.length}</p>
          <Link href="/dashboard/sessions" className="mt-2 inline-block text-sm text-white/70 hover:text-white">
            {bookings.length === 0 ? "Complete an order first →" : "View sessions →"}
          </Link>
        </div>
      </div>

      {/* Upcoming session */}
      {nextBooking ? (
        <div className="surface rounded-premium p-5">
          <h3 className="text-lg font-medium">Upcoming session</h3>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-white/10 px-2.5 py-1">{nextBooking.status}</span>
            <span className="rounded-full bg-white/10 px-2.5 py-1">
              {nextBooking.starts_at ? new Date(nextBooking.starts_at).toLocaleString() : "Not scheduled"}
            </span>
          </div>
          {checklist.length > 0 ? (
            <div className="mt-3">
              <p className="text-sm text-white/60">
                Setup progress: {completed}/{checklist.length}
              </p>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all"
                  style={{ width: `${(completed / checklist.length) * 100}%` }}
                />
              </div>
            </div>
          ) : null}
          <Link
            className="mt-3 inline-block text-sm text-white/80 underline"
            href={`/setup-instructions/${nextBooking.order_id}`}
          >
            Open setup instructions
          </Link>
        </div>
      ) : !isFirstUser ? (
        <EmptyState
          title="No upcoming sessions"
          description="Complete checkout on an order and your next session will appear here."
        />
      ) : null}
    </DashboardShell>
  );
}
