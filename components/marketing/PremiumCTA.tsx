import { Button } from "@/components/ui/button";

export function PremiumCTA() {
  return (
    <section className="container-shell py-16">
      <div className="surface rounded-premium p-8 md:flex md:items-center md:justify-between md:p-10">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">Ready to begin</p>
          <h3 className="mt-2 text-2xl font-semibold">Check your vehicle compatibility in under a minute.</h3>
        </div>
        <Button className="mt-4 md:mt-0" href="/check-compatibility">Start Compatibility Check</Button>
      </div>
    </section>
  );
}
