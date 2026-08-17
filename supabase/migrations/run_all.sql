-- =================================================================
-- WIMALI EMPRENDIMIENTOS — TODAS LAS MIGRACIONES (0001 → 0005)
-- Generado automáticamente. Pegar completo en el SQL Editor y Run.
-- =================================================================


-- >>>>>>>>>>>>>>>>>>>>>>>> 0001_create_wimaliemprendimientos_schema.sql <<<<<<<<<<<<<<<<<<<<<<<<

-- =====================================================================
-- WIMALI EMPRENDIMIENTOS — 0001: schema + helpers
-- Crea el schema propio del proyecto. NINGUNA tabla del proyecto vive en
-- `public`; todo queda dentro de `wimaliemprendimientos`.
-- =====================================================================

create schema if not exists wimaliemprendimientos;

-- Acceso al schema para los roles de Supabase.
grant usage on schema wimaliemprendimientos to anon, authenticated, service_role;

-- Privilegios por defecto para objetos futuros creados en el schema.
alter default privileges in schema wimaliemprendimientos
  grant select on tables to anon;
alter default privileges in schema wimaliemprendimientos
  grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema wimaliemprendimientos
  grant all on tables to service_role;
alter default privileges in schema wimaliemprendimientos
  grant usage, select on sequences to anon, authenticated, service_role;

-- Helper: mantiene actualizado updated_at en cada UPDATE.
create or replace function wimaliemprendimientos.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- IMPORTANTE — Exponer el schema a la API (PostgREST / Supabase)
-- ---------------------------------------------------------------------
-- Como las tablas NO están en `public`, hay que exponer el schema a la API,
-- de lo contrario el frontend no podrá consultarlo.
--
--  * Supabase Cloud:  Dashboard → Project Settings → API →
--                     "Exposed schemas": agregar `wimaliemprendimientos`.
--  * Self-hosted (api.neura.com.py): en la config de PostgREST/Kong,
--                     PGRST_DB_SCHEMAS = "public,storage,wimaliemprendimientos"
--                     y reiniciar el servicio.
--
-- En el frontend siempre consultar con:
--     supabase.schema('wimaliemprendimientos').from('...')
-- ---------------------------------------------------------------------


-- >>>>>>>>>>>>>>>>>>>>>>>> 0002_create_tables.sql <<<<<<<<<<<<<<<<<<<<<<<<

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


-- >>>>>>>>>>>>>>>>>>>>>>>> 0003_rls_policies.sql <<<<<<<<<<<<<<<<<<<<<<<<

-- =====================================================================
-- WIMALI EMPRENDIMIENTOS — 0003: seguridad (RLS + is_admin + auditoría)
-- =====================================================================

-- ---------- is_admin(): ¿el usuario actual es admin activo? -----------
-- SECURITY DEFINER para poder leer admin_users saltando su propia RLS.
create or replace function wimaliemprendimientos.is_admin()
returns boolean
language sql
stable
security definer
set search_path = wimaliemprendimientos, public
as $$
  select exists (
    select 1
    from wimaliemprendimientos.admin_users a
    where a.user_id = auth.uid()
      and a.active = true
  );
$$;

grant execute on function wimaliemprendimientos.is_admin() to anon, authenticated;

-- ---------- Habilitar RLS en todas las tablas ------------------------
alter table wimaliemprendimientos.admin_users        enable row level security;
alter table wimaliemprendimientos.categories         enable row level security;
alter table wimaliemprendimientos.products           enable row level security;
alter table wimaliemprendimientos.product_images     enable row level security;
alter table wimaliemprendimientos.hero_products      enable row level security;
alter table wimaliemprendimientos.site_sections      enable row level security;
alter table wimaliemprendimientos.benefits           enable row level security;
alter table wimaliemprendimientos.business_settings  enable row level security;
alter table wimaliemprendimientos.social_links       enable row level security;
alter table wimaliemprendimientos.media_assets       enable row level security;
alter table wimaliemprendimientos.audit_logs         enable row level security;

-- =====================================================================
-- LECTURA PÚBLICA (anon + authenticated): solo filas activas / públicas
-- =====================================================================
drop policy if exists categories_public_read on wimaliemprendimientos.categories;
create policy categories_public_read on wimaliemprendimientos.categories
  for select using (active = true);

