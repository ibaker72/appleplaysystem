import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function SettingsPage() {
  return (
    <DashboardShell title="Settings">
      <div className="surface rounded-premium p-5 text-sm text-white/70">Profile, notification, and billing preferences can be managed here with Supabase profile + Stripe customer portal integrations.</div>
    </DashboardShell>
  );
}
