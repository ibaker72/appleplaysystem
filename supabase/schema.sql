create extension if not exists pgcrypto;

create table customer_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table vehicles (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users(id) on delete cascade,
  brand text not null,
  model text not null,
  year int not null check (year >= 1990 and year <= 2100),
  chassis text not null,
  head_unit text,
  vin text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table supported_vehicle_configs (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  model text not null,
  chassis text not null,
  head_unit text,
  min_year int not null check (min_year >= 1990 and min_year <= 2100),
  max_year int not null check (max_year >= 1990 and max_year <= 2100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint supported_vehicle_configs_year_range_check check (min_year <= max_year)
);

create table features (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  title text not null,
  description text not null,
  session_minutes int not null check (session_minutes > 0),
  base_price_usd int not null check (base_price_usd >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table feature_compatibility_rules (
  id uuid primary key default gen_random_uuid(),
  feature_id uuid not null references features(id) on delete cascade,
  config_id uuid not null references supported_vehicle_configs(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint feature_compatibility_rules_unique unique (feature_id, config_id)
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users(id) on delete cascade,
  vehicle_id uuid not null references vehicles(id) on delete restrict,
  status text not null check (status in ('draft', 'pending', 'confirmed', 'completed', 'cancelled')),
  payment_status text not null check (payment_status in ('unpaid', 'paid', 'refunded', 'failed')),
  total_usd int not null check (total_usd >= 0),
  stripe_checkout_session_id text,
  stripe_payment_intent_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  feature_id uuid not null references features(id) on delete restrict,
  price_usd int not null check (price_usd >= 0),
  created_at timestamptz not null default now()
);

create table bookings (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  starts_at timestamptz,
  status text not null check (status in ('pending', 'scheduled', 'in_progress', 'completed', 'cancelled')),
  technician_id uuid references auth.users(id) on delete set null,
  remote_session_link text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table technician_notes (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  technician_id uuid not null references auth.users(id) on delete cascade,
  note text not null,
  created_at timestamptz not null default now()
);

create table setup_requirements (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  requirement text not null,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);