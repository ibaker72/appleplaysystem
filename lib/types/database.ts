export interface Database {
  public: {
    Tables: {
      users: { Row: { id: string; email: string; created_at: string } };
      customer_profiles: { Row: { user_id: string; full_name: string; phone: string | null } };
      vehicles: { Row: { id: string; customer_id: string; brand: string; model: string; year: number; chassis: string; head_unit: string | null; vin: string | null } };
      supported_vehicle_configs: { Row: { id: string; brand: string; model: string; chassis: string; head_unit: string | null; min_year: number; max_year: number } };
      features: { Row: { id: string; brand: string; title: string; description: string; session_minutes: number; base_price_usd: number } };
      feature_compatibility_rules: { Row: { id: string; feature_id: string; config_id: string } };
      orders: { Row: { id: string; customer_id: string; vehicle_id: string; status: string; total_usd: number; payment_status: string; created_at: string } };
      order_items: { Row: { id: string; order_id: string; feature_id: string; price_usd: number } };
      bookings: { Row: { id: string; order_id: string; starts_at: string; status: string; technician_id: string | null } };
      technician_notes: { Row: { id: string; booking_id: string; technician_id: string; note: string; created_at: string } };
      setup_requirements: { Row: { id: string; booking_id: string; requirement: string; completed: boolean } };
    };
  };
}
