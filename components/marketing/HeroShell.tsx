import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function HeroShell() {
  return (
    <section className="container-shell py-14 md:py-20">
      <div className="surface relative overflow-hidden rounded-premium p-8 md:p-14">
        <div className="absolute -right-16 top-10 h-56 w-56 rounded-full bg-electric/15 blur-3xl" />
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-10 max-w-3xl">
          <p className="mb-3 text-xs uppercase tracking-[0.22em] text-white/60">Remote German Auto Software</p>
          <h1 className="text-4xl font-semibold leading-tight md:text-6xl">Unlock Premium Features. From Home.</h1>
          <p className="mt-5 max-w-xl text-base text-white/75 md:text-lg">Activate supported features remotely with guided setup, secure checkout, and technician-led sessions.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/check-compatibility">Check Compatibility</Button>
            <Button href="/features" variant="ghost">View Features</Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
