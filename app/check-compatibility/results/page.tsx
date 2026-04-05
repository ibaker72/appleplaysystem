import { CompatibilityResultCard } from "@/components/compatibility/CompatibilityResultCard";
import { PremiumSection } from "@/components/marketing/PremiumSection";
import { checkCompatibility } from "@/lib/logic/compatibility";

export default async function CompatibilityResultsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const result = checkCompatibility({
    brand: String(params.brand ?? "BMW"),
    model: String(params.model ?? "3 Series"),
    year: Number(params.year ?? 2021),
    chassis: String(params.chassis ?? "G20"),
    headUnit: String(params.headUnit ?? "MGU")
  });

  return <PremiumSection eyebrow="Results" title="Compatibility results"><CompatibilityResultCard result={result} /></PremiumSection>;
}
