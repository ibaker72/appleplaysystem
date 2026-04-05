import { PremiumSection } from "@/components/marketing/PremiumSection";
import { CheckoutFeatureClient } from "@/components/checkout/CheckoutFeatureClient";
import { getFeatureById } from "@/lib/features/get-features";
import { getUser } from "@/lib/auth/get-user";

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ packageId: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { packageId } = await params;
  const query = await searchParams;
  const feature = await getFeatureById(packageId);

  if (!feature) {
    return (
      <PremiumSection eyebrow="Checkout" title="Package not found">
        <p className="text-sm text-white/60">
          This feature could not be found. It may have been removed or the link is invalid.
        </p>
        <a
          href="/features"
          className="mt-4 inline-block rounded-xl bg-silver px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white"
        >
          Browse features
        </a>
      </PremiumSection>
    );
  }

  const user = await getUser();

  return (
    <PremiumSection eyebrow="Checkout" title={`Secure checkout · ${feature.title}`}>
      {query.checkout === "cancelled" && (
        <div className="mb-4 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-200">
          Checkout was cancelled. You can try again below.
        </div>
      )}
      <div className="surface rounded-premium p-6">
        <div className="space-y-3 text-sm text-white/75">
          <div className="flex justify-between border-b border-white/10 pb-3">
            <span>Feature</span>
            <span className="font-medium text-white">{feature.title}</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-3">
            <span>Brand</span>
            <span className="text-white">{feature.brand}</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-3">
            <span>Estimated session</span>
            <span className="text-white">{feature.sessionMinutes} min</span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="font-medium text-white">Total</span>
            <span className="text-lg font-semibold text-white">${feature.priceUsd}</span>
          </div>
        </div>

        <div className="mt-6">
          {user ? (
            <CheckoutFeatureClient featureId={feature.id} featureTitle={feature.title} priceUsd={feature.priceUsd} />
          ) : (
            <div className="space-y-3 text-center">
              <p className="text-sm text-white/60">Sign in to complete your purchase</p>
              <a
                href={`/login?next=/checkout/${feature.id}`}
                className="inline-block rounded-xl bg-silver px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white"
              >
                Sign in to continue
              </a>
            </div>
          )}
        </div>
      </div>
    </PremiumSection>
  );
}
