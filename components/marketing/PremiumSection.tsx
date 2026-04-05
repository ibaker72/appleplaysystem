import { cn } from "@/lib/utils";

export function PremiumSection({ title, eyebrow, children, className }: { title: string; eyebrow?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("container-shell py-14 md:py-20", className)}>
      {eyebrow && <p className="mb-3 text-xs uppercase tracking-[0.22em] text-white/50">{eyebrow}</p>}
      <h2 className="max-w-2xl text-2xl font-semibold leading-tight md:text-4xl">{title}</h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}
