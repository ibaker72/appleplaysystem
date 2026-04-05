import type { BookingStatus } from "@/types/database";

export interface BookingSummary {
  id: string;
  orderId: string;
  status: BookingStatus;
  startsAt: string | null;
  setupProgress: number;
}
