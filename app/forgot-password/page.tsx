import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PremiumSection } from "@/components/marketing/PremiumSection";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: "Forgot Password | Remote Code DE",
};

async function forgotPasswordAction(formData: FormData) {
  "use server";
  const email = String(formData.get("email")).trim();
  if (!email) {
    redirect("/forgot-password?error=Please+enter+your+email");
  }

  const supabase = await createServerSupabaseClient();
  const siteUrl = getSiteUrl();

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/reset-password`,
  });

  redirect("/forgot-password?sent=1");
}

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;

  return (
    <PremiumSection eyebrow="Account" title="Forgot password">
      <form
        action={forgotPasswordAction}
        className="surface mx-auto max-w-md space-y-4 rounded-premium p-6 md:p-8"
      >
        {params.sent ? (
          <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">
            If an account exists with that email, a reset link has been sent.
          </div>
        ) : null}
        {params.error ? <p className="text-sm text-red-300">{params.error}</p> : null}

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

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-xl bg-silver px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white"
        >
          Send reset link
        </button>

        <p className="text-center text-sm text-white/50">
          <Link href="/login" className="text-white/80 underline hover:text-white">
            Back to sign in
          </Link>
        </p>
      </form>
    </PremiumSection>
  );
}
