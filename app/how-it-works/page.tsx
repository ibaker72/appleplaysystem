import type { Metadata } from "next";
import Link from "next/link";
import { SearchCheck, ShoppingCart, ClipboardCheck, Monitor, CheckCircle } from "lucide-react";
import { PremiumSection } from "@/components/marketing/PremiumSection";

export const metadata: Metadata = {
  title: "How It Works | Remote Coding Process",
  description: "Learn how our remote vehicle coding process works — from compatibility check to feature activation, all done remotely.",
};

const steps = [
  {
    icon: SearchCheck,
    title: "Check Compatibility",
    description:
      "Enter your vehicle's brand, model, year, chassis type, and head unit. Our system instantly shows which features can be unlocked on your exact configuration.",
  },
  {
    icon: ShoppingCart,
    title: "Select Features & Pay",
    description:
      "Choose the features you want to activate and complete checkout securely via Stripe. Pricing is per feature — no bundles you don't need.",
  },
  {
    icon: ClipboardCheck,
    title: "Complete Setup Checklist",
    description:
      "Before your session, we provide a step-by-step checklist to prepare your vehicle and connection. Everything you need is listed with clear instructions.",
  },
  {
    icon: Monitor,
    title: "Join Remote Session",
    description:
      "A certified technician connects remotely to your vehicle at the scheduled time. The entire session takes 20–90 minutes depending on selected features.",
  },
  {
    icon: CheckCircle,
    title: "Receive Completion Report",
    description:
      "Once the session is complete, you'll receive a confirmation with a full report of features activated. Your vehicle is ready to use immediately.",
  },
];

export default function HowItWorksPage() {
  return (
    <PremiumSection
      eyebrow="How it works"
      title="A precise remote workflow from checkout to completion"
    >
      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-5 top-8 hidden h-[calc(100%-4rem)] w-px bg-white/10 sm:block" />

        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="surface relative flex gap-4 rounded-xl p-5">
                {/* Step number + icon */}
                <div className="relative flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-electric/15 ring-1 ring-electric/30">
                    <Icon className="h-5 w-5 text-electric" strokeWidth={1.5} />
                  </div>
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-panel text-[10px] font-semibold text-white/50 ring-1 ring-white/10">
                    {index + 1}
                  </span>
                </div>

                {/* Content */}
                <div className="min-w-0 pt-1">
                  <h3 className="text-sm font-semibold text-white">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/60">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href="/check-compatibility"
          className="rounded-xl bg-silver px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white"
        >
          Check your vehicle
        </Link>
        <Link
          href="/features"
          className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10"
        >
          Browse features
        </Link>
      </div>
    </PremiumSection>
  );
}
