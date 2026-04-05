import Link from "next/link";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", href: "/dashboard" },
  { label: "Vehicles", href: "/dashboard/vehicles" },
  { label: "Orders", href: "/dashboard/orders" },
  { label: "Sessions", href: "/dashboard/sessions" },
  { label: "Settings", href: "/dashboard/settings" },
];

export function DashboardShell({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("container-shell py-10", className)}>
      <nav className="mb-6 flex flex-wrap gap-1 overflow-x-auto border-b border-white/5 pb-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm text-white/60 transition hover:bg-white/5 hover:text-white/90"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <h1 className="text-3xl font-semibold">{title}</h1>
      <div className="mt-6 grid gap-4">{children}</div>
    </div>
  );
}
