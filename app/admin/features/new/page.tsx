import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createFeature } from "@/lib/admin/feature-actions";

export default async function AdminNewFeaturePage() {
  await requireAdmin();

  async function handleCreate(formData: FormData) {
    "use server";
    await requireAdmin();
    await createFeature({
      brand: String(formData.get("brand")),
      title: String(formData.get("title")),
      description: String(formData.get("description")),
      sessionMinutes: Number(formData.get("session_minutes")),
      basePriceUsd: Number(formData.get("base_price_usd")),
    });
    redirect("/admin/features");
  }

  return (
    <DashboardShell title="Admin · New Feature">
      <Link href="/admin/features" className="text-sm text-white/50 hover:text-white/80">
        ← Back to features
      </Link>

      <div className="surface rounded-premium p-6">
        <h2 className="mb-4 text-lg font-medium">Add New Feature</h2>
        <form action={handleCreate} className="space-y-4">
          <label className="block text-sm text-white/75">
            <span className="mb-2 block">Brand</span>
            <select
              name="brand"
              required
              defaultValue="BMW"
              className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none ring-electric focus:ring-1"
            >
              <option value="BMW" className="bg-panel">BMW</option>
              <option value="Audi" className="bg-panel">Audi</option>
              <option value="Mercedes-Benz" className="bg-panel">Mercedes-Benz</option>
            </select>
          </label>

          <label className="block text-sm text-white/75">
            <span className="mb-2 block">Title</span>
            <input
              name="title"
              type="text"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none ring-electric focus:ring-1"
            />
          </label>

          <label className="block text-sm text-white/75">
            <span className="mb-2 block">Description</span>
            <textarea
              name="description"
              required
              rows={3}
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
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none ring-electric focus:ring-1"
              />
            </label>
          </div>

          <button
            type="submit"
            className="rounded-xl bg-silver px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white"
          >
            Create Feature
          </button>
        </form>
      </div>
    </DashboardShell>
  );
}
