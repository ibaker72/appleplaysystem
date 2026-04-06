-- =============================================================================
-- Performance indexes and updated_at trigger
-- Idempotent: safe to run multiple times (IF NOT EXISTS / OR REPLACE)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Indexes
-- ---------------------------------------------------------------------------

create index if not exists idx_vehicles_customer_id
  on vehicles (customer_id);

create index if not exists idx_orders_customer_id
  on orders (customer_id);

create index if not exists idx_orders_status
  on orders (status);

create index if not exists idx_orders_payment_status
  on orders (payment_status);

create index if not exists idx_bookings_order_id
  on bookings (order_id);

create index if not exists idx_bookings_status
  on bookings (status);

create index if not exists idx_order_items_order_id
  on order_items (order_id);

create index if not exists idx_feature_compatibility_rules_config_id
  on feature_compatibility_rules (config_id);

create index if not exists idx_setup_requirements_booking_id
  on setup_requirements (booking_id);

create index if not exists idx_technician_notes_booking_id
  on technician_notes (booking_id);

-- ---------------------------------------------------------------------------
-- 2. Reusable updated_at trigger function
-- ---------------------------------------------------------------------------

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------------
-- 3. Apply trigger to all tables with an updated_at column
-- ---------------------------------------------------------------------------

do $$
declare
  _tbl text;
begin
  for _tbl in
    select unnest(array[
      'customer_profiles',
      'vehicles',
      'supported_vehicle_configs',
      'features',
      'orders',
      'bookings'
    ])
  loop
    -- Drop first so CREATE doesn't fail if it already exists
    execute format(
      'drop trigger if exists trg_updated_at on %I', _tbl
    );
    execute format(
      'create trigger trg_updated_at before update on %I
       for each row execute function update_updated_at()', _tbl
    );
  end loop;
end;
$$;
