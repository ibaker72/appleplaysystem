import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { CompatibilityInput, CompatibilityResult } from "@/types/compatibility";

export async function getCompatibleFeatures(input: CompatibilityInput): Promise<CompatibilityResult> {
  const supabase = await createServerSupabaseClient();

  const { data: config, error: configError } = await supabase
    .from("supported_vehicle_configs")
    .select("id, brand, model, chassis, head_unit, min_year, max_year")
    .eq("brand", input.brand)
    .eq("model", input.model)
    .eq("chassis", input.chassis)
    .eq("head_unit", input.headUnit)
    .lte("min_year", input.year)
    .gte("max_year", input.year)
    .maybeSingle();

  if (configError) {
    throw new Error(`Failed to query compatibility: ${configError.message}`);
  }

  if (!config) {
    return {
      supported: false,
      status: "not_supported",
      reason: "No supported vehicle configuration matched your inputs.",
      compatibleFeatures: [],
      estimatedSessionMinutes: 0,
      estimatedTotalUsd: 0
    };
  }

  const { data: rules, error: rulesError } = await supabase
    .from("feature_compatibility_rules")
    .select(`
      feature_id,
      features!inner(id, title, description, session_minutes, base_price_usd)
    `)
    .eq("config_id", config.id);

  if (rulesError) {
    throw new Error(`Failed to query compatibility rules: ${rulesError.message}`);
  }

  const compatibleFeatures = (rules ?? []).map((rule) => {
    const feature = Array.isArray(rule.features) ? rule.features[0] : rule.features;
    return {
      id: feature.id,
      title: feature.title,
      description: feature.description,
      sessionMinutes: feature.session_minutes,
      basePriceUsd: feature.base_price_usd
    };
  });

  return {
    supported: compatibleFeatures.length > 0,
    status: compatibleFeatures.length > 0 ? "compatible" : "not_supported",
    reason: compatibleFeatures.length > 0 ? undefined : "No compatible features were found for this exact configuration.",
    matchedConfigId: config.id,
    matchedConfig: {
      brand: config.brand,
      model: config.model,
      chassis: config.chassis,
      headUnit: config.head_unit,
      minYear: config.min_year,
      maxYear: config.max_year
    },
    compatibleFeatures,
    estimatedSessionMinutes: compatibleFeatures.reduce((sum, feature) => sum + feature.sessionMinutes, 0),
    estimatedTotalUsd: compatibleFeatures.reduce((sum, feature) => sum + feature.basePriceUsd, 0)
  };
}
