import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface CatalogFeature {
  id: string;
  brand: string;
  title: string;
  description: string;
  sessionMinutes: number;
  priceUsd: number;
}

interface GetFeaturesOptions {
  limit?: number;
  offset?: number;
}

export async function getFeatures(options: GetFeaturesOptions = {}): Promise<CatalogFeature[]> {
  const supabase = await createServerSupabaseClient();
  const limit = options.limit ?? 12;
  const offset = options.offset ?? 0;

  const { data, error } = await supabase
    .from("features")
    .select("id, brand, title, description, session_minutes, base_price_usd")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`Failed to fetch features: ${error.message}`);
  }

  return (data ?? []).map((feature) => ({
    id: feature.id,
    brand: feature.brand,
    title: feature.title,
    description: feature.description,
    sessionMinutes: feature.session_minutes,
    priceUsd: feature.base_price_usd
  }));
}

export async function getFeatureById(id: string): Promise<CatalogFeature | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("features")
    .select("id, brand, title, description, session_minutes, base_price_usd")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch feature: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    brand: data.brand,
    title: data.title,
    description: data.description,
    sessionMinutes: data.session_minutes,
    priceUsd: data.base_price_usd
  };
}
