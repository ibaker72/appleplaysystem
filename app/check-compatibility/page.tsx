import type { Metadata } from "next";
import { PremiumSection } from "@/components/marketing/PremiumSection";
import { CompatibilityForm } from "@/components/compatibility/CompatibilityForm";

export const metadata: Metadata = {
  title: "Check Compatibility | Vehicle Feature Unlock",
  description: "Enter your vehicle details to check which remote coding features are available for your BMW, Audi, Mercedes-Benz, Volkswagen, or Porsche.",
};

export default function CompatibilityPage() {
  return <PremiumSection eyebrow="Compatibility" title="Configure your vehicle and view eligible unlocks"><CompatibilityForm /></PremiumSection>;
}
