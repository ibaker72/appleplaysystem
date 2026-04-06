import {
  Smartphone,
  Play,
  Bluetooth,
  Sparkles,
  Settings,
  Gauge,
  ShieldCheck,
  Lightbulb,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { CatalogFeature } from "@/lib/features/get-features";
import { Button } from "@/components/ui/button";

const iconKeywords: [string[], LucideIcon][] = [
  [["CarPlay", "Apple"], Smartphone],
  [["Video"], Play],
  [["Bluetooth"], Bluetooth],
  [["Animation", "Startup"], Sparkles],
  [["iDrive", "Coding"], Settings],
  [["Speed"], Gauge],
  [["Seatbelt"], ShieldCheck],
  [["Light", "Welcome"], Lightbulb],
];

function getFeatureIcon(title: string): LucideIcon {
  for (const [keywords, icon] of iconKeywords) {
    if (keywords.some((kw) => title.includes(kw))) return icon;
  }
  return Wrench;
}

export function FeatureCard({ feature }: { feature: CatalogFeature }) {
  const Icon = getFeatureIcon(feature.title);
  return (
    <article className="surface relative rounded-premium p-5">
      <Icon size={18} className="absolute right-4 top-4 text-white/30" />
      <p className="text-xs uppercase tracking-wide text-white/50">{feature.brand}</p>
      <h3 className="mt-2 text-lg font-medium">{feature.title}</h3>
      <p className="mt-2 text-sm text-white/65">{feature.description}</p>
      <div className="mt-4 space-y-1 text-xs text-white/60">
        <p>Estimated session: {feature.sessionMinutes} min</p>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <p className="text-sm">From <span className="font-semibold text-white">${feature.priceUsd}</span></p>
        <Button href={`/checkout/${feature.id}`}>Select</Button>
      </div>
    </article>
  );
}
