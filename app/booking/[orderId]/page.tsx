import { BookingTimeline } from "@/components/dashboard/BookingTimeline";
import { PremiumSection } from "@/components/marketing/PremiumSection";
import { requireUser } from "@/lib/auth/require-user";

export default async function BookingPage({ params }: { params: Promise<{ orderId: string }> }) {
  await requireUser();
  const { orderId } = await params;

  return (
    <PremiumSection eyebrow="Booking" title={`Order ${orderId} session timeline`}>
      <BookingTimeline />
    </PremiumSection>
  );
}
