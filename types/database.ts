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
        Relationships: [];
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
        Update: {
          brand?: string;
          model?: string;
          year?: number;
          chassis?: string;
          head_unit?: string | null;
          vin?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      supported_vehicle_configs: {
        Row: {
          id: string;
          brand: string;
          model: string;
          chassis: string;
          head_unit: string | null;
          min_year: number;
          max_year: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          brand: string;
          model: string;
          chassis: string;
          head_unit?: string | null;
          min_year: number;
          max_year: number;
        };
        Update: {
          brand?: string;
          model?: string;
          chassis?: string;
          head_unit?: string | null;
          min_year?: number;
          max_year?: number;
          updated_at?: string;
        };
        Relationships: [];
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
        Insert: {
          brand: string;
          title: string;
          description: string;
          session_minutes: number;
          base_price_usd: number;
        };
        Update: {
          brand?: string;
          title?: string;
          description?: string;
          session_minutes?: number;
          base_price_usd?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      feature_compatibility_rules: {
        Row: {
          id: string;
          feature_id: string;
          config_id: string;
          created_at: string;
        };
        Insert: {
          feature_id: string;
          config_id: string;
        };
        Update: {
          feature_id?: string;
          config_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "feature_compatibility_rules_feature_id_fkey";
            columns: ["feature_id"];
            referencedRelation: "features";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "feature_compatibility_rules_config_id_fkey";
            columns: ["config_id"];
            referencedRelation: "supported_vehicle_configs";
            referencedColumns: ["id"];
          },
        ];
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
        Update: {
          status?: OrderStatus;
          payment_status?: PaymentStatus;
          total_usd?: number;
          stripe_checkout_session_id?: string | null;
          stripe_payment_intent_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orders_vehicle_id_fkey";
            columns: ["vehicle_id"];
            referencedRelation: "vehicles";
            referencedColumns: ["id"];
          },
        ];
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
        Update: {
          order_id?: string;
          feature_id?: string;
          price_usd?: number;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_feature_id_fkey";
            columns: ["feature_id"];
            referencedRelation: "features";
            referencedColumns: ["id"];
          },
        ];
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
        Update: {
          starts_at?: string | null;
          status?: BookingStatus;
          technician_id?: string | null;
          remote_session_link?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_order_id_fkey";
            columns: ["order_id"];
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
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
        Update: {
          requirement?: string;
          completed?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "setup_requirements_booking_id_fkey";
            columns: ["booking_id"];
            referencedRelation: "bookings";
            referencedColumns: ["id"];
          },
        ];
      };
      technician_notes: {
        Row: {
          id: string;
          booking_id: string;
          technician_id: string;
          note: string;
          created_at: string;
        };
        Insert: {
          booking_id: string;
          technician_id: string;
          note: string;
        };
        Update: {
          note?: string;
        };
        Relationships: [
          {
            foreignKeyName: "technician_notes_booking_id_fkey";
            columns: ["booking_id"];
            referencedRelation: "bookings";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type TableRow<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
