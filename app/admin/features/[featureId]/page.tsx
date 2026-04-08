import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { updateFeature, deleteFeature } from "@/lib/admin/feature-actions";

export default async function AdminEditFeaturePage({
  params,
}: {
  params: Promise<{ featureId: string }>;
}) {
  await requireAdmin();
  const { featureId } = await params;
  if (!z.string().uuid().safeParse(featureId).success) notFound();
  const supabase = createAdminSupabaseClient();

  const { data: feature } = await supabase
    .from("features")
    .select("*")
    .eq("id", featureId)
    .single();

  if (!feature) {
    return (
      <DashboardShell title="Admin · Feature Not Found">
        <div className="surface rounded-premium p-6 text-sm text-white/70">
          <p>Feature not found.</p>
          <Link href="/admin/features" className="mt-3 inline-block text-sm text-white/50 hover:text-white/80">
            ← Back to features
          </Link>
        </div>
      </DashboardShell>
    );
  }

  async function handleUpdate(formData: FormData) {
    "use server";
    await requireAdmin();
    const techGuide = String(formData.get("technician_guide")).trim();
    await updateFeature(featureId, {
      title: String(formData.get("title")),
      description: String(formData.get("description")),
      sessionMinutes: Number(formData.get("session_minutes")),
      basePriceUsd: Number(formData.get("base_price_usd")),
      technicianGuide: techGuide || null,
    });
    revalidatePath(`/admin/features/${featureId}`);
    redirect("/admin/features");
  }

  async function handleDelete() {
    "use server";
    await requireAdmin();
    await deleteFeature(featureId);
    redirect("/admin/features");
  }

  return (
    <DashboardShell title="Admin · Edit Feature">
      <Link href="/admin/features" className="text-sm text-white/50 hover:text-white/80">
        ← Back to features
      </Link>

      <div className="surface rounded-premium p-6">
        <h2 className="mb-4 text-lg font-medium">Edit Feature</h2>
        <form action={handleUpdate} className="space-y-4">
          <label className="block text-sm text-white/75">
            <span className="mb-2 block">Brand</span>
            <input
              type="text"
              disabled
              value={feature.brand}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white/50 outline-none"
            />
          </label>

          <label className="block text-sm text-white/75">
            <span className="mb-2 block">Title</span>
            <input
              name="title"
              type="text"
              required
              defaultValue={feature.title}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none ring-electric focus:ring-1"
            />
          </label>

          <label className="block text-sm text-white/75">
            <span className="mb-2 block">Description</span>
            <textarea
              name="description"
              required
              rows={3}
              defaultValue={feature.description}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none ring-electric focus:ring-1"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-white/75">
              <span className="mb-2 block">Session Minutes</span>
              <input
                name="session_minutes"
                type="number"
                required
                min={1}
                defaultValue={feature.session_minutes}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none ring-electric focus:ring-1"
              />
            </label>

            <label className="block text-sm text-white/75">
              <span className="mb-2 block">Base Price (USD)</span>
              <input
                name="base_price_usd"
                type="number"
                required
                min={0}
                defaultValue={feature.base_price_usd}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none ring-electric focus:ring-1"
              />
            </label>
          </div>

          <label className="block text-sm text-white/75">
            <span className="mb-2 block">Technician Guide</span>
            <span className="mb-2 block text-xs text-white/40">Internal only — not visible to customers. Describe the exact coding steps, parameter names, and values.</span>
            <textarea
              name="technician_guide"
              rows={8}
              defaultValue={(feature as Record<string, unknown>).technician_guide as string ?? ""}
              placeholder={"1. Connect via app > Expert Mode\n2. Locate parameter → set value\n3. Write coding — cycle ignition\n4. Verify"}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-mono outline-none ring-electric focus:ring-1"
            />
          </label>

          <button
            type="submit"
            className="rounded-xl bg-silver px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white"
          >
            Update Feature
          </button>
        </form>
      </div>

      {/* Delete */}
      <div className="surface rounded-premium p-5">
        <h3 className="mb-3 text-sm font-medium text-white/70">Danger Zone</h3>
        <p className="mb-3 text-sm text-white/50">
          Deleting a feature is permanent. Features that have been ordered cannot be deleted.
        </p>
        <form action={handleDelete}>
          <button
            type="submit"
            className="rounded-xl border border-red-400/20 bg-red-400/10 px-5 py-2.5 text-sm font-medium text-red-200 transition hover:bg-red-400/20"
          >
            Delete Feature
          </button>
        </form>
      </div>
    </DashboardShell>
  );
}
