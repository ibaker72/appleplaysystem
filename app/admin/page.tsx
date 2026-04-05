import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireUser } from "@/lib/auth/require-user";

export default async function AdminPage() {
  await requireUser("/admin");
  // TODO: enforce admin/technician role checks when RBAC claims are added.
  return <DashboardShell title="Admin Console"><div className="surface rounded-premium p-5 text-sm text-white/70">Operations overview for orders, sessions, vehicles, features, and customers.</div></DashboardShell>;
}
