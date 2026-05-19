create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  tamil_name text,
  description text,
  category text not null check (category in ('coconut', 'oil')),
  unit_options text[] not null default array['piece']::text[],
  price_in_paise integer not null check (price_in_paise >= 0),
  is_active boolean not null default true,
  sort_order integer not null default 99,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_unit_options_check check (
    unit_options <@ array['piece', 'kg', 'litre']::text[]
  )
);

create table if not exists public.daily_rates (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  effective_date date not null default current_date,
  unit text not null check (unit in ('piece', 'kg', 'litre')),
  rate_in_paise integer not null check (rate_in_paise >= 0),
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (product_id, effective_date, unit)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_reference text not null unique,
  customer_name text not null,
  customer_phone text not null,
  fulfillment_type text not null check (fulfillment_type in ('delivery', 'pickup')),
  delivery_address text,
  preferred_delivery_slot text not null,
  status text not null default 'new' check (
    status in ('new', 'confirmed', 'packed', 'out_for_delivery', 'completed', 'cancelled')
  ),
  subtotal_in_paise integer not null check (subtotal_in_paise >= 0),
  delivery_fee_in_paise integer not null default 0 check (delivery_fee_in_paise >= 0),
  total_in_paise integer not null check (total_in_paise >= 0),
  whatsapp_message text,
  source text not null default 'homepage',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  unit text not null check (unit in ('piece', 'kg', 'litre')),
  quantity numeric(10, 2) not null check (quantity > 0),
  rate_in_paise integer not null check (rate_in_paise >= 0),
  line_total_in_paise integer not null check (line_total_in_paise >= 0),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.shop_settings (
  id text primary key default 'default' check (id = 'default'),
  shop_name text not null default 'Sri Murugan Coconut Wholesale',
  is_open boolean not null default true,
  status_message text not null default 'Open for wholesale orders today',
  opens_at time,
  closes_at time,
  pickup_address text,
  whatsapp_phone text,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create index if not exists products_active_sort_idx on public.products (is_active, sort_order);
create index if not exists daily_rates_latest_idx on public.daily_rates (product_id, unit, effective_date desc);
create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists order_items_order_id_idx on public.order_items (order_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists shop_settings_set_updated_at on public.shop_settings;
create trigger shop_settings_set_updated_at
before update on public.shop_settings
for each row execute function public.set_updated_at();

alter table public.products enable row level security;
alter table public.daily_rates enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.shop_settings enable row level security;

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products for select
using (is_active = true);

drop policy if exists "Public can read daily rates" on public.daily_rates;
create policy "Public can read daily rates"
on public.daily_rates for select
using (true);

drop policy if exists "Public can read shop settings" on public.shop_settings;
create policy "Public can read shop settings"
on public.shop_settings for select
using (true);

insert into public.products
  (id, slug, name, tamil_name, description, category, unit_options, price_in_paise, sort_order)
values
  (
    '00000000-0000-0000-0000-000000000101',
    'fresh-wholesale-coconut',
    'Fresh Wholesale Coconut',
    'புது தேங்காய்',
    'Sorted market coconuts for shops, hotels, functions, and resellers.',
    'coconut',
    array['piece', 'kg']::text[],
    2800,
    1
  ),
  (
    '00000000-0000-0000-0000-000000000201',
    'coconut-oil',
    'Coconut Oil',
    'தேங்காய் எண்ணெய்',
    'Wholesale coconut oil for cooking and retail refill.',
    'oil',
    array['litre']::text[],
    19500,
    2
  ),
  (
    '00000000-0000-0000-0000-000000000202',
    'groundnut-oil',
    'Groundnut Oil',
    'கடலை எண்ணெய்',
    'Bulk groundnut oil with reliable daily supply.',
    'oil',
    array['litre']::text[],
    24500,
    3
  ),
  (
    '00000000-0000-0000-0000-000000000203',
    'sesame-oil',
    'Sesame Oil',
    'நல்லெண்ணெய்',
    'Sesame oil for wholesale and local shop orders.',
    'oil',
    array['litre']::text[],
    31000,
    4
  )
on conflict (id) do update set
  name = excluded.name,
  tamil_name = excluded.tamil_name,
  description = excluded.description,
  category = excluded.category,
  unit_options = excluded.unit_options,
  price_in_paise = excluded.price_in_paise,
  sort_order = excluded.sort_order;

insert into public.daily_rates (product_id, effective_date, unit, rate_in_paise, notes)
values
  ('00000000-0000-0000-0000-000000000101', current_date, 'piece', 2800, 'Market rate changes daily'),
  ('00000000-0000-0000-0000-000000000101', current_date, 'kg', 5200, 'Bulk kilogram rate'),
  ('00000000-0000-0000-0000-000000000201', current_date, 'litre', 19500, null),
  ('00000000-0000-0000-0000-000000000202', current_date, 'litre', 24500, null),
  ('00000000-0000-0000-0000-000000000203', current_date, 'litre', 31000, null)
on conflict (product_id, effective_date, unit) do update set
  rate_in_paise = excluded.rate_in_paise,
  notes = excluded.notes;

insert into public.shop_settings
  (id, shop_name, is_open, status_message, opens_at, closes_at, pickup_address, whatsapp_phone)
values
  (
    'default',
    'Sri Murugan Coconut Wholesale',
    true,
    'Open for wholesale orders today',
    '05:30',
    '20:30',
    'Koyambedu Market Road, Chennai, Tamil Nadu',
    '919876543210'
  )
on conflict (id) do update set
  shop_name = excluded.shop_name,
  is_open = excluded.is_open,
  status_message = excluded.status_message,
  opens_at = excluded.opens_at,
  closes_at = excluded.closes_at,
  pickup_address = excluded.pickup_address,
  whatsapp_phone = excluded.whatsapp_phone;
