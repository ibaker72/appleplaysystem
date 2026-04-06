import "server-only";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getCompatibleFeatures } from "@/lib/compatibility/get-compatible-features";
import type { CreateOrderInput } from "@/types/orders";

interface Context {
  customerId: string;
  compatibilityInput: {
    brand: string;
    model: string;
    year: number;
    chassis: string;
    headUnit: string;
  };
}

export async function createOrder(input: CreateOrderInput, context: Context) {
  const supabase = createAdminSupabaseClient();
  const compatibility = await getCompatibleFeatures(context.compatibilityInput);

  if (!compatibility.supported || compatibility.matchedConfigId !== input.configId) {
    throw new Error("Selected configuration is not currently supported.");
  }

  const availableFeatureMap = new Map(compatibility.compatibleFeatures.map((f) => [f.id, f]));
  const uniqueSelected = [...new Set(input.selectedFeatureIds)];

  if (uniqueSelected.length === 0) {
    throw new Error("Select at least one compatible feature.");
  }

  const invalidFeature = uniqueSelected.find((id) => !availableFeatureMap.has(id));
  if (invalidFeature) {
    throw new Error("One or more selected features are invalid for the chosen vehicle.");
  }

  const selectedFeatures = uniqueSelected.map((id) => availableFeatureMap.get(id)!);
  const totalUsd = selectedFeatures.reduce((sum, feature) => sum + feature.basePriceUsd, 0);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_id: context.customerId,
      vehicle_id: input.vehicleId,
      status: "pending",
      payment_status: "unpaid",
      total_usd: totalUsd
    })
    .select("id, total_usd")
    .single();

  if (orderError) {
    throw new Error(`Failed to create order: ${orderError.message}`);
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    selectedFeatures.map((feature) => ({
      order_id: order.id,
      feature_id: feature.id,
      price_usd: feature.basePriceUsd
    }))
  );

  if (itemsError) {
    throw new Error(`Failed to create order items: ${itemsError.message}`);
  }

  return {
    orderId: order.id,
    totalUsd: order.total_usd,
    selectedFeatures
  };
}
