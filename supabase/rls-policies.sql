-- Row Level Security policies for all tables
-- Run this migration after schema.sql

-- =============================================================================
-- customer_profiles
-- =============================================================================
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON customer_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON customer_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON customer_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- vehicles
-- =============================================================================
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own vehicles"
  ON vehicles FOR SELECT
  USING (auth.uid() = customer_id);

CREATE POLICY "Users can insert own vehicles"
  ON vehicles FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update own vehicles"
  ON vehicles FOR UPDATE
  USING (auth.uid() = customer_id)
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can delete own vehicles"
  ON vehicles FOR DELETE
  USING (auth.uid() = customer_id);

-- =============================================================================
-- supported_vehicle_configs
-- =============================================================================
ALTER TABLE supported_vehicle_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read vehicle configs"
  ON supported_vehicle_configs FOR SELECT
  USING (auth.role() = 'authenticated');

-- =============================================================================
-- features
-- =============================================================================
ALTER TABLE features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read features"
  ON features FOR SELECT
  USING (true);

-- =============================================================================
-- feature_compatibility_rules
-- =============================================================================
ALTER TABLE feature_compatibility_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read compatibility rules"
  ON feature_compatibility_rules FOR SELECT
  USING (auth.role() = 'authenticated');

-- =============================================================================
-- orders
-- =============================================================================
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT
  USING (auth.uid() = customer_id);

CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

-- =============================================================================
-- order_items
-- =============================================================================
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.customer_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert items for own orders"
  ON order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.customer_id = auth.uid()
    )
  );

-- =============================================================================
-- bookings
-- =============================================================================
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own bookings"
  ON bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = bookings.order_id
        AND orders.customer_id = auth.uid()
    )
  );

-- =============================================================================
-- setup_requirements
-- =============================================================================
ALTER TABLE setup_requirements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own setup requirements"
  ON setup_requirements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      JOIN orders ON orders.id = bookings.order_id
      WHERE bookings.id = setup_requirements.booking_id
        AND orders.customer_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own setup requirements"
  ON setup_requirements FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      JOIN orders ON orders.id = bookings.order_id
      WHERE bookings.id = setup_requirements.booking_id
        AND orders.customer_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings
      JOIN orders ON orders.id = bookings.order_id
      WHERE bookings.id = setup_requirements.booking_id
        AND orders.customer_id = auth.uid()
    )
  );

-- =============================================================================
-- technician_notes
-- =============================================================================
ALTER TABLE technician_notes ENABLE ROW LEVEL SECURITY;

-- No client access — service role only
