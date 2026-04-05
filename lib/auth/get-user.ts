import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Get the current authenticated user.
 * Uses @supabase/ssr which handles cookie-based session and token refresh automatically.
 */
export async function getUser() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}
