import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { bookings } from "@/lib/data/mock";

export default function AdminSessionsPage() {
  const rows = bookings.map((booking) => ({ id: booking.id, orderId: booking.orderId, startsAt: new Date(booking.startsAt).toLocaleString(), technician: booking.technicianName, status: booking.status }));
  return <DashboardShell title="Admin · Sessions"><AdminDataTable title="Sessions" rows={rows} columns={[{ key: "id", label: "Session" }, { key: "orderId", label: "Order" }, { key: "startsAt", label: "Time" }, { key: "technician", label: "Technician" }, { key: "status", label: "Status" }]} /></DashboardShell>;
}
