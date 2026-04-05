import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function AdminPage() {
  return <DashboardShell title="Admin Console"><div className="surface rounded-premium p-5 text-sm text-white/70">Operations overview for orders, sessions, and technician assignments.</div></DashboardShell>;
}
