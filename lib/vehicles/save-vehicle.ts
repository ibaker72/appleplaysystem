import "server-only";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

interface SaveVehicleInput {
  customerId: string;
  brand: string;
  model: string;
  year: number;
  chassis: string;
  headUnit: string;
  vin?: string;
}

export async function saveVehicle(input: SaveVehicleInput) {
  const supabase = createAdminSupabaseClient();

  const { data: existing } = await supabase
    .from("vehicles")
    .select("id")
    .eq("customer_id", input.customerId)
    .eq("brand", input.brand)
    .eq("model", input.model)
    .eq("year", input.year)
    .eq("chassis", input.chassis)
    .eq("head_unit", input.headUnit)
    .maybeSingle();

  if (existing) {
    return existing;
  }

  const { data, error } = await supabase
    .from("vehicles")
    .insert({
      customer_id: input.customerId,
      brand: input.brand,
      model: input.model,
      year: input.year,
      chassis: input.chassis,
      head_unit: input.headUnit,
      vin: input.vin?.trim() || null
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Failed to save vehicle: ${error.message}`);
  }

  return data;
}

export async function getUserVehicles(customerId: string) {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select("id, brand, model, year, chassis, head_unit, vin, created_at")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load vehicles: ${error.message}`);
  }

  return data;
}
