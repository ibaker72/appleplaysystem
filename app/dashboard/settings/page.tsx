import { revalidatePath } from "next/cache";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireUser } from "@/lib/auth/require-user";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

async function updateProfileAction(formData: FormData) {
  "use server";
  const user = await requireUser("/dashboard/settings");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("customer_profiles").upsert(
    {
      user_id: user.id,
      full_name: fullName || null,
      phone: phone || null
    },
    { onConflict: "user_id" }
  );

  if (error) {
    throw new Error(`Profile update failed: ${error.message}`);
  }

  revalidatePath("/dashboard/settings");
}

export default async function SettingsPage() {
  const user = await requireUser("/dashboard/settings");
  const supabase = createAdminSupabaseClient();
  const { data: profile } = await supabase
    .from("customer_profiles")
    .select("full_name, phone")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <DashboardShell title="Settings">
      <form action={updateProfileAction} className="surface max-w-lg space-y-4 rounded-premium p-5">
        <p className="text-sm text-white/60">Signed in as {user.email}</p>
        <label className="block text-sm text-white/75">
          <span className="mb-2 block">Full name</span>
          <input name="full_name" defaultValue={profile?.full_name ?? ""} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2" />
        </label>
        <label className="block text-sm text-white/75">
          <span className="mb-2 block">Phone</span>
          <input name="phone" defaultValue={profile?.phone ?? ""} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2" />
        </label>
        <button type="submit" className="rounded-xl bg-silver px-5 py-2.5 text-sm font-medium text-black">Update profile</button>
      </form>
      <form action="/api/auth/signout" method="post">
        <button type="submit" className="w-fit rounded-xl border border-white/20 bg-white/5 px-5 py-2 text-sm">Sign out</button>
      </form>
    </DashboardShell>
  );
}
