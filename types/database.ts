export type OrderStatus = "draft" | "pending" | "confirmed" | "completed" | "cancelled";
export type PaymentStatus = "unpaid" | "paid" | "refunded" | "failed";
export type BookingStatus = "pending" | "scheduled" | "in_progress" | "completed" | "cancelled";

export interface Database {
  public: {
    Tables: {
      customer_profiles: {
        Row: {
          user_id: string;
          full_name: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          full_name?: string | null;
          phone?: string | null;
        };
        Update: {
          full_name?: string | null;
          phone?: string | null;
          updated_at?: string;
        };
      };
      vehicles: {
        Row: {
          id: string;
          customer_id: string;
          brand: string;
          model: string;
          year: number;
          chassis: string;
          head_unit: string | null;
          vin: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          customer_id: string;
          brand: string;
          model: string;
          year: number;
          chassis: string;
          head_unit?: string | null;
          vin?: string | null;
        };
        Update: Partial<{
          brand: string;
          model: string;
          year: number;
          chassis: string;
          head_unit: string | null;
          vin: string | null;
          updated_at: string;
        }>;
      };
      supported_vehicle_configs: {
        Row: {
          id: string;
          brand: string;
          model: string;
          chassis: string;
          head_unit: string;
          min_year: number;
          max_year: number;
          created_at: string;
          updated_at: string;
        };
      };
      features: {
        Row: {
          id: string;
          brand: string;
          title: string;
          description: string;
          session_minutes: number;
          base_price_usd: number;
          created_at: string;
          updated_at: string;
        };
      };
      feature_compatibility_rules: {
        Row: {
          id: string;
          feature_id: string;
          config_id: string;
          created_at: string;
        };
      };
      orders: {
        Row: {
          id: string;
          customer_id: string;
          vehicle_id: string;
          status: OrderStatus;
          payment_status: PaymentStatus;
          total_usd: number;
          stripe_checkout_session_id: string | null;
          stripe_payment_intent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          customer_id: string;
          vehicle_id: string;
          status?: OrderStatus;
          payment_status?: PaymentStatus;
          total_usd: number;
          stripe_checkout_session_id?: string | null;
          stripe_payment_intent_id?: string | null;
        };
        Update: Partial<{
          status: OrderStatus;
          payment_status: PaymentStatus;
          total_usd: number;
          stripe_checkout_session_id: string | null;
          stripe_payment_intent_id: string | null;
          updated_at: string;
        }>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          feature_id: string;
          price_usd: number;
          created_at: string;
        };
        Insert: {
          order_id: string;
          feature_id: string;
          price_usd: number;
        };
      };
      bookings: {
        Row: {
          id: string;
          order_id: string;
          starts_at: string | null;
          status: BookingStatus;
          technician_id: string | null;
          remote_session_link: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          order_id: string;
          starts_at?: string | null;
          status?: BookingStatus;
          technician_id?: string | null;
          remote_session_link?: string | null;
        };
        Update: Partial<{
          starts_at: string | null;
          status: BookingStatus;
          technician_id: string | null;
          remote_session_link: string | null;
          updated_at: string;
        }>;
      };
      setup_requirements: {
        Row: {
          id: string;
          booking_id: string;
          requirement: string;
          completed: boolean;
          created_at: string;
        };
        Insert: {
          booking_id: string;
          requirement: string;
          completed?: boolean;
        };
      };
      technician_notes: {
        Row: {
          id: string;
          booking_id: string;
          technician_id: string;
          note: string;
          created_at: string;
        };
      };
    };
  };
}

export type TableRow<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
