import { PremiumSection } from "@/components/marketing/PremiumSection";

export default function HowItWorksPage() {
  return (
    <PremiumSection eyebrow="How it works" title="A precise remote workflow from checkout to completion">
      <div className="grid gap-3 md:grid-cols-2">
        {["1. Compatibility review", "2. Feature selection + payment", "3. Setup confirmation", "4. Remote technician session", "5. Validation and completion report"].map((item) => (
          <div key={item} className="surface rounded-xl p-4 text-sm text-white/75">{item}</div>
        ))}
      </div>
    </PremiumSection>
  );
}
