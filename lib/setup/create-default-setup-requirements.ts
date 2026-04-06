import "server-only";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const DEFAULT_REQUIREMENTS = [
  "Windows laptop ready",
  "Stable internet connection",
  "Compatible OBD / ENET cable available",
  "Vehicle battery support if required",
  "Remote access tool installed"
];

export async function createDefaultSetupRequirements(bookingId: string) {
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

  const { error } = await supabase.from("setup_requirements").insert(
    DEFAULT_REQUIREMENTS.map((requirement) => ({
      booking_id: bookingId,
      requirement,
      completed: false
    }))
  );

  if (error) {
    throw new Error(`Failed to create setup requirements: ${error.message}`);
  }
}
