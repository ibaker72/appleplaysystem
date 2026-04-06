import "server-only";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function createFeature(input: {
  brand: string;
  title: string;
  description: string;
  sessionMinutes: number;
  basePriceUsd: number;
}) {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("features")
    .insert({
      brand: input.brand,
      title: input.title,
      description: input.description,
      session_minutes: input.sessionMinutes,
      base_price_usd: input.basePriceUsd,
    })
    .select("id")
    .single();

  if (error) throw new Error(`Failed to create feature: ${error.message}`);
  return data;
}

export async function updateFeature(
  featureId: string,
  input: {
    title?: string;
    description?: string;
    sessionMinutes?: number;
    basePriceUsd?: number;
  }
) {
  const supabase = createAdminSupabaseClient();
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.title !== undefined) updates.title = input.title;
  if (input.description !== undefined) updates.description = input.description;
  if (input.sessionMinutes !== undefined) updates.session_minutes = input.sessionMinutes;
  if (input.basePriceUsd !== undefined) updates.base_price_usd = input.basePriceUsd;

  const { error } = await supabase.from("features").update(updates).eq("id", featureId);
  if (error) throw new Error(`Failed to update feature: ${error.message}`);
}

export async function deleteFeature(featureId: string) {
  const supabase = createAdminSupabaseClient();

  // Check if feature is referenced in any order_items
  const { data: refs } = await supabase
    .from("order_items")
    .select("id")
    .eq("feature_id", featureId)
    .limit(1);

  if (refs && refs.length > 0) {
    throw new Error("Cannot delete a feature that has been ordered. Consider updating it instead.");
  }

  const { error } = await supabase.from("features").delete().eq("id", featureId);
  if (error) throw new Error(`Failed to delete feature: ${error.message}`);
}
