import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export default async function AdminFeaturesPage() {
  await requireAdmin();
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase
    .from("features")
    .select("id, brand, title, session_minutes, base_price_usd")
    .order("created_at", { ascending: false })
    .limit(100);

  const features = data ?? [];

  return (
    <DashboardShell title="Admin · Features">
      <div className="flex items-center justify-between">
        <span />
        <Link
          href="/admin/features/new"
          className="rounded-xl bg-silver px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white"
        >
          New Feature
        </Link>
      </div>

      <section className="surface rounded-premium p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Features</h2>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/50">
            {features.length} {features.length === 1 ? "record" : "records"}
          </span>
        </div>

        {features.length === 0 ? (
          <p className="py-8 text-center text-sm text-white/40">No records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-white/55">
                <tr>
                  <th className="pb-3 pr-4 font-medium">ID</th>
                  <th className="pb-3 pr-4 font-medium">Feature</th>
                  <th className="pb-3 pr-4 font-medium">Brand</th>
                  <th className="pb-3 pr-4 font-medium">Session</th>
                  <th className="pb-3 pr-4 font-medium">Price</th>
                  <th className="pb-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature) => (
                  <tr key={feature.id} className="border-t border-white/5">
                    <td className="py-3 pr-4">{feature.id.slice(0, 8)}</td>
                    <td className="py-3 pr-4">{feature.title}</td>
                    <td className="py-3 pr-4">{feature.brand}</td>
                    <td className="py-3 pr-4">{feature.session_minutes}m</td>
                    <td className="py-3 pr-4">${feature.base_price_usd}</td>
                    <td className="py-3">
                      <Link
                        href={`/admin/features/${feature.id}`}
                        className="text-electric hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </DashboardShell>
  );
}
