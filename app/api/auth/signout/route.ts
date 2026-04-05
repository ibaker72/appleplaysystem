import { NextResponse } from "next/server";
import { clearAuthCookies, getAccessTokenFromCookies } from "@/lib/auth/session";
import { getSupabasePublicEnv } from "@/lib/env";
import { createClient } from "@supabase/supabase-js";

export async function POST() {
  // Attempt to sign out from Supabase so the token is revoked server-side
  try {
    const accessToken = await getAccessTokenFromCookies();
    if (accessToken) {
      const { url, anonKey } = getSupabasePublicEnv();
      const supabase = createClient(url, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
        global: { headers: { Authorization: `Bearer ${accessToken}` } },
      });
      await supabase.auth.signOut();
    }
  } catch {
    // Best-effort; cookies will still be cleared
  }

  await clearAuthCookies();

  // Redirect to home page after sign out
  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"), {
    status: 303,
  });
}
