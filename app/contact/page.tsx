import type { Metadata } from "next";
import { PremiumSection } from "@/components/marketing/PremiumSection";

export const metadata: Metadata = {
  title: "Contact | Remote Code DE Support",
  description: "Get in touch with the Remote Code DE support team for questions about BMW remote coding sessions.",
};

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
