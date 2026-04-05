import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { customers } from "@/lib/data/mock";

export default function AdminCustomersPage() {
  const rows = customers.map((customer) => ({ id: customer.id, name: customer.fullName, email: customer.email, phone: customer.phone ?? "-" }));
  return <DashboardShell title="Admin · Customers"><AdminDataTable title="Customers" rows={rows} columns={[{ key: "id", label: "ID" }, { key: "name", label: "Name" }, { key: "email", label: "Email" }, { key: "phone", label: "Phone" }]} /></DashboardShell>;
}
