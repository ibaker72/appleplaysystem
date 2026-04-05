import { SetupChecklist } from "@/components/dashboard/SetupChecklist";
import { PremiumSection } from "@/components/marketing/PremiumSection";

export default async function SetupInstructionsPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return (
    <PremiumSection eyebrow="Setup" title={`Pre-session setup for order ${orderId}`}>
      <SetupChecklist />
    </PremiumSection>
  );
}