drop policy if exists products_public_read on wimaliemprendimientos.products;
create policy products_public_read on wimaliemprendimientos.products
  for select using (active = true);

drop policy if exists product_images_public_read on wimaliemprendimientos.product_images;
create policy product_images_public_read on wimaliemprendimientos.product_images
  for select using (
    exists (
      select 1 from wimaliemprendimientos.products p
      where p.id = product_images.product_id and p.active = true
    )
  );

drop policy if exists hero_products_public_read on wimaliemprendimientos.hero_products;
create policy hero_products_public_read on wimaliemprendimientos.hero_products
  for select using (
    active = true
    and exists (
      select 1 from wimaliemprendimientos.products p
      where p.id = hero_products.product_id and p.active = true
    )
  );

drop policy if exists site_sections_public_read on wimaliemprendimientos.site_sections;
create policy site_sections_public_read on wimaliemprendimientos.site_sections
  for select using (active = true);

drop policy if exists benefits_public_read on wimaliemprendimientos.benefits;
create policy benefits_public_read on wimaliemprendimientos.benefits
  for select using (active = true);

drop policy if exists business_public_read on wimaliemprendimientos.business_settings;
create policy business_public_read on wimaliemprendimientos.business_settings
  for select using (active = true);

drop policy if exists social_public_read on wimaliemprendimientos.social_links;
create policy social_public_read on wimaliemprendimientos.social_links
  for select using (active = true);

-- =====================================================================
-- ADMINISTRADORES: CRUD completo (usando is_admin())
-- =====================================================================
do $$
declare
  t text;
begin
  foreach t in array array[
    'categories', 'products', 'product_images', 'hero_products',
    'site_sections', 'benefits', 'business_settings', 'social_links',
    'media_assets'
  ]
  loop
    execute format('drop policy if exists %I on wimaliemprendimientos.%I;', t || '_admin_all', t);
    execute format(
      'create policy %I on wimaliemprendimientos.%I
         for all
         using (wimaliemprendimientos.is_admin())
         with check (wimaliemprendimientos.is_admin());',
      t || '_admin_all', t
    );
  end loop;
end $$;

-- media_assets: lectura pública (bucket público) + escritura admin.
drop policy if exists media_public_read on wimaliemprendimientos.media_assets;
create policy media_public_read on wimaliemprendimientos.media_assets
  for select using (true);

-- =====================================================================
-- admin_users: solo administradores pueden ver/gestionar
-- =====================================================================
drop policy if exists admin_users_self_read on wimaliemprendimientos.admin_users;
create policy admin_users_self_read on wimaliemprendimientos.admin_users
  for select using (user_id = auth.uid() or wimaliemprendimientos.is_admin());

drop policy if exists admin_users_admin_all on wimaliemprendimientos.admin_users;
create policy admin_users_admin_all on wimaliemprendimientos.admin_users
  for all
  using (wimaliemprendimientos.is_admin())
  with check (wimaliemprendimientos.is_admin());

-- =====================================================================
-- audit_logs: solo admins leen; inserción por admins
-- =====================================================================
drop policy if exists audit_admin_read on wimaliemprendimientos.audit_logs;
create policy audit_admin_read on wimaliemprendimientos.audit_logs
  for select using (wimaliemprendimientos.is_admin());

drop policy if exists audit_admin_insert on wimaliemprendimientos.audit_logs;
create policy audit_admin_insert on wimaliemprendimientos.audit_logs
  for insert with check (wimaliemprendimientos.is_admin());

-- =====================================================================
-- Auditoría automática (server-side) para operaciones sensibles.
-- =====================================================================
create or replace function wimaliemprendimientos.log_audit()
returns trigger
language plpgsql
security definer
set search_path = wimaliemprendimientos, public
as $$
declare
  v_entity_id text;
