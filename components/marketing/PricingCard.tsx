import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PricingCard({
  name,
  price,
  description,
  duration,
  support,
  forWho
}: {
  name: string;
  price: string;
  description: string[];
  duration: string;
  support: string;
  forWho: string;
}) {
  return (
    <div className="surface rounded-premium p-6">
      <h3 className="text-lg font-medium">{name}</h3>
      <p className="mt-2 text-3xl font-semibold">{price}</p>
      <p className="mt-2 text-sm text-white/65">{forWho}</p>
      <ul className="mt-5 space-y-2 text-sm text-white/75">
        {description.map((item) => (
          <li className="flex items-center gap-2" key={item}><Check size={16} className="text-electric" />{item}</li>
        ))}
      </ul>
      <div className="mt-5 space-y-1 text-xs text-white/55">
        <p>Session: {duration}</p>
        <p>Support: {support}</p>
      </div>
      <Button href="/check-compatibility" className="mt-6 w-full">Continue</Button>
    </div>
  );
}
