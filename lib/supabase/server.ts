import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabaseEnv } from "@/lib/env";
import { getAccessTokenFromCookies } from "@/lib/auth/session";

export async function createServerSupabaseClient() {
  const { url, anonKey } = getSupabaseEnv();
  const accessToken = await getAccessTokenFromCookies();

  return createClient<Database>(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined
  });
}
