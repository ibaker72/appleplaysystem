import type { OrderStatus, PaymentStatus } from "@/types/database";

export interface CreateOrderInput {
  vehicleId: string;
  configId: string;
  selectedFeatureIds: string[];
}

export interface OrderSummary {
  id: string;
  vehicleId: string;
  totalUsd: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}
