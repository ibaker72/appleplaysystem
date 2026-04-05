import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export async function signInWithPassword(email: string, password: string) {
  const supabase = createBrowserSupabaseClient();
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithPassword(email: string, password: string) {
  const supabase = createBrowserSupabaseClient();
  return supabase.auth.signUp({ email, password });
}
