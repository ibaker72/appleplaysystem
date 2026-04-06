import type { Metadata } from "next";
import { PremiumSection } from "@/components/marketing/PremiumSection";
import { FAQAccordion } from "@/components/marketing/FAQAccordion";

export const metadata: Metadata = {
  title: "FAQ | Remote German Auto Feature Unlock",
  description: "Frequently asked questions about remote BMW coding sessions, compatibility, pricing, and the unlock process.",
};

export default function FAQPage() {
  return <PremiumSection eyebrow="FAQ" title="Common questions before booking"><FAQAccordion /></PremiumSection>;
}
