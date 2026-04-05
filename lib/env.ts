function getEnv(name: string): string;
function getEnv(name: string, opts: { optional: true }): string | undefined;
function getEnv(name: string, opts?: { optional?: boolean }) {
  const value = process.env[name];
  if (!value && !opts?.optional) {
    throw new Error(`[env] Missing required environment variable: ${name}`);
  }
  return value;
}

/** Public Supabase credentials safe for browser and server components. */
export function getSupabasePublicEnv() {
  return {
    url: getEnv("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  };
}

/** Full Supabase credentials including service role key (server-only). */
export function getSupabaseServiceEnv() {
  return {
    url: getEnv("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    serviceRoleKey: getEnv("SUPABASE_SERVICE_ROLE_KEY"),
  };
}

export function getStripeEnv() {
  return {
    secretKey: getEnv("STRIPE_SECRET_KEY"),
    webhookSecret: getEnv("STRIPE_WEBHOOK_SECRET"),
    publishableKey: getEnv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"),
  };
}

export function getSiteUrl() {
  return getEnv("NEXT_PUBLIC_SITE_URL", { optional: true }) ?? "http://localhost:3000";
}
