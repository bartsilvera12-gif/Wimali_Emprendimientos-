-- =====================================================================
-- WIMALI EMPRENDIMIENTOS — 0002: tablas
-- Todas las tablas del proyecto dentro del schema `wimaliemprendimientos`.
-- =====================================================================

-- ---------- admin_users ----------------------------------------------
-- Administradores autorizados. La contraseña la maneja Supabase Auth
-- (auth.users); acá solo guardamos el vínculo y el rol.
create table if not exists wimaliemprendimientos.admin_users (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null unique references auth.users (id) on delete cascade,
  email       text not null,
  full_name   text,
  role        text not null default 'admin' check (role in ('super_admin', 'admin')),
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists admin_users_user_id_idx on wimaliemprendimientos.admin_users (user_id);

-- ---------- categories -----------------------------------------------
create table if not exists wimaliemprendimientos.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  image_url   text,
  image_path  text,
  active      boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists categories_active_idx on wimaliemprendimientos.categories (active);
create index if not exists categories_sort_idx on wimaliemprendimientos.categories (sort_order);

-- ---------- products -------------------------------------------------
create table if not exists wimaliemprendimientos.products (
  id                uuid primary key default gen_random_uuid(),
  category_id       uuid references wimaliemprendimientos.categories (id) on delete set null,
  sku               text unique,
  slug              text not null unique,
  name              text not null,
  short_description text,
  description       text,
  price             numeric(12, 2) not null default 0 check (price >= 0),
  previous_price    numeric(12, 2) check (previous_price is null or previous_price >= 0),
  stock             integer not null default 0 check (stock >= 0),
  featured          boolean not null default false,
  is_new            boolean not null default false,
  is_offer          boolean not null default false,
  active            boolean not null default true,
  sort_order        integer not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists products_category_idx on wimaliemprendimientos.products (category_id);
create index if not exists products_active_idx on wimaliemprendimientos.products (active);
create index if not exists products_offer_idx on wimaliemprendimientos.products (is_offer);
create index if not exists products_featured_idx on wimaliemprendimientos.products (featured);
create index if not exists products_sort_idx on wimaliemprendimientos.products (sort_order);

-- ---------- product_images -------------------------------------------
create table if not exists wimaliemprendimientos.product_images (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid not null references wimaliemprendimientos.products (id) on delete cascade,
  storage_path text,
  public_url   text not null,
  alt_text     text,
  is_primary   boolean not null default false,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists product_images_product_idx on wimaliemprendimientos.product_images (product_id);
-- Solo una imagen principal por producto.
create unique index if not exists product_images_one_primary_idx
  on wimaliemprendimientos.product_images (product_id)
  where is_primary;

-- ---------- hero_products (productos flotantes del Hero) -------------
create table if not exists wimaliemprendimientos.hero_products (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references wimaliemprendimientos.products (id) on delete cascade,
  sort_order  integer not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  unique (product_id)
);

-- ---------- site_sections (textos editables por sección) ------------
create table if not exists wimaliemprendimientos.site_sections (
  id          uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  eyebrow     text,
  title       text,
  subtitle    text,
  body        text,
  button_text text,
  button_url  text,
  active      boolean not null default true,
  sort_order  integer not null default 0,
  settings    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------- benefits (tarjetas de "Nosotros") -----------------------
create table if not exists wimaliemprendimientos.benefits (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  icon        text,
  active      boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------- business_settings (una sola config activa) --------------
create table if not exists wimaliemprendimientos.business_settings (
  id               uuid primary key default gen_random_uuid(),
  business_name    text not null default 'WIMALI EMPRENDIMIENTOS',
  whatsapp_number  text not null default '595995364978',
  phone_display    text,
  address          text,
  map_query        text,
  google_maps_url  text,
  opening_hours    text,
  shipping_text    text,
  payment_text     text,
  logo_url         text,
  logo_path        text,
  favicon_url      text,
  seo_title        text,
  seo_description  text,
  active           boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ---------- social_links ---------------------------------------------
create table if not exists wimaliemprendimientos.social_links (
  id          uuid primary key default gen_random_uuid(),
  platform    text not null,
  label       text,
  url         text not null,
  icon        text,
  active      boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------- media_assets (biblioteca multimedia) --------------------
create table if not exists wimaliemprendimientos.media_assets (
  id           uuid primary key default gen_random_uuid(),
  name         text,
  storage_path text not null,
  public_url   text not null,
  mime_type    text,
  file_size    bigint,
  alt_text     text,
  created_by   uuid references auth.users (id) on delete set null,
  created_at   timestamptz not null default now()
);

-- ---------- audit_logs -----------------------------------------------
create table if not exists wimaliemprendimientos.audit_logs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users (id) on delete set null,
  action     text not null,
  entity     text,
  entity_id  text,
  old_data   jsonb,
  new_data   jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_entity_idx on wimaliemprendimientos.audit_logs (entity, entity_id);
create index if not exists audit_logs_created_idx on wimaliemprendimientos.audit_logs (created_at desc);

-- ---------- triggers updated_at --------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'admin_users', 'categories', 'products', 'site_sections',
    'benefits', 'business_settings', 'social_links'
  ]
  loop
    execute format(
      'drop trigger if exists set_updated_at on wimaliemprendimientos.%I;', t
    );
    execute format(
      'create trigger set_updated_at before update on wimaliemprendimientos.%I
       for each row execute function wimaliemprendimientos.set_updated_at();', t
    );
  end loop;
end $$;

-- ---------- GRANTS explícitos ----------------------------------------
-- Lectura pública (anon) en las tablas de contenido público. La visibilidad
-- fina (solo filas activas) la aplica RLS en 0003.
grant select on
  wimaliemprendimientos.categories,
  wimaliemprendimientos.products,
  wimaliemprendimientos.product_images,
  wimaliemprendimientos.hero_products,
  wimaliemprendimientos.site_sections,
  wimaliemprendimientos.benefits,
  wimaliemprendimientos.business_settings,
  wimaliemprendimientos.social_links
to anon, authenticated;

-- CRUD para autenticados (lo acota RLS a administradores).
grant select, insert, update, delete on all tables in schema wimaliemprendimientos
  to authenticated;

grant usage, select on all sequences in schema wimaliemprendimientos
  to anon, authenticated;