begin
  v_entity_id := coalesce(
    (case when tg_op = 'DELETE' then old.id else new.id end)::text, ''
  );

  insert into wimaliemprendimientos.audit_logs (user_id, action, entity, entity_id, old_data, new_data)
  values (
    auth.uid(),
    lower(tg_op),
    tg_table_name,
    v_entity_id,
    case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) else null end,
    case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) else null end
  );

  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array['products', 'categories', 'business_settings', 'site_sections']
  loop
    execute format('drop trigger if exists audit_changes on wimaliemprendimientos.%I;', t);
    execute format(
      'create trigger audit_changes
         after insert or update or delete on wimaliemprendimientos.%I
         for each row execute function wimaliemprendimientos.log_audit();', t
    );
  end loop;
end $$;


-- >>>>>>>>>>>>>>>>>>>>>>>> 0004_storage.sql <<<<<<<<<<<<<<<<<<<<<<<<

-- =====================================================================
-- WIMALI EMPRENDIMIENTOS — 0004: Supabase Storage
-- Bucket público para productos, categorías, hero, negocio y contenido.
-- =====================================================================

-- Crear el bucket (público para lectura de imágenes).
insert into storage.buckets (id, name, public)
values ('wimaliemprendimientos-media', 'wimaliemprendimientos-media', true)
on conflict (id) do update set public = excluded.public;

-- ---------- Políticas de Storage sobre storage.objects ---------------
-- Lectura pública de los objetos del bucket.
drop policy if exists wimali_media_public_read on storage.objects;
create policy wimali_media_public_read on storage.objects
  for select
  using (bucket_id = 'wimaliemprendimientos-media');

-- Subida solo para administradores.
drop policy if exists wimali_media_admin_insert on storage.objects;
create policy wimali_media_admin_insert on storage.objects
  for insert
  with check (
    bucket_id = 'wimaliemprendimientos-media'
    and wimaliemprendimientos.is_admin()
  );

-- Actualización solo para administradores.
drop policy if exists wimali_media_admin_update on storage.objects;
create policy wimali_media_admin_update on storage.objects
  for update
  using (
    bucket_id = 'wimaliemprendimientos-media'
    and wimaliemprendimientos.is_admin()
  )
  with check (
    bucket_id = 'wimaliemprendimientos-media'
    and wimaliemprendimientos.is_admin()
  );

-- Eliminación solo para administradores.
drop policy if exists wimali_media_admin_delete on storage.objects;
create policy wimali_media_admin_delete on storage.objects
  for delete
  using (
    bucket_id = 'wimaliemprendimientos-media'
    and wimaliemprendimientos.is_admin()
  );

-- Estructura de carpetas recomendada dentro del bucket:
--   products/     categories/     hero/     business/     content/
-- (las carpetas se crean solas al subir el primer archivo con ese prefijo)


-- >>>>>>>>>>>>>>>>>>>>>>>> 0005_seed_data.sql <<<<<<<<<<<<<<<<<<<<<<<<

-- =====================================================================
-- WIMALI EMPRENDIMIENTOS — 0005: datos demo (migración de PRODUCTS actual)
-- Idempotente: se puede correr varias veces sin duplicar.
-- =====================================================================

-- ---------- Categorías ------------------------------------------------
insert into wimaliemprendimientos.categories (name, slug, sort_order, active) values
  ('Tecnología', 'tecnologia', 1, true),
  ('Accesorios', 'accesorios', 2, true),
  ('Celulares',  'celulares',  3, true),
  ('Audio',      'audio',      4, true),
  ('Hogar',      'hogar',      5, true),
  ('Belleza',    'belleza',    6, true),
  ('Otros',      'otros',      7, true)
on conflict (slug) do nothing;

-- ---------- Datos del negocio (una config activa) --------------------
insert into wimaliemprendimientos.business_settings (
  business_name, whatsapp_number, phone_display, address, map_query,
  opening_hours, shipping_text, payment_text, seo_title, seo_description, active
)
select
  'WIMALI EMPRENDIMIENTOS',
  '595995364978',
  '+595 995 364 978',
  'Dirección a confirmar · Paraguay',
  '',
  'Lunes a viernes 8:00 – 18:00 · Sábados 8:00 – 13:00',
  'Retiro en local y envíos a todo el país',
  'Efectivo o transferencia',
  'WIMALI Emprendimientos | Tecnología, Accesorios y Más',
  'Encontrá tecnología, accesorios, productos para el hogar, belleza y mucho más en WIMALI. Elegí tus productos y finalizá tu pedido fácilmente por WhatsApp.',
  true
