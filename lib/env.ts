function getEnv(name: string, opts?: { optional?: boolean }) {
  const value = process.env[name];
  if (!value && !opts?.optional) {
    throw new Error(`[env] Missing required environment variable: ${name}`);
  }
  return value;
}

export function getSupabaseEnv() {
  return {
    url: getEnv("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    serviceRoleKey: getEnv("SUPABASE_SERVICE_ROLE_KEY")
  };
}

export function getStripeEnv() {
  return {
    secretKey: getEnv("STRIPE_SECRET_KEY"),
    webhookSecret: getEnv("STRIPE_WEBHOOK_SECRET"),
    publishableKey: getEnv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY")
  };
}

export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (!fromEnv) {
    throw new Error("[env] Missing NEXT_PUBLIC_SITE_URL. Set it to your app origin, e.g. https://app.example.com");
  }
  return fromEnv;
}
