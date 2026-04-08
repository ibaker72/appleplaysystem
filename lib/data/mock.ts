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
  { id: "f9", brand: "BMW", title: "Welcome Light Customization", description: "Configure exterior and interior welcome lighting sequence.", sessionMinutes: 18, priceUsd: 89, supportedModels: ["3 Series", "5 Series", "X5"] },
  // Audi
  { id: "fa1", brand: "Audi", title: "App-Connect Activation", description: "Enable Apple CarPlay and Android Auto on MIB-equipped Audi models.", sessionMinutes: 30, priceUsd: 159, supportedModels: ["A3", "A4", "A5", "Q3", "Q5", "Q7"] },
  { id: "fa2", brand: "Audi", title: "Video in Motion", description: "Allow media playback on the MMI screen while the vehicle is in motion.", sessionMinutes: 20, priceUsd: 99, supportedModels: ["A3", "A4", "A5", "Q5", "Q7"] },
  // Mercedes-Benz
  { id: "fm1", brand: "Mercedes-Benz", title: "Apple CarPlay Activation", description: "Enable wireless CarPlay on MBUX or wired CarPlay on NTG5/6 equipped models.", sessionMinutes: 30, priceUsd: 179, supportedModels: ["A-Class", "C-Class", "E-Class", "GLC", "GLE", "S-Class"] },
  { id: "fm2", brand: "Mercedes-Benz", title: "Video in Motion", description: "Allow passenger media playback on the MBUX or COMAND display while in motion.", sessionMinutes: 20, priceUsd: 99, supportedModels: ["C-Class", "E-Class", "GLC", "GLE", "S-Class"] },
];

export const compatibilityRules: FeatureCompatibilityRule[] = [
  // BMW rules
  ...features.filter((f) => f.brand === "BMW").map((feature) => ({
    id: `r-${feature.id}`,
    featureId: feature.id,
    brand: "BMW" as const,
    minYear: 2017,
    maxYear: 2025,
    chassis: ["G20", "G30", "G05", "G01"],
    headUnits: ["NBT Evo", "MGU", "EntryNav2"],
  })),
  // Audi rules (MIB3)
  { id: "r-fa1", featureId: "fa1", brand: "Audi", minYear: 2019, maxYear: 2026, chassis: ["8Y", "B9", "F5", "F3", "FY", "4M"], headUnits: ["MIB3"] },
  { id: "r-fa2", featureId: "fa2", brand: "Audi", minYear: 2019, maxYear: 2026, chassis: ["8Y", "B9", "F5", "F3", "FY", "4M"], headUnits: ["MIB3"] },
  // Mercedes-Benz rules (MBUX)
  { id: "r-fm1", featureId: "fm1", brand: "Mercedes-Benz", minYear: 2019, maxYear: 2026, chassis: ["W177", "W206", "W214", "X254", "V167"], headUnits: ["MBUX"] },
  { id: "r-fm2", featureId: "fm2", brand: "Mercedes-Benz", minYear: 2019, maxYear: 2026, chassis: ["W177", "W206", "W214", "X254", "V167"], headUnits: ["MBUX"] },
];

export const customers: CustomerProfile[] = [{ id: "c1", fullName: "Alex Fischer", email: "alex@sample.com", phone: "+1 555-331-9022" }];

export const vehicles: Vehicle[] = [{ id: "v1", customerId: "c1", brand: "BMW", model: "3 Series", year: 2021, chassis: "G20", headUnit: "MGU", vin: "WBA00000000000000" }];

export const orders: Order[] = [
  { id: "o1", customerId: "c1", vehicleId: "v1", status: "confirmed", totalUsd: 278, createdAt: "2026-03-31T14:30:00Z" },
  { id: "o2", customerId: "c1", vehicleId: "v1", status: "completed", totalUsd: 129, createdAt: "2026-02-14T11:00:00Z" }
];

export const bookings: Booking[] = [{ id: "b1", orderId: "o1", startsAt: "2026-04-07T19:00:00Z", technicianName: "Martin K.", status: "scheduled" }];