where not exists (select 1 from wimaliemprendimientos.business_settings);

-- ---------- Secciones editables --------------------------------------
insert into wimaliemprendimientos.site_sections (section_key, eyebrow, title, subtitle, button_text, button_url, sort_order, active) values
  ('hero',         'WIMALI EMPRENDIMIENTOS', 'Todo lo que necesitás, en un solo lugar.', 'Tecnología, accesorios, hogar, belleza y mucho más. Encontrá lo que buscás y hacé tu pedido fácilmente por WhatsApp.', 'Ver productos', '#productos', 1, true),
  ('catalog',      'CATÁLOGO', 'Productos destacados', null, null, null, 2, true),
  ('offers',       'PROMOCIONES', 'Ofertas que no podés dejar pasar', 'Precios con descuento por tiempo limitado. Consultá disponibilidad antes de finalizar tu pedido.', null, null, 3, true),
  ('whatsapp_cta', null, '¿Encontraste lo que buscabas?', 'Hacé tu pedido directamente por WhatsApp y te ayudamos a finalizar tu compra.', 'Comprar por WhatsApp', null, 4, true),
  ('about',        'NOSOTROS', 'Sobre WIMALI', 'En WIMALI buscamos acercarte productos útiles, modernos y de calidad en un solo lugar, con una experiencia de compra sencilla y atención personalizada.', null, null, 5, true),
  ('location',     'UBICACIÓN', 'Encontranos', null, null, null, 6, true),
  ('social',       'REDES', 'Seguinos', null, null, null, 7, true),
  ('footer',       null, 'Todo lo que necesitás, en un solo lugar.', null, null, null, 8, true)
on conflict (section_key) do nothing;

-- ---------- Beneficios (Nosotros) ------------------------------------
insert into wimaliemprendimientos.benefits (title, description, icon, sort_order, active) values
  ('Variedad de productos', 'Tecnología, accesorios, hogar y belleza en un mismo catálogo.', 'package', 1, true),
  ('Atención personalizada', 'Te asesoramos por WhatsApp antes y después de tu compra.', 'message-circle', 2, true),
  ('Compra fácil', 'Elegí, agregá al pedido y finalizá en dos toques.', 'shopping-cart', 3, true),
  ('Confianza', 'Precios claros, stock real y ubicación visible.', 'shield-check', 4, true)
on conflict do nothing;

-- ---------- Redes sociales -------------------------------------------
insert into wimaliemprendimientos.social_links (platform, label, url, icon, sort_order, active) values
  ('instagram', 'Instagram', 'https://instagram.com/', 'instagram', 1, true),
  ('facebook',  'Facebook',  'https://facebook.com/',  'facebook',  2, true),
  ('whatsapp',  'WhatsApp',  'https://wa.me/595995364978', 'whatsapp', 3, true)
on conflict do nothing;

-- ---------- Productos (migración de los 16 actuales) -----------------
-- Helper de categoría por slug se resuelve inline en cada INSERT.
insert into wimaliemprendimientos.products
  (category_id, sku, slug, name, short_description, description, price, previous_price, stock, featured, is_new, is_offer, active, sort_order)
