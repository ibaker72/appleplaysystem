import { revalidatePath } from "next/cache";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireUser } from "@/lib/auth/require-user";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

async function updateProfileAction(formData: FormData) {
  "use server";
  const user = await requireUser("/dashboard/settings");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!fullName) {
    return;
  }

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("customer_profiles").upsert(
    {
      user_id: user.id,
      full_name: fullName,
      phone: phone || null,
    },
    { onConflict: "user_id" }
  );

  if (error) {
    throw new Error(`Profile update failed: ${error.message}`);
  }

  revalidatePath("/dashboard/settings");
}

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const user = await requireUser("/dashboard/settings");
  const params = await searchParams;
  const supabase = createAdminSupabaseClient();
  const { data: profile } = await supabase
    .from("customer_profiles")
    .select("full_name, phone")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <DashboardShell title="Settings">
      {params.updated === "1" ? (
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">
          Profile updated.
        </div>
      ) : null}

      <form action={updateProfileAction} className="surface max-w-lg space-y-4 rounded-premium p-5">
        <p className="text-sm text-white/60">Signed in as {user.email}</p>
        <label className="block text-sm text-white/75">
          <span className="mb-2 block">Full name</span>
          <input
            name="full_name"
            defaultValue={profile?.full_name ?? ""}
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 outline-none ring-electric focus:ring-1"
          />
        </label>
        <label className="block text-sm text-white/75">
          <span className="mb-2 block">Phone</span>
          <input
            name="phone"
            defaultValue={profile?.phone ?? ""}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 outline-none ring-electric focus:ring-1"
          />
        </label>
        <button
          type="submit"
          className="rounded-xl bg-silver px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white"
        >
          Update profile
        </button>
      </form>

      <div className="surface max-w-lg rounded-premium p-5">
        <h3 className="text-sm font-medium text-white/70">Account</h3>
        <form action="/api/auth/signout" method="post" className="mt-3">
          <button
            type="submit"
            className="rounded-xl border border-white/20 bg-white/5 px-5 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            Sign out
          </button>
        </form>
      </div>
    </DashboardShell>
  );
}
