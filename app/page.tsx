import { HeroShell } from "@/components/marketing/HeroShell";
import { PremiumSection } from "@/components/marketing/PremiumSection";
import { BrandPill } from "@/components/marketing/BrandPill";
import { FeatureCard } from "@/components/marketing/FeatureCard";
import { PremiumCTA } from "@/components/marketing/PremiumCTA";
import { FAQAccordion } from "@/components/marketing/FAQAccordion";
import { features } from "@/lib/data/mock";

export default function HomePage() {
  return (
    <>
      <HeroShell />
      <PremiumSection eyebrow="Coverage" title="Supported brands">
        <div className="grid gap-3 sm:grid-cols-3">
          <BrandPill name="BMW" status="Live now" />
          <BrandPill name="Audi" status="Coming soon" />
          <BrandPill name="Mercedes-Benz" status="Coming soon" />
        </div>
      </PremiumSection>
      <PremiumSection eyebrow="Process" title="How it works">
        <div className="grid gap-3 md:grid-cols-4 text-sm text-white/70">
          {["Check compatibility", "Select features", "Secure checkout", "Book remote session"].map((step, i) => (
            <div className="surface rounded-xl p-4" key={step}><p className="text-white/40">0{i + 1}</p><p className="mt-2 font-medium text-white">{step}</p></div>
          ))}
        </div>
      </PremiumSection>
      <PremiumSection eyebrow="Popular unlocks" title="Configured like premium vehicle options">
        <div className="grid gap-4 md:grid-cols-3">{features.slice(0, 6).map((feature) => <FeatureCard key={feature.id} feature={feature} />)}</div>
      </PremiumSection>
      <PremiumSection eyebrow="Trust" title="Built for secure, guided remote sessions">
        <div className="grid gap-3 md:grid-cols-3 text-sm">
          {[
            ["Technician-led", "Every session is managed by a trained specialist."],
            ["Secure checkout", "Payments are handled by Stripe with order tracking."],
            ["Setup clarity", "You receive exact prep requirements before booking."]
          ].map(([t, d]) => <div key={t} className="surface rounded-xl p-4"><h3 className="font-medium">{t}</h3><p className="mt-2 text-white/65">{d}</p></div>)}
        </div>
      </PremiumSection>
      <PremiumSection eyebrow="Questions" title="FAQ"><FAQAccordion /></PremiumSection>
      <PremiumCTA />
    </>
  );
}