values
  ((select id from wimaliemprendimientos.categories where slug='audio'),      'WM-0001', 'microfono-inalambrico-dual',   'Micrófono inalámbrico dual',            'Set de dos micrófonos inalámbricos BYZ K9.', 'Set BYZ K9 de dos micrófonos inalámbricos con receptor USB-C y Lightning. Ideal para creación de contenido, entrevistas y transmisiones en vivo. Incluye estuche de carga.', 320000, 420000, 6, true, false, true, true, 1),
  ((select id from wimaliemprendimientos.categories where slug='audio'),      'WM-0002', 'auricular-bluetooth-tws',      'Auricular Bluetooth TWS',               'Auriculares M10 Bluetooth 5.3 con estuche.', 'Auriculares M10 in-ear con Bluetooth 5.3, estuche de carga con indicador digital y hasta 5 horas de autonomía por carga. Manos libres para llamadas.', 165000, null, 14, true, true, false, true, 2),
  ((select id from wimaliemprendimientos.categories where slug='accesorios'), 'WM-0003', 'cargador-rapido-usb-c-20w',    'Cargador rápido USB-C 20W',             'Cargador de pared PD 20W con cable.', 'Cargador de pared Ecopower EP-7050 con carga rápida PD de 20W y cable USB-C a USB-C incluido. Compatible con celulares Android y iPhone.', 85000, null, 22, true, false, false, true, 3),
  ((select id from wimaliemprendimientos.categories where slug='tecnologia'), 'WM-0004', 'power-bank-12000mah',          'Power bank inalámbrico 12.000 mAh',     'Batería portátil MagSafe 12.000 mAh.', 'Batería portátil Ecopower EP-C852 Smart Charge de 12.000 mAh con carga inalámbrica magnética, soporte plegable y carga rápida. Disponible en blanco y negro.', 210000, 260000, 9, true, false, true, true, 4),
  ((select id from wimaliemprendimientos.categories where slug='tecnologia'), 'WM-0005', 'consola-retro-portatil',       'Consola retro portátil',                'Consola LUO con 400 juegos clásicos.', 'Consola portátil LUO LU-SY04 con pantalla a color y 400 juegos clásicos precargados. Salida de video para TV y cables incluidos.', 295000, null, 5, true, true, false, true, 5),
  ((select id from wimaliemprendimientos.categories where slug='accesorios'), 'WM-0006', 'soporte-celular-escritorio',   'Soporte de celular para escritorio',    'Soporte magnético plegable ajustable.', 'Soporte magnético plegable LUO LU-4011 con ángulo ajustable y anillo metálico adhesivo incluido. Para escritorio, cocina o mesa de luz.', 55000, null, 30, true, false, false, true, 6),
  ((select id from wimaliemprendimientos.categories where slug='tecnologia'), 'WM-0007', 'aro-de-luz-26cm-tripode',      'Aro de luz 26 cm con trípode',          'Aro de luz LED con trípode extensible.', 'Aro de luz LED con tres temperaturas de color, diez niveles de intensidad, trípode extensible y soporte para celular.', 180000, 230000, 7, true, false, true, true, 7),
  ((select id from wimaliemprendimientos.categories where slug='audio'),      'WM-0008', 'microfono-solapero-lavalier',  'Micrófono solapero lavalier',           'Micrófono de solapa con cable 2 m.', 'Micrófono de solapa con cable de 2 metros y adaptador para celular o cámara. Sonido claro para videos y entrevistas.', 75000, null, 18, true, false, false, true, 8),
  ((select id from wimaliemprendimientos.categories where slug='belleza'),    'WM-0009', 'set-brochas-maquillaje',       'Set de brochas de maquillaje x12',      'Set de 12 brochas con estuche.', 'Set de doce brochas de fibra suave con estuche organizador. Para base, polvos, rubor y detalles de ojos.', 95000, 125000, 11, true, false, true, true, 9),
  ((select id from wimaliemprendimientos.categories where slug='hogar'),      'WM-0010', 'organizador-multiuso-hogar',   'Organizador multiuso para hogar',       'Organizador plegable con divisiones.', 'Organizador plegable con divisiones ajustables. Ideal para ropa, accesorios y artículos de escritorio.', 60000, null, 25, true, false, false, true, 10),
  ((select id from wimaliemprendimientos.categories where slug='celulares'),  'WM-0011', 'smartwatch-deportivo',         'Smartwatch deportivo',                  'Reloj inteligente con modos deportivos.', 'Reloj inteligente con medición de pulso, notificaciones, modos deportivos y correa de silicona intercambiable.', 240000, 290000, 8, true, false, true, true, 11),
  ((select id from wimaliemprendimientos.categories where slug='accesorios'), 'WM-0012', 'cable-hdmi-4k-2m',             'Cable HDMI 4K 2 m',                     'Cable HDMI 2.0 4K 60Hz de 2 metros.', 'Cable HDMI 2.0 de dos metros con soporte 4K a 60 Hz. Conectores reforzados.', 45000, null, 0, true, false, false, true, 12),
  ((select id from wimaliemprendimientos.categories where slug='accesorios'), 'WM-0013', 'cargador-con-cable-type-c',    'Cargador con cable Type-C 2.1A',        'Cargador con cable Type-C integrado.', 'Cargador de pared Ecopower EP-7053 con cable Type-C integrado y puerto USB adicional, 2.1A. Carga dos dispositivos a la vez.', 65000, null, 12, true, false, false, true, 13),
  ((select id from wimaliemprendimientos.categories where slug='audio'),      'WM-0014', 'microfono-inalambrico-x-vlog', 'Micrófono inalámbrico X Vlog',          'Kit Audisat X Vlog de 2 micrófonos.', 'Kit Audisat X Vlog de dos micrófonos inalámbricos con estuche de carga con pantalla, receptor USB-C, control táctil y cancelación de ruido.', 350000, null, 6, true, true, false, true, 14),
  ((select id from wimaliemprendimientos.categories where slug='audio'),      'WM-0015', 'auricular-bluetooth-krab',     'Auricular Bluetooth KRAB KBA698',       'Auriculares KRAB Bluetooth 6.0 ENC.', 'Auriculares KRAB KBA698 con Bluetooth 6.0, cancelación de sonido ENC, pantalla táctil y hasta 20 horas de uso con el estuche.', 145000, null, 10, true, false, false, true, 15),
  ((select id from wimaliemprendimientos.categories where slug='belleza'),    'WM-0016', 'torno-de-unas-electrico',      'Torno de uñas eléctrico',               'Torno de uñas recargable profesional.', 'Torno de uñas profesional recargable con base de apoyo, velocidad regulable, fresas intercambiables y cable USB-C. Ideal para manicura y esculpidas.', 185000, null, 7, true, true, false, true, 16)
