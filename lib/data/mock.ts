import type { Booking, CustomerProfile, Feature, FeatureCompatibilityRule, Order, Vehicle } from "@/lib/types/domain";

export const features: Feature[] = [
  { id: "f1", brand: "BMW", title: "Apple CarPlay Activation", description: "Factory-style CarPlay activation for compatible iDrive systems.", sessionMinutes: 35, priceUsd: 179, supportedModels: ["3 Series", "5 Series", "X3", "X5"] },
  { id: "f2", brand: "BMW", title: "Fullscreen Apple CarPlay", description: "Enable native fullscreen layout for wider iDrive displays.", sessionMinutes: 20, priceUsd: 99, supportedModels: ["3 Series", "5 Series", "X5"] },
  { id: "f3", brand: "BMW", title: "Video in Motion", description: "Allow passenger media playback while stationary and in motion where permitted.", sessionMinutes: 25, priceUsd: 129, supportedModels: ["4 Series", "5 Series", "X7"] },
  { id: "f4", brand: "BMW", title: "Startup Animation Coding", description: "Apply premium startup visual profile to iDrive boot sequence.", sessionMinutes: 15, priceUsd: 79, supportedModels: ["2 Series", "3 Series", "X3"] },
  { id: "f5", brand: "BMW", title: "iDrive Feature Coding", description: "Tailored coding package for comfort, safety, and display preferences.", sessionMinutes: 45, priceUsd: 229, supportedModels: ["3 Series", "5 Series", "X5", "X7"] },
  { id: "f6", brand: "BMW", title: "Enhanced Bluetooth Activation", description: "Enable expanded Bluetooth audio and contact sync functions.", sessionMinutes: 20, priceUsd: 89, supportedModels: ["1 Series", "3 Series", "X1"] },
  { id: "f7", brand: "BMW", title: "Digital Speed Display", description: "Show live digital speed in the instrument cluster HUD area.", sessionMinutes: 12, priceUsd: 69, supportedModels: ["3 Series", "4 Series", "X3"] },
  { id: "f8", brand: "BMW", title: "Seatbelt Chime Adjustment", description: "Adjust warning logic for seatbelt reminders on private roads.", sessionMinutes: 10, priceUsd: 59, supportedModels: ["All BMW G-Chassis"] },
  { id: "f9", brand: "BMW", title: "Welcome Light Customization", description: "Configure exterior and interior welcome lighting sequence.", sessionMinutes: 18, priceUsd: 89, supportedModels: ["3 Series", "5 Series", "X5"] }
];

export const compatibilityRules: FeatureCompatibilityRule[] = features.map((feature) => ({
  id: `r-${feature.id}`,
  featureId: feature.id,
  brand: "BMW",
  minYear: 2017,
  maxYear: 2025,
  chassis: ["G20", "G30", "G05", "G01"],
  headUnits: ["NBT Evo", "MGU", "EntryNav2"]
}));

export const customers: CustomerProfile[] = [{ id: "c1", fullName: "Alex Fischer", email: "alex@sample.com", phone: "+1 555-331-9022" }];

export const vehicles: Vehicle[] = [{ id: "v1", customerId: "c1", brand: "BMW", model: "3 Series", year: 2021, chassis: "G20", headUnit: "MGU", vin: "WBA00000000000000" }];

export const orders: Order[] = [
  { id: "o1", customerId: "c1", vehicleId: "v1", status: "confirmed", totalUsd: 278, createdAt: "2026-03-31T14:30:00Z" },
  { id: "o2", customerId: "c1", vehicleId: "v1", status: "completed", totalUsd: 129, createdAt: "2026-02-14T11:00:00Z" }
];

export const bookings: Booking[] = [{ id: "b1", orderId: "o1", startsAt: "2026-04-07T19:00:00Z", technicianName: "Martin K.", status: "scheduled" }];
