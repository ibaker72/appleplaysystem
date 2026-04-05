import Link from "next/link";
import { redirect } from "next/navigation";
import { CompatibilityResultCard } from "@/components/compatibility/CompatibilityResultCard";
import { PremiumSection } from "@/components/marketing/PremiumSection";
import { getCompatibleFeatures } from "@/lib/compatibility/get-compatible-features";
import { getUser } from "@/lib/auth/get-user";
import { saveVehicle } from "@/lib/vehicles/save-vehicle";
import { createOrder } from "@/lib/orders/create-order";

async function saveVehicleAction(formData: FormData) {
  "use server";
  const user = await getUser();
  const brand = String(formData.get("brand") ?? "");
  const model = String(formData.get("model") ?? "");
  const year = String(formData.get("year") ?? "");
  const chassis = String(formData.get("chassis") ?? "");
  const headUnit = String(formData.get("headUnit") ?? "");

  if (!user) {
    const next = `/check-compatibility/results?${new URLSearchParams({ brand, model, year, chassis, headUnit }).toString()}`;
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }

  await saveVehicle({
    customerId: user.id,
    brand,
    model,
    year: Number(year),
    chassis,
    headUnit,
    vin: String(formData.get("vin") ?? ""),
  });

  redirect("/dashboard/vehicles?saved=1");
}

async function createOrderAction(formData: FormData) {
  "use server";
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  const brand = String(formData.get("brand"));
  const model = String(formData.get("model"));
  const year = Number(formData.get("year"));
  const chassis = String(formData.get("chassis"));
  const headUnit = String(formData.get("headUnit"));
  const vin = String(formData.get("vin") ?? "");
  const configId = String(formData.get("configId") ?? "");
  const selectedFeatureIds = formData.getAll("feature_ids").map((v) => String(v));

  if (selectedFeatureIds.length === 0) {
    const returnUrl = `/check-compatibility/results?${new URLSearchParams({ brand, model, year: String(year), chassis, headUnit }).toString()}&error=${encodeURIComponent("Please select at least one feature.")}`;
    redirect(returnUrl);
  }

  const vehicle = await saveVehicle({ customerId: user.id, brand, model, year, chassis, headUnit, vin });

  const order = await createOrder(
    { vehicleId: vehicle.id, configId, selectedFeatureIds },
    { customerId: user.id, compatibilityInput: { brand, model, year, chassis, headUnit } }
  );

  redirect(`/dashboard/orders?created=${order.orderId}`);
}

export default async function CompatibilityResultsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const brand = String(params.brand ?? "BMW");
  const model = String(params.model ?? "");
  const year = Number(params.year ?? 0);
  const chassis = String(params.chassis ?? "");
  const headUnit = String(params.headUnit ?? "");
  const vin = String(params.vin ?? "");
  const errorMsg = params.error ? String(params.error) : null;

  // Validate minimum required inputs
  if (!model || !year || !chassis) {
    return (
      <PremiumSection eyebrow="Results" title="Missing vehicle details">
        <div className="surface rounded-premium p-6 text-sm text-white/70">
          <p>Please provide your vehicle model, year, and chassis code.</p>
          <Link href="/check-compatibility" className="mt-4 inline-block text-white/80 underline">
            Back to compatibility checker
          </Link>
        </div>
      </PremiumSection>
    );
  }

  const result = await getCompatibleFeatures({ brand, model, year, chassis, headUnit });
  const user = await getUser();

  return (
    <PremiumSection eyebrow="Results" title="Compatibility results">
      <div className="space-y-6">
        <CompatibilityResultCard result={result} />

        {errorMsg ? <p className="text-sm text-red-300">{errorMsg}</p> : null}

        {result.compatibleFeatures.length > 0 ? (
          <form action={createOrderAction} className="surface space-y-4 rounded-premium p-6">
            <p className="text-sm text-white/70">Select features to include in your order.</p>
            {result.compatibleFeatures.map((feature) => (
              <label
                key={feature.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-white/10 p-3 transition hover:border-white/20"
              >
                <span>
                  <span className="block text-sm font-medium">{feature.title}</span>
                  <span className="text-xs text-white/65">{feature.description}</span>
                </span>
                <span className="flex flex-col items-end gap-1">
                  <input type="checkbox" name="feature_ids" value={feature.id} className="h-4 w-4 accent-white" defaultChecked />
                  <span className="text-xs text-white/70">${feature.basePriceUsd}</span>
                </span>
              </label>
            ))}
            <input type="hidden" name="brand" value={brand} />
            <input type="hidden" name="model" value={model} />
            <input type="hidden" name="year" value={String(year)} />
            <input type="hidden" name="chassis" value={chassis} />
            <input type="hidden" name="headUnit" value={headUnit} />
            <input type="hidden" name="vin" value={vin} />
            <input type="hidden" name="configId" value={result.matchedConfigId ?? ""} />
            {user ? (
              <button type="submit" className="rounded-xl bg-silver px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white">
                Create order
              </button>
            ) : (
              <Link
                href={`/login?next=${encodeURIComponent(`/check-compatibility/results?${new URLSearchParams({ brand, model, year: String(year), chassis, headUnit }).toString()}`)}`}
                className="inline-block rounded-xl bg-silver px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white"
              >
                Sign in to order
              </Link>
            )}
          </form>
        ) : null}

        <form action={saveVehicleAction} className="surface rounded-premium p-6">
          <p className="mb-3 text-sm text-white/60">Save this vehicle to your dashboard for future reference.</p>
          <input type="hidden" name="brand" value={brand} />
          <input type="hidden" name="model" value={model} />
          <input type="hidden" name="year" value={String(year)} />
          <input type="hidden" name="chassis" value={chassis} />
          <input type="hidden" name="headUnit" value={headUnit} />
          <input type="hidden" name="vin" value={vin} />
          <button
            type="submit"
            className="rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
          >
            {user ? "Save vehicle to dashboard" : "Sign in to save vehicle"}
          </button>
        </form>

        <Link href="/check-compatibility" className="inline-block text-sm text-white/50 hover:text-white/80">
          ← Check another vehicle
        </Link>
      </div>
    </PremiumSection>
  );
}
