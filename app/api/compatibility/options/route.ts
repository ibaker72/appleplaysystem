import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createAdminSupabaseClient();

  const { data: configs, error } = await supabase
    .from("supported_vehicle_configs")
    .select("brand, model, chassis, head_unit")
    .order("brand")
    .order("model");

  if (error) {
    return NextResponse.json(
      { error: "Failed to load vehicle options" },
      { status: 500 }
    );
  }

  const brands = new Set<string>();
  const models: Record<string, Set<string>> = {};
  const chassis: Record<string, Set<string>> = {};
  const headUnits = new Set<string>();

  for (const c of configs ?? []) {
    brands.add(c.brand);

    if (!models[c.brand]) models[c.brand] = new Set();
    models[c.brand].add(c.model);

    if (!chassis[c.brand]) chassis[c.brand] = new Set();
    chassis[c.brand].add(c.chassis);

    if (c.head_unit) headUnits.add(c.head_unit);
  }

  const toSorted = (s: Set<string>) => [...s].sort();
  const toSortedRecord = (r: Record<string, Set<string>>) =>
    Object.fromEntries(Object.entries(r).map(([k, v]) => [k, toSorted(v)]));

  return NextResponse.json(
    {
      brands: toSorted(brands),
      models: toSortedRecord(models),
      chassis: toSortedRecord(chassis),
      headUnits: toSorted(headUnits),
    },
    {
      headers: { "Cache-Control": "public, max-age=300" },
    }
  );
}
