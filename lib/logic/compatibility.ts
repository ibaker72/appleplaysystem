import { compatibilityRules, features } from "@/lib/data/mock";
import type { CompatibilityResult } from "@/lib/types/domain";

interface Input {
  brand: string;
  model: string;
  year: number;
  chassis: string;
  headUnit?: string;
}

export function checkCompatibility(input: Input): CompatibilityResult {
  if (input.brand !== "BMW") {
    return {
      status: "limited",
      recommendedFeatures: [],
      estimatedMinutes: 0,
      setupRequirements: ["Audi and Mercedes support is launching soon."],
      estimatedPrice: 0
    };
  }

  const eligible = compatibilityRules
    .filter(
      (rule) =>
        input.year >= rule.minYear &&
        input.year <= rule.maxYear &&
        rule.chassis.includes(input.chassis) &&
        (!input.headUnit || rule.headUnits?.includes(input.headUnit))
    )
    .map((rule) => features.find((feature) => feature.id === rule.featureId))
    .filter((feature): feature is (typeof features)[number] => Boolean(feature));

  if (!eligible.length) {
    return {
      status: "not_supported",
      recommendedFeatures: [],
      estimatedMinutes: 0,
      setupRequirements: ["Please submit VIN for manual review."],
      estimatedPrice: 0
    };
  }

  const top = eligible.slice(0, 4);
  return {
    status: "compatible",
    recommendedFeatures: top,
    estimatedMinutes: top.reduce((sum, feature) => sum + feature.sessionMinutes, 0),
    setupRequirements: ["Mac or Windows laptop", "Stable Wi-Fi", "ENET or OBD cable", "Vehicle battery charger recommended"],
    estimatedPrice: top.reduce((sum, feature) => sum + feature.priceUsd, 0)
  };
}
