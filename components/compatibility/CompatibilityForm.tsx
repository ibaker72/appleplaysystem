"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

// Hardcoded fallback defaults in case the API fetch fails
const fallbackBrands = ["BMW", "Audi", "Mercedes-Benz", "Volkswagen", "Porsche"];
const fallbackModels: Record<string, string[]> = {
  BMW: ["1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "7 Series", "X1", "X3", "X5", "X7"],
  Audi: ["A3", "A4", "A5", "A6", "Q3", "Q5", "Q7", "Q8", "e-tron"],
  "Mercedes-Benz": ["A-Class", "C-Class", "E-Class", "S-Class", "GLC", "GLE", "GLS"],
  Volkswagen: ["Golf", "Polo", "Passat", "Tiguan", "T-Roc"],
  Porsche: ["911", "Cayenne", "Macan", "Taycan", "Panamera"],
};
const fallbackChassis: Record<string, string[]> = {
  BMW: ["F20", "F22", "F30", "F32", "F48", "F10", "G20", "G22", "G30", "G01", "G05", "G07", "G70"],
  Audi: ["8V", "B9", "F5", "4K", "8U", "FY", "4M", "4N"],
  "Mercedes-Benz": ["W177", "W206", "W214", "W223", "X254", "V167", "X167"],
  Volkswagen: ["MK7", "MK8", "B8", "AD1", "A11", "AW"],
  Porsche: ["992", "9YA", "95B", "Y1A", "971"],
};
const fallbackHeadUnits = ["MGU", "NBT Evo", "EntryNav2", "NBT", "CIC", "MIB2", "MIB3", "MBUX", "NTG5", "NTG6", "PCM5", "PCM6"];

interface CompatibilityOptions {
  brands: string[];
  models: Record<string, string[]>;
  chassis: Record<string, string[]>;
  headUnits: string[];
}

const selectClass =
  "w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none ring-electric transition focus:ring-1";
const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none ring-electric transition focus:ring-1";

export function CompatibilityForm() {
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<CompatibilityOptions>({
    brands: fallbackBrands,
    models: fallbackModels,
    chassis: fallbackChassis,
    headUnits: fallbackHeadUnits,
  });

  const [form, setForm] = useState({
    brand: "BMW",
    model: "3 Series",
    year: "2021",
    chassis: "G20",
    headUnit: "MGU",
    vin: "",
  });

  useEffect(() => {
    fetch("/api/compatibility/options")
      .then((res) => {
        if (!res.ok) throw new Error("fetch failed");
        return res.json();
      })
      .then((data: CompatibilityOptions) => {
        setOptions(data);
      })
      .catch(() => {
        // Keep fallback defaults
      })
      .finally(() => setLoading(false));
  }, []);

  const query = useMemo(() => new URLSearchParams(form).toString(), [form]);
  const models = options.models[form.brand] ?? [];
  const chassisCodes = options.chassis[form.brand] ?? [];

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="surface rounded-premium p-6 md:p-8">
      {loading ? (
        <div className="flex items-center gap-2 py-4 text-sm text-white/50">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
          Loading vehicle options…
        </div>
      ) : null}
      <div className={`grid gap-4 md:grid-cols-2 ${loading ? "pointer-events-none opacity-50" : ""}`}>
        <label className="text-sm">
          <span className="mb-2 block text-white/70">Brand</span>
          <select value={form.brand} onChange={(e) => update("brand", e.target.value)} className={selectClass}>
            {options.brands.map((b) => (
              <option key={b} value={b} className="bg-panel">
                {b}
              </option>
            ))}
            {!options.brands.includes("Audi") && (
              <option value="Audi" className="bg-panel">Audi</option>
            )}
            {!options.brands.includes("Mercedes-Benz") && (
              <option value="Mercedes-Benz" className="bg-panel">Mercedes-Benz</option>
            )}
            {!options.brands.includes("Volkswagen") && (
              <option value="Volkswagen" className="bg-panel">Volkswagen</option>
            )}
            {!options.brands.includes("Porsche") && (
              <option value="Porsche" className="bg-panel">Porsche</option>
            )}
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
            {options.headUnits.map((h) => (
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
