import Link from "next/link";
import { redirect } from "next/navigation";
import { PremiumSection } from "@/components/marketing/PremiumSection";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { setAuthCookies } from "@/lib/auth/session";
import { getUser } from "@/lib/auth/get-user";

async function loginAction(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const next = String(formData.get("next") ?? "/dashboard");

  if (!email || !password) {
    redirect(`/login?error=${encodeURIComponent("Email and password are required")}&next=${encodeURIComponent(next)}`);
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.session) {
    redirect(`/login?error=${encodeURIComponent(error?.message ?? "Unable to sign in")}&next=${encodeURIComponent(next)}`);
  }

  await setAuthCookies(data.session);
  redirect(next.startsWith("/") ? next : "/dashboard");
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
        {params.error ? <p className="text-sm text-red-300">{params.error}</p> : null}
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
