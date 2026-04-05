import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "ghost";
}

export function Button({ href, children, className, variant = "primary" }: ButtonProps) {
  const base = cn(
    "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-300",
    variant === "primary"
      ? "bg-silver text-black hover:bg-white"
      : "border border-white/15 bg-white/5 text-silver hover:border-white/30 hover:bg-white/10",
    className
  );

  if (href) {
    return <Link href={href} className={base}>{children}</Link>;
  }

  return <button className={base}>{children}</button>;
}
