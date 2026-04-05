import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { orders } from "@/lib/data/mock";

export default function AdminOrdersPage() {
  const rows = orders.map((order) => ({ id: order.id, customerId: order.customerId, vehicleId: order.vehicleId, status: order.status, payment: "$" + order.totalUsd }));
  return <DashboardShell title="Admin · Orders"><AdminDataTable title="Orders" rows={rows} columns={[{ key: "id", label: "Order" }, { key: "customerId", label: "Customer" }, { key: "vehicleId", label: "Vehicle" }, { key: "status", label: "Session Status" }, { key: "payment", label: "Payment" }]} /></DashboardShell>;
}
