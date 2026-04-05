import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabasePublicEnv } from "@/lib/env";
import { getAccessTokenFromCookies } from "@/lib/auth/session";

export async function createServerSupabaseClient() {
  const { url, anonKey } = getSupabasePublicEnv();
  const accessToken = await getAccessTokenFromCookies();

  return createClient<Database>(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined,
  });
}
