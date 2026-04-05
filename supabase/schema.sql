create table users (
  id uuid primary key,
  email text not null unique,
  created_at timestamptz not null default now()
);

create table customer_profiles (
  user_id uuid primary key references users(id),
  full_name text not null,
  phone text
);

create table vehicles (
  id uuid primary key,
  customer_id uuid not null references users(id),
  brand text not null,
  model text not null,
  year int not null,
  chassis text not null,
  head_unit text,
  vin text
);

create table supported_vehicle_configs (
  id uuid primary key,
  brand text not null,
  model text not null,
  chassis text not null,
  head_unit text,
  min_year int not null,
  max_year int not null
);

create table features (
  id uuid primary key,
  brand text not null,
  title text not null,
  description text not null,
  session_minutes int not null,
  base_price_usd int not null
);

create table feature_compatibility_rules (
  id uuid primary key,
  feature_id uuid not null references features(id),
  config_id uuid not null references supported_vehicle_configs(id)
);

create table orders (
  id uuid primary key,
  customer_id uuid not null references users(id),
  vehicle_id uuid not null references vehicles(id),
  status text not null,
  payment_status text not null,
  total_usd int not null,
  created_at timestamptz default now()
);

create table order_items (
  id uuid primary key,
  order_id uuid not null references orders(id),
  feature_id uuid not null references features(id),
  price_usd int not null
);

create table bookings (
  id uuid primary key,
  order_id uuid not null references orders(id),
  starts_at timestamptz,
  status text not null,
  technician_id uuid
);

create table technician_notes (
  id uuid primary key,
  booking_id uuid not null references bookings(id),
  technician_id uuid not null,
  note text not null,
  created_at timestamptz default now()
);

create table setup_requirements (
  id uuid primary key,
  booking_id uuid not null references bookings(id),
  requirement text not null,
  completed boolean not null default false
);
