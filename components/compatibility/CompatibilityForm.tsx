"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function CompatibilityForm() {
  const router = useRouter();
  const [form, setForm] = useState({ brand: "BMW", model: "3 Series", year: "2021", chassis: "G20", headUnit: "MGU", vin: "" });
  const query = useMemo(() => new URLSearchParams(form).toString(), [form]);

  return (
    <div className="surface rounded-premium p-6 md:p-8">
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries({ brand: "Brand", model: "Model", year: "Year", chassis: "Chassis", headUnit: "Head Unit", vin: "VIN (optional)" }).map(([key, label]) => (
          <label className="text-sm" key={key}>
            <span className="mb-2 block text-white/70">{label}</span>
            <input
              value={form[key as keyof typeof form]}
              onChange={(event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none ring-electric transition focus:ring-1"
              placeholder={label}
            />
          </label>
        ))}
      </div>
      <Button className="mt-5" href={`/check-compatibility/results?${query}`}>View Compatibility</Button>
    </div>
  );
}
