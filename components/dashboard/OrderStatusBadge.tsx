import type { OrderStatus } from "@/lib/types/domain";

const styles: Record<OrderStatus, string> = {
  pending: "bg-white/10 text-white/80",
  paid: "bg-electric/20 text-electric",
  booked: "bg-blue-400/20 text-blue-200",
  in_progress: "bg-amber-400/20 text-amber-200",
  complete: "bg-emerald-400/20 text-emerald-200"
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}>{status.replace("_", " ")}</span>;
}
