import "server-only";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

// Brand-specific requirements map: tool + cable instructions per infotainment ecosystem
const BRAND_REQUIREMENTS: Record<string, string[]> = {
  BMW: [
    "Install BimmerCode (iOS or Android) or BimmerLink on your device",
    "Connect OBD-to-ENET cable from your BMW's OBD2 port to your device or laptop",
    "Install AnyDesk on your Windows laptop for remote access",
    "Ensure vehicle is parked with ignition in accessory mode (engine off)",
    "Stable internet connection (minimum 10 Mbps)",
    "Laptop or device fully charged and plugged in",
  ],
  Audi: [
    "Install OBD11 app (Android) on your device — version 3.0 or later",
    "Connect OBD2 Bluetooth or USB adapter to vehicle port",
    "Install AnyDesk on your laptop for remote access",
    "Ensure vehicle is parked with ignition on (engine off)",
    "Stable internet connection (minimum 10 Mbps)",
    "Laptop or device fully charged and plugged in",
  ],
  Volkswagen: [
    "Install OBD11 app (Android) on your device — version 3.0 or later",
    "Connect OBD2 Bluetooth or USB adapter to vehicle port",
    "Install AnyDesk on your laptop for remote access",
    "Ensure vehicle is parked with ignition on (engine off)",
    "Stable internet connection (minimum 10 Mbps)",
    "Laptop or device fully charged and plugged in",
  ],
  "Mercedes-Benz": [
    "Install AnyDesk on your Windows laptop for remote technician access",
    "Connect a compatible Mercedes OBD2 adapter or Star cable to your vehicle",
    "Ensure vehicle is parked with ignition in accessory mode",
    "Laptop must be Windows 10 or later (required for Xentry/Vediamo compatibility)",
    "Stable internet connection (minimum 10 Mbps)",
    "Laptop fully charged and plugged in",
  ],
  Porsche: [
    "Install AnyDesk on your Windows laptop for remote access",
    "Connect OBD2 diagnostic adapter to your Porsche's OBD port",
    "Ensure vehicle is parked with ignition on (engine off)",
    "Stable internet connection (minimum 10 Mbps)",
    "Laptop or device fully charged and plugged in",
  ],
};

const DEFAULT_REQUIREMENTS = [
  "Stable internet connection (minimum 10 Mbps)",
  "Compatible OBD diagnostic cable connected to vehicle",
  "Coding app installed on your laptop or device",
  "Install AnyDesk for remote technician access",
  "Vehicle parked in a safe location with ignition on",
  "Laptop or device fully charged and plugged in",
];

export async function createDefaultSetupRequirements(bookingId: string, brand?: string) {
  const supabase = createAdminSupabaseClient();

  const { data: existing, error: existingError } = await supabase
    .from("setup_requirements")
    .select("id")
    .eq("booking_id", bookingId)
    .limit(1);

  if (existingError) {
    throw new Error(`Failed to check setup requirements: ${existingError.message}`);
  }

  if ((existing?.length ?? 0) > 0) {
    return;
  }

  const requirements =
    (brand && BRAND_REQUIREMENTS[brand]) ? BRAND_REQUIREMENTS[brand] : DEFAULT_REQUIREMENTS;

  const { error } = await supabase.from("setup_requirements").insert(
    requirements.map((requirement) => ({
      booking_id: bookingId,
      requirement,
      completed: false,
    }))
  );

  if (error) {
    throw new Error(`Failed to create setup requirements: ${error.message}`);
  }
}
