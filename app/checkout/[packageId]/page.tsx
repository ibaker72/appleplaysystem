import { Button } from "@/components/ui/button";
import { PremiumSection } from "@/components/marketing/PremiumSection";
import { features } from "@/lib/data/mock";

export default async function CheckoutPage({ params }: { params: Promise<{ packageId: string }> }) {
  const { packageId } = await params;
  const feature = features.find((item) => item.id === packageId);

  if (!feature) {
    return <PremiumSection eyebrow="Checkout" title="Package not found"><p className="text-sm text-white/60">Please return to the feature catalog and select a valid package.</p></PremiumSection>;
  }

  return (
    <PremiumSection eyebrow="Checkout" title={`Secure checkout · ${feature.title}`}>
      <div className="surface rounded-premium p-6 text-sm text-white/75">
        <p>Amount: ${feature.priceUsd}</p>
        <p className="mt-1">Estimated session: {feature.sessionMinutes} min</p>
        <p className="mt-4 text-white/60">Use Stripe Checkout API route at <code className="text-white">/api/stripe/checkout</code>.</p>
        <Button href="/booking/o1" className="mt-6">Continue to Booking</Button>
      </div>
    </PremiumSection>
  );
}
