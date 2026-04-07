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

export function getResendEnv() {
  return {
    apiKey: getEnv("RESEND_API_KEY", { optional: true }),
    fromEmail: getEnv("RESEND_FROM_EMAIL", { optional: true }),
  };
}

export function getCronSecret() {
  return getEnv("CRON_SECRET", { optional: true });
}

export function getUpstashEnv() {
  return {
    redisUrl: getEnv("UPSTASH_REDIS_REST_URL", { optional: true }),
    redisToken: getEnv("UPSTASH_REDIS_REST_TOKEN", { optional: true }),
  };
}

export function getSiteUrl() {
  return getEnv("NEXT_PUBLIC_SITE_URL", { optional: true }) ?? "http://localhost:3000";
}
