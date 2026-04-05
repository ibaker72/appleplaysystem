insert into users (id, email) values ('11111111-1111-1111-1111-111111111111', 'alex@sample.com');
insert into customer_profiles (user_id, full_name, phone) values ('11111111-1111-1111-1111-111111111111', 'Alex Fischer', '+1 555-331-9022');

insert into vehicles (id, customer_id, brand, model, year, chassis, head_unit, vin)
values ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'BMW', '3 Series', 2021, 'G20', 'MGU', 'WBA00000000000000');

insert into supported_vehicle_configs (id, brand, model, chassis, head_unit, min_year, max_year)
values ('33333333-3333-3333-3333-333333333333', 'BMW', '3 Series', 'G20', 'MGU', 2019, 2025);

insert into features (id, brand, title, description, session_minutes, base_price_usd)
values
('44444444-4444-4444-4444-444444444441', 'BMW', 'Apple CarPlay Activation', 'Factory-style activation', 35, 179),
('44444444-4444-4444-4444-444444444442', 'BMW', 'Fullscreen Apple CarPlay', 'Enable fullscreen layout', 20, 99),
('44444444-4444-4444-4444-444444444443', 'BMW', 'Video in Motion', 'Passenger media coding', 25, 129);
