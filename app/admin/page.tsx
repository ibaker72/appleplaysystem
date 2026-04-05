import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireAdmin } from "@/lib/auth/require-admin";

const sections = [
  { label: "Orders", href: "/admin/orders", description: "View and manage all customer orders." },
  { label: "Sessions", href: "/admin/sessions", description: "Monitor booking and session status." },
  { label: "Vehicles", href: "/admin/vehicles", description: "Browse registered customer vehicles." },
  { label: "Features", href: "/admin/features", description: "View available feature catalog." },
  { label: "Customers", href: "/admin/customers", description: "Customer profile directory." },
];

export default async function AdminPage() {
  await requireAdmin();

  return (
    <DashboardShell title="Admin Console">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="surface rounded-premium p-5 transition hover:border-white/15"
          >
            <h3 className="font-medium">{section.label}</h3>
            <p className="mt-1 text-sm text-white/60">{section.description}</p>
          </Link>
        ))}
      </div>
    </DashboardShell>
  );
}