on conflict (slug) do nothing;

-- ---------- Imágenes de producto (legacy en /public/assets) ----------
-- public_url apunta a los archivos que ya viven en /public/assets/productos.
-- Cuando se suban a Supabase Storage desde el panel, se reemplazan.
insert into wimaliemprendimientos.product_images (product_id, storage_path, public_url, alt_text, is_primary, sort_order)
select p.id, null, img.url, p.name, img.is_primary, img.sort_order
from (values
  ('microfono-inalambrico-dual',   '/assets/productos/microfono-inalambrico-dual.jpg', true, 0),
  ('auricular-bluetooth-tws',      '/assets/productos/auricular-bluetooth-tws.jpg', true, 0),
  ('cargador-rapido-usb-c-20w',    '/assets/productos/cargador-rapido-usb-c-20w.jpg', true, 0),
  ('power-bank-12000mah',          '/assets/productos/power-bank-12000mah.jpg', true, 0),
  ('power-bank-12000mah',          '/assets/productos/power-bank-12000mah-b.jpg', false, 1),
  ('consola-retro-portatil',       '/assets/productos/consola-retro-portatil.jpg', true, 0),
  ('soporte-celular-escritorio',   '/assets/productos/soporte-celular-escritorio.jpg', true, 0),
  ('cargador-con-cable-type-c',    '/assets/productos/cargador-cable-type-c.jpg', true, 0),
  ('microfono-inalambrico-x-vlog', '/assets/productos/microfono-x-vlog.jpg', true, 0),
  ('microfono-inalambrico-x-vlog', '/assets/productos/microfono-x-vlog-b.jpg', false, 1),
  ('auricular-bluetooth-krab',     '/assets/productos/auricular-krab-kba698.jpg', true, 0),
  ('torno-de-unas-electrico',      '/assets/productos/torno-de-unas.jpg', true, 0)
) as img(product_slug, url, is_primary, sort_order)
join wimaliemprendimientos.products p on p.slug = img.product_slug
where not exists (
  select 1 from wimaliemprendimientos.product_images pi
  where pi.product_id = p.id and pi.public_url = img.url
);

-- ---------- Productos flotantes del Hero (máx. 3) --------------------
insert into wimaliemprendimientos.hero_products (product_id, sort_order, active)
select p.id, h.sort_order, true
from (values
  ('auricular-bluetooth-tws', 1),
  ('power-bank-12000mah', 2),
  ('microfono-inalambrico-dual', 3)
) as h(product_slug, sort_order)
join wimaliemprendimientos.products p on p.slug = h.product_slug
on conflict (product_id) do nothing;

