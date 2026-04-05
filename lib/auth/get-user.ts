import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabasePublicEnv } from "@/lib/env";
import {
  getAccessTokenFromCookies,
  getRefreshTokenFromCookies,
  setAuthCookies,
} from "@/lib/auth/session";

/**
 * Get the current authenticated user from cookies.
 * Attempts a token refresh if the access token is expired but a refresh token exists.
 */
export async function getUser() {
  const { url, anonKey } = getSupabasePublicEnv();
  const accessToken = await getAccessTokenFromCookies();

  if (!accessToken) {
    return null;
  }

  const supabase = createClient<Database>(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });

  const { data: { user }, error } = await supabase.auth.getUser();

  if (!error && user) {
    return user;
  }

  // Access token may be expired — attempt refresh
  const refreshToken = await getRefreshTokenFromCookies();
  if (!refreshToken) {
    return null;
  }

  const freshClient = createClient<Database>(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: refreshData, error: refreshError } =
    await freshClient.auth.refreshSession({ refresh_token: refreshToken });

  if (refreshError || !refreshData.session || !refreshData.user) {
    return null;
  }

  // Persist the new tokens
  try {
    await setAuthCookies(refreshData.session);
  } catch {
    // cookies() may throw in some edge-runtime contexts; user is still valid
  }

  return refreshData.user;
}
