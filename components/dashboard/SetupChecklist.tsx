const items = ["Laptop charged", "Vehicle parked in open area", "OBD/ENET cable ready", "Stable internet connection", "Battery charger connected (recommended)"];

export function SetupChecklist() {
  return (
    <div className="surface rounded-premium p-5">
      <h3 className="text-lg font-medium">Setup checklist</h3>
      <ul className="mt-3 space-y-2 text-sm text-white/70">
        {items.map((item) => <li key={item}>• {item}</li>)}
      </ul>
    </div>
  );
}
