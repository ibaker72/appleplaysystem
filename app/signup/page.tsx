import { redirect } from "next/navigation";
import { PremiumSection } from "@/components/marketing/PremiumSection";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { setAuthCookies } from "@/lib/auth/session";
import { getUser } from "@/lib/auth/get-user";

async function signupAction(formData: FormData) {
  "use server";

  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!fullName || !email || !password) {
    redirect(`/signup?error=${encodeURIComponent("Full name, email and password are required")}`);
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error || !data.user) {
    redirect(`/signup?error=${encodeURIComponent(error?.message ?? "Unable to create account")}`);
  }

  // We upsert profile on every signup request so retries are safe and never duplicate.
  const admin = createAdminSupabaseClient();
  const { error: profileError } = await admin.from("customer_profiles").upsert(
    {
      user_id: data.user.id,
      full_name: fullName,
      phone: phone || null
    },
    { onConflict: "user_id" }
  );

  if (profileError) {
    redirect(`/signup?error=${encodeURIComponent("Account created but profile setup failed. Please contact support.")}`);
  }

  if (data.session) {
    await setAuthCookies(data.session);
  }

  redirect("/dashboard");
}

export default async function SignupPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const user = await getUser();
  if (user) {
    redirect("/dashboard");
  }

  const params = await searchParams;

  return (
    <PremiumSection eyebrow="Account" title="Create your owner account">
      <form action={signupAction} className="surface mx-auto max-w-md space-y-4 rounded-premium p-6 md:p-8">
        <label className="block text-sm text-white/75">
          <span className="mb-2 block">Full name</span>
          <input name="full_name" required className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none ring-electric focus:ring-1" />
        </label>
        <label className="block text-sm text-white/75">
          <span className="mb-2 block">Phone (optional)</span>
          <input name="phone" className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none ring-electric focus:ring-1" />
        </label>
        <label className="block text-sm text-white/75">
          <span className="mb-2 block">Email</span>
          <input name="email" type="email" required className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none ring-electric focus:ring-1" />
        </label>
        <label className="block text-sm text-white/75">
          <span className="mb-2 block">Password</span>
          <input name="password" type="password" required minLength={8} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none ring-electric focus:ring-1" />
        </label>
        {params.error ? <p className="text-sm text-red-300">{params.error}</p> : null}
        <button type="submit" className="inline-flex w-full items-center justify-center rounded-xl bg-silver px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white">Create account</button>
      </form>
    </PremiumSection>
  );
}
