const faqs = [
  ["Is this a remote process?", "Yes. A technician guides you in a live remote session after checkout."],
  ["Do I need special hardware?", "Most sessions require a laptop and ENET or OBD cable. Requirements are shown before booking."],
  ["Is my payment secure?", "Checkout is processed through Stripe and session records are tied to your account."],
  ["Which brands do you support?", "We support BMW, Audi, Mercedes-Benz, Volkswagen, and Porsche. All five German brands are live."]
];

export function FAQAccordion() {
  return (
    <div className="space-y-3">
      {faqs.map(([q, a]) => (
        <details className="surface rounded-xl p-4" key={q}>
          <summary className="cursor-pointer text-sm font-medium">{q}</summary>
          <p className="mt-2 text-sm text-white/65">{a}</p>
        </details>
      ))}
    </div>
  );
}
