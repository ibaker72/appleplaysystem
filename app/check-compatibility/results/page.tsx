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
  if (!user) {
    const next = `/check-compatibility/results?${new URLSearchParams({
      brand: String(formData.get("brand") ?? ""),
      model: String(formData.get("model") ?? ""),
      year: String(formData.get("year") ?? ""),
      chassis: String(formData.get("chassis") ?? ""),
      headUnit: String(formData.get("headUnit") ?? "")
    }).toString()}`;
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }

  await saveVehicle({
    customerId: user.id,
    brand: String(formData.get("brand")),
    model: String(formData.get("model")),
    year: Number(formData.get("year")),
    chassis: String(formData.get("chassis")),
    headUnit: String(formData.get("headUnit")),
    vin: String(formData.get("vin") ?? "")
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

  const vehicle = await saveVehicle({ customerId: user.id, brand, model, year, chassis, headUnit, vin });

  const order = await createOrder(
    {
      vehicleId: vehicle.id,
      configId,
      selectedFeatureIds
    },
    {
      customerId: user.id,
      compatibilityInput: { brand, model, year, chassis, headUnit }
    }
  );

  redirect(`/dashboard/orders?created=${order.orderId}`);
}

export default async function CompatibilityResultsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const brand = String(params.brand ?? "BMW");
  const model = String(params.model ?? "3 Series");
  const year = Number(params.year ?? 2021);
  const chassis = String(params.chassis ?? "G20");
  const headUnit = String(params.headUnit ?? "MGU");
  const vin = String(params.vin ?? "");
  const result = await getCompatibleFeatures({ brand, model, year, chassis, headUnit });

  return (
    <PremiumSection eyebrow="Results" title="Compatibility results">
      <div className="space-y-6">
        <CompatibilityResultCard result={result} />

        {result.compatibleFeatures.length > 0 ? (
          <form action={createOrderAction} className="surface space-y-4 rounded-premium p-6">
            <p className="text-sm text-white/70">Select features to include in your order.</p>
            {result.compatibleFeatures.map((feature) => (
              <label key={feature.id} className="flex items-start justify-between gap-3 rounded-xl border border-white/10 p-3">
                <span>
                  <span className="block text-sm font-medium">{feature.title}</span>
                  <span className="text-xs text-white/65">{feature.description}</span>
                </span>
                <span className="text-right">
                  <input type="checkbox" name="feature_ids" value={feature.id} className="h-4 w-4 accent-white" defaultChecked />
                  <span className="mt-1 block text-xs text-white/70">${feature.basePriceUsd}</span>
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
            <button type="submit" className="rounded-xl bg-silver px-5 py-2.5 text-sm font-medium text-black">Create order</button>
          </form>
        ) : null}

        <form action={saveVehicleAction} className="surface rounded-premium p-6">
          <input type="hidden" name="brand" value={brand} />
          <input type="hidden" name="model" value={model} />
          <input type="hidden" name="year" value={String(year)} />
          <input type="hidden" name="chassis" value={chassis} />
          <input type="hidden" name="headUnit" value={headUnit} />
          <input type="hidden" name="vin" value={vin} />
          <button type="submit" className="rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-white">Save vehicle to dashboard</button>
        </form>
      </div>
    </PremiumSection>
  );
}
