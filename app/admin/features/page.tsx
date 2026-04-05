import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { features } from "@/lib/data/mock";

export default function AdminFeaturesPage() {
  const rows = features.map((feature) => ({ id: feature.id, title: feature.title, brand: feature.brand, time: feature.sessionMinutes + "m", price: "$" + feature.priceUsd }));
  return <DashboardShell title="Admin · Features"><AdminDataTable title="Features" rows={rows} columns={[{ key: "id", label: "ID" }, { key: "title", label: "Feature" }, { key: "brand", label: "Brand" }, { key: "time", label: "Session" }, { key: "price", label: "Price" }]} /></DashboardShell>;
}
