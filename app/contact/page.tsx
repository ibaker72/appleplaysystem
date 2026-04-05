import { PremiumSection } from "@/components/marketing/PremiumSection";

export default function ContactPage() {
  return (
    <PremiumSection eyebrow="Contact" title="Talk with the support team">
      <div className="surface rounded-premium p-6 text-sm text-white/70">
        <p>Email: support@remotecodede.example</p>
        <p className="mt-2">Sales and fleet partnerships: partners@remotecodede.example</p>
      </div>
    </PremiumSection>
  );
}
