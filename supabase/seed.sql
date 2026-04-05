insert into customer_profiles (user_id, full_name, phone)
values ('37499318-0c14-4150-8480-ccc36db7164c', 'Alex Fischer', '+1 555-331-9022');

insert into vehicles (customer_id, brand, model, year, chassis, head_unit, vin)
values (
  '37499318-0c14-4150-8480-ccc36db7164c',
  'BMW',
  '3 Series',
  2021,
  'G20',
  'MGU',
  'WBA00000000000000'
);

insert into supported_vehicle_configs (brand, model, chassis, head_unit, min_year, max_year)
values ('BMW', '3 Series', 'G20', 'MGU', 2019, 2025);

insert into features (brand, title, description, session_minutes, base_price_usd)
values
('BMW', 'Apple CarPlay Activation', 'Factory-style activation', 35, 179),
('BMW', 'Fullscreen Apple CarPlay', 'Enable fullscreen layout', 20, 99),
('BMW', 'Video in Motion', 'Passenger media coding', 25, 129);