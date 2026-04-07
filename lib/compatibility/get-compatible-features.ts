import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { CompatibilityInput, CompatibilityResult } from "@/types/compatibility";

export async function getCompatibleFeatures(input: CompatibilityInput): Promise<CompatibilityResult> {
  const supabase = await createServerSupabaseClient();

  // Build the config query. head_unit may be null in the DB for configs that
  // support any head unit, so we match either exact or null.
  let configQuery = supabase
    .from("supported_vehicle_configs")
    .select("id, brand, model, chassis, head_unit, min_year, max_year")
    .eq("brand", input.brand)
    .eq("model", input.model)
    .eq("chassis", input.chassis)
    .lte("min_year", input.year)
    .gte("max_year", input.year);

  // Only filter by head_unit if the user specified one
  if (input.headUnit && input.headUnit.trim()) {
    configQuery = configQuery.or(`head_unit.eq.${input.headUnit},head_unit.is.null`);
  }

  const { data: configs, error: configError } = await configQuery;

  if (configError) {
    throw new Error(`Failed to query compatibility: ${configError.message}`);
  }

  // Prefer an exact head_unit match over a null (wildcard) match
  const config = configs?.find((c) => c.head_unit === input.headUnit)
    ?? configs?.find((c) => c.head_unit === null)
    ?? null;

  if (!config) {
    return {
      supported: false,
      status: "not_supported",
      reason: "No supported vehicle configuration matched your inputs. Check your chassis code and head unit.",
      compatibleFeatures: [],
      estimatedSessionMinutes: 0,
      estimatedTotalUsd: 0,
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
      id: feature.id as string,
      title: feature.title as string,
      description: feature.description as string,
      sessionMinutes: feature.session_minutes as number,
      basePriceUsd: feature.base_price_usd as number,
    };
  });

  if (compatibleFeatures.length === 0) {
    return {
      supported: false,
      status: "not_supported",
      reason: "Your vehicle configuration is recognized, but no compatible features are currently available.",
      matchedConfigId: config.id,
      matchedConfig: {
        brand: config.brand,
        model: config.model,
        chassis: config.chassis,
        headUnit: config.head_unit ?? "",
        minYear: config.min_year,
        maxYear: config.max_year,
      },
      compatibleFeatures: [],
      estimatedSessionMinutes: 0,
      estimatedTotalUsd: 0,
    };
  }

  return {
    supported: true,
    status: "compatible",
    matchedConfigId: config.id,
    matchedConfig: {
      brand: config.brand,
      model: config.model,
      chassis: config.chassis,
      headUnit: config.head_unit ?? "",
      minYear: config.min_year,
      maxYear: config.max_year,
    },
    compatibleFeatures,
    estimatedSessionMinutes: compatibleFeatures.reduce((sum, f) => sum + f.sessionMinutes, 0),
    estimatedTotalUsd: compatibleFeatures.reduce((sum, f) => sum + f.basePriceUsd, 0),
  };
}
