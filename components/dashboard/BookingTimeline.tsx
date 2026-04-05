const steps = ["Order placed", "Setup confirmed", "Technician assigned", "Remote session", "Completion report"];

export function BookingTimeline() {
  return (
    <ol className="surface rounded-premium p-5 text-sm">
      {steps.map((step, index) => (
        <li key={step} className="flex items-center gap-3 py-2 text-white/75">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs">{index + 1}</span>
          {step}
        </li>
      ))}
    </ol>
  );
}
