import Link from "next/link";
import { redirect } from "next/navigation";
import { z } from "zod";
import { PremiumSection } from "@/components/marketing/PremiumSection";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getUser } from "@/lib/auth/get-user";

const signupSchema = z.object({
  full_name: z.string().trim().min(1, "Full name is required").max(200),
  phone: z.string().trim().max(30).optional().default(""),
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

async function signupAction(formData: FormData) {
  "use server";

  const parsed = signupSchema.safeParse({
    full_name: formData.get("full_name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid input";
    redirect(`/signup?error=${encodeURIComponent(msg)}`);
  }

  const { full_name: fullName, phone, email, password } = parsed.data;

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error || !data.user) {
    redirect(`/signup?error=${encodeURIComponent(error?.message ?? "Unable to create account")}`);
  }

  // Upsert profile — safe for retries and never duplicates.
  const admin = createAdminSupabaseClient();
  const { error: profileError } = await admin.from("customer_profiles").upsert(
    {
      user_id: data.user.id,
      full_name: fullName,
      phone: phone || null,
    },
    { onConflict: "user_id" }
  );

  if (profileError) {
    redirect(`/signup?error=${encodeURIComponent("Account created but profile setup failed. Please sign in and update your profile.")}`);
  }

  if (data.session) {
    // @supabase/ssr handles cookie setting via createServerSupabaseClient
    redirect("/dashboard");
  }

  // Email confirmation may be required — no session returned
  redirect(`/login?error=${encodeURIComponent("Please check your email to confirm your account, then sign in.")}`);
}

export default async function SignupPage({
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
    <PremiumSection eyebrow="Account" title="Create your owner account">
      <form action={signupAction} className="surface mx-auto max-w-md space-y-4 rounded-premium p-6 md:p-8">
        <label className="block text-sm text-white/75">
          <span className="mb-2 block">Full name</span>
          <input
            name="full_name"
            required
            autoComplete="name"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 outline-none ring-electric focus:ring-1"
          />
        </label>
        <label className="block text-sm text-white/75">
          <span className="mb-2 block">Phone (optional)</span>
          <input
            name="phone"
            autoComplete="tel"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 outline-none ring-electric focus:ring-1"
          />
        </label>
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
            minLength={8}
            autoComplete="new-password"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 outline-none ring-electric focus:ring-1"
          />
        </label>
        {params.error ? <p className="text-sm text-red-300">{params.error}</p> : null}
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-xl bg-silver px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white"
        >
          Create account
        </button>
        <p className="text-center text-sm text-white/50">
          Already have an account?{" "}
          <Link href="/login" className="text-white/80 underline hover:text-white">
            Sign in
          </Link>
        </p>
      </form>
    </PremiumSection>
  );
}
