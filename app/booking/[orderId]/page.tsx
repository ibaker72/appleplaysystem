import { BookingTimeline } from "@/components/dashboard/BookingTimeline";
import { PremiumSection } from "@/components/marketing/PremiumSection";

export default async function BookingPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return (
    <PremiumSection eyebrow="Booking" title={`Order ${orderId} session timeline`}>
      <BookingTimeline />
    </PremiumSection>
  );
}
