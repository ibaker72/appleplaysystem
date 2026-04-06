import type { Metadata } from "next";
import { PremiumSection } from "@/components/marketing/PremiumSection";

export const metadata: Metadata = {
  title: "Supported BMW Vehicles | Remote Code DE",
  description: "View supported BMW models, chassis codes, and head units for remote coding. G-Chassis with NBT Evo, EntryNav2, and MGU supported.",
};

export default function SupportedVehiclesPage() {
  return (
    <PremiumSection eyebrow="Vehicles" title="BMW support is active, expansion is planned">
      <div className="surface rounded-premium p-6 text-sm text-white/70">
        <p>Currently supported generations include selected BMW G-Chassis vehicles with NBT Evo, EntryNav2, or MGU head units.</p>
        <p className="mt-3">Audi and Mercedes-Benz coverage is in development and will be listed by generation.</p>
      </div>
    </PremiumSection>
  );
}
