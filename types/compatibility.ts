export interface CompatibilityInput {
  brand: string;
  model: string;
  year: number;
  chassis: string;
  headUnit: string;
}

export interface CompatibleFeature {
  id: string;
  title: string;
  description: string;
  sessionMinutes: number;
  basePriceUsd: number;
}

export interface CompatibilityResult {
  supported: boolean;
  status: "compatible" | "not_supported";
  reason?: string;
  matchedConfigId?: string;
  matchedConfig?: {
    brand: string;
    model: string;
    chassis: string;
    headUnit: string;
    minYear: number;
    maxYear: number;
  };
  compatibleFeatures: CompatibleFeature[];
  estimatedSessionMinutes: number;
  estimatedTotalUsd: number;
}
