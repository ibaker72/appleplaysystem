"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const brandOptions = ["BMW"];
const modelOptions: Record<string, string[]> = {
  BMW: ["1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "7 Series", "X1", "X3", "X5", "X7"],
};
const chassisOptions: Record<string, string[]> = {
  BMW: ["F20", "F22", "F30", "F32", "F48", "F10", "G20", "G22", "G30", "G01", "G05", "G07", "G70"],
};
const headUnitOptions = ["MGU", "NBT Evo", "EntryNav2", "NBT", "CIC"];

const selectClass =
  "w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none ring-electric transition focus:ring-1";
const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none ring-electric transition focus:ring-1";

export function CompatibilityForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    brand: "BMW",
    model: "3 Series",
    year: "2021",
    chassis: "G20",
    headUnit: "MGU",
    vin: "",
  });

  const query = useMemo(() => new URLSearchParams(form).toString(), [form]);
  const models = modelOptions[form.brand] ?? [];
  const chassisCodes = chassisOptions[form.brand] ?? [];

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="surface rounded-premium p-6 md:p-8">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          <span className="mb-2 block text-white/70">Brand</span>
          <select value={form.brand} onChange={(e) => update("brand", e.target.value)} className={selectClass}>
            {brandOptions.map((b) => (
              <option key={b} value={b} className="bg-panel">
                {b}
              </option>
            ))}
            <option value="Audi" disabled className="bg-panel">
              Audi (coming soon)
            </option>
            <option value="Mercedes-Benz" disabled className="bg-panel">
              Mercedes-Benz (coming soon)
            </option>
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-2 block text-white/70">Model</span>
          <select value={form.model} onChange={(e) => update("model", e.target.value)} className={selectClass}>
            {models.map((m) => (
              <option key={m} value={m} className="bg-panel">
                {m}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-2 block text-white/70">Year</span>
          <input
            type="number"
            min={2000}
            max={2026}
            value={form.year}
            onChange={(e) => update("year", e.target.value)}
            className={inputClass}
            placeholder="e.g. 2021"
          />
        </label>

        <label className="text-sm">
          <span className="mb-2 block text-white/70">Chassis code</span>
          <select value={form.chassis} onChange={(e) => update("chassis", e.target.value)} className={selectClass}>
            {chassisCodes.map((c) => (
              <option key={c} value={c} className="bg-panel">
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-2 block text-white/70">Head unit</span>
          <select value={form.headUnit} onChange={(e) => update("headUnit", e.target.value)} className={selectClass}>
            {headUnitOptions.map((h) => (
              <option key={h} value={h} className="bg-panel">
                {h}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-2 block text-white/70">VIN (optional)</span>
          <input
            value={form.vin}
            onChange={(e) => update("vin", e.target.value)}
            className={inputClass}
            placeholder="WBA..."
            maxLength={17}
          />
        </label>
      </div>
      <Button className="mt-6" href={`/check-compatibility/results?${query}`}>
        View Compatibility
      </Button>
    </div>
  );
}
