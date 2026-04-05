export type VehicleBrand = "BMW" | "Audi" | "Mercedes-Benz";

export type OrderStatus = "pending" | "paid" | "booked" | "in_progress" | "complete";

export interface CustomerProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
}

export interface Vehicle {
  id: string;
  customerId: string;
  brand: VehicleBrand;
  model: string;
  year: number;
  chassis: string;
  headUnit?: string;
  vin?: string;
}

export interface Feature {
  id: string;
  brand: VehicleBrand;
  title: string;
  description: string;
  sessionMinutes: number;
  priceUsd: number;
  supportedModels: string[];
}

export interface FeatureCompatibilityRule {
  id: string;
  featureId: string;
  brand: VehicleBrand;
  minYear: number;
  maxYear: number;
  chassis: string[];
  headUnits?: string[];
}

export interface CompatibilityResult {
  status: "compatible" | "limited" | "not_supported";
  recommendedFeatures: Feature[];
  estimatedMinutes: number;
  setupRequirements: string[];
  estimatedPrice: number;
}

export interface Order {
  id: string;
  customerId: string;
  vehicleId: string;
  status: OrderStatus;
  totalUsd: number;
  createdAt: string;
}

export interface Booking {
  id: string;
  orderId: string;
  startsAt: string;
  technicianName: string;
  status: "scheduled" | "live" | "finished";
}
