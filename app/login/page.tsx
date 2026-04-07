import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { z } from "zod";
import { PremiumSection } from "@/components/marketing/PremiumSection";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Sign In | Remote Code DE",
  description: "Sign in to your Remote Code DE account to manage vehicles, orders, and remote coding sessions.",
};
import { getUser } from "@/lib/auth/get-user";

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  next: z.string().startsWith("/").default("/dashboard"),
});

async function loginAction(formData: FormData) {
  "use server";

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") || "/dashboard",
  });

  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid input";
    const next = String(formData.get("next") ?? "/dashboard");
    redirect(`/login?error=${encodeURIComponent(msg)}&next=${encodeURIComponent(next)}`);
  }

  const { email, password, next } = parsed.data;

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`);
  }

  redirect(next);
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const user = await getUser();
  if (user) {
    redirect("/dashboard");
  }

  const params = await searchParams;

  return (
    <PremiumSection eyebrow="Account" title="Secure sign in">
      <form action={loginAction} className="surface mx-auto max-w-md space-y-4 rounded-premium p-6 md:p-8">
        <input type="hidden" name="next" value={params.next ?? "/dashboard"} />
        <label className="block text-sm text-white/75">
          <span className="mb-2 block">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 outline-none ring-electric focus:ring-1"
          />
        </label>
        <label className="block text-sm text-white/75">
          <span className="mb-2 block">Password</span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 outline-none ring-electric focus:ring-1"
          />
        </label>
        <div className="text-right">
          <Link href="/forgot-password" className="text-sm text-white/50 hover:text-white/80">
            Forgot password?
          </Link>
        </div>
        {params.confirm === "pending" ? (
          <div className="rounded-xl border border-electric/20 bg-electric/5 p-4 text-sm text-electric">
            We&apos;ve sent a confirmation email. Please check your inbox and click the link to activate your account.
          </div>
        ) : null}
        {params.error &&
        (params.error.includes("Email not confirmed") || params.error.includes("email_not_confirmed")) ? (
          <div className="space-y-2 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-amber-200">
            <p>Please check your email and click the confirmation link, then try signing in again.</p>
            <Link
              href="/login?resend=true"
              className="inline-block text-xs text-white/50 underline hover:text-white/80"
            >
              Resend confirmation
            </Link>
          </div>
        ) : params.error ? (
          <p className="text-sm text-red-300">{params.error}</p>
        ) : null}
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-xl bg-silver px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white"
        >
          Sign in
        </button>
        <p className="text-center text-sm text-white/50">
          No account?{" "}
          <Link href="/signup" className="text-white/80 underline hover:text-white">
            Create one
          </Link>
        </p>
      </form>
    </PremiumSection>
  );
}
