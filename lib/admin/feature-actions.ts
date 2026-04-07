import "server-only";
import { z } from "zod";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const createFeatureSchema = z.object({
  brand: z.string().trim().min(1).max(100),
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().min(1).max(2000),
  sessionMinutes: z.number().int().positive(),
  basePriceUsd: z.number().positive(),
});

const updateFeatureSchema = z.object({
  title: z.string().trim().min(1).max(255).optional(),
  description: z.string().trim().min(1).max(2000).optional(),
  sessionMinutes: z.number().int().positive().optional(),
  basePriceUsd: z.number().positive().optional(),
});

export async function createFeature(input: {
  brand: string;
  title: string;
  description: string;
  sessionMinutes: number;
  basePriceUsd: number;
}) {
  const validated = createFeatureSchema.parse(input);

  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("features")
    .insert({
      brand: validated.brand,
      title: validated.title,
      description: validated.description,
      session_minutes: validated.sessionMinutes,
      base_price_usd: validated.basePriceUsd,
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
  z.string().uuid().parse(featureId);
  const validated = updateFeatureSchema.parse(input);

  const supabase = createAdminSupabaseClient();
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (validated.title !== undefined) updates.title = validated.title;
  if (validated.description !== undefined) updates.description = validated.description;
  if (validated.sessionMinutes !== undefined) updates.session_minutes = validated.sessionMinutes;
  if (validated.basePriceUsd !== undefined) updates.base_price_usd = validated.basePriceUsd;

  const { error } = await supabase.from("features").update(updates).eq("id", featureId);
  if (error) throw new Error(`Failed to update feature: ${error.message}`);
}

export async function deleteFeature(featureId: string) {
  z.string().uuid().parse(featureId);

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
