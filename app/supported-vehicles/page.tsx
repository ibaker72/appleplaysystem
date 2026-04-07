import type { Metadata } from "next";
import { PremiumSection } from "@/components/marketing/PremiumSection";

export const metadata: Metadata = {
  title: "Supported Vehicles | Remote Code DE",
  description: "View supported BMW, Audi, Mercedes-Benz, Volkswagen, and Porsche models, chassis codes, and head units for remote coding.",
};

export default function SupportedVehiclesPage() {
  return (
    <PremiumSection eyebrow="Vehicles" title="Five German brands supported">
      <div className="surface rounded-premium p-6 text-sm text-white/70">
        <p>We support BMW, Audi, Mercedes-Benz, Volkswagen, and Porsche across a range of generations and head units.</p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li><strong className="text-white/90">BMW</strong> — G-Chassis with NBT Evo, EntryNav2, or MGU</li>
          <li><strong className="text-white/90">Audi</strong> — MIB2 and MIB3 equipped models</li>
          <li><strong className="text-white/90">Mercedes-Benz</strong> — MBUX and NTG5/6 systems</li>
          <li><strong className="text-white/90">Volkswagen</strong> — MIB2 and MIB3 equipped models</li>
          <li><strong className="text-white/90">Porsche</strong> — PCM5 and PCM6 equipped models</li>
        </ul>
        <p className="mt-3">Use the compatibility checker to verify your exact vehicle configuration.</p>
      </div>
    </PremiumSection>
  );
}
