"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function getSupabase() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export function ResetPasswordForm() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const supabase = getSupabase();

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    router.push("/login?error=Password+updated.+Please+sign+in.");
  }

  if (!ready) {
    return (
      <div className="surface mx-auto max-w-md rounded-premium p-6 text-center text-sm text-white/60 md:p-8">
        Verifying your reset link...
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="surface mx-auto max-w-md space-y-4 rounded-premium p-6 md:p-8"
    >
      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <label className="block text-sm text-white/75">
        <span className="mb-2 block">New password</span>
        <input
          type="password"
          required
          autoComplete="new-password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 outline-none ring-electric focus:ring-1"
        />
      </label>

      <label className="block text-sm text-white/75">
        <span className="mb-2 block">Confirm password</span>
        <input
          type="password"
          required
          autoComplete="new-password"
          value={confirm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirm(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 outline-none ring-electric focus:ring-1"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-xl bg-silver px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white disabled:opacity-50"
      >
        {loading ? "Updating..." : "Update password"}
      </button>
    </form>
  );
}
