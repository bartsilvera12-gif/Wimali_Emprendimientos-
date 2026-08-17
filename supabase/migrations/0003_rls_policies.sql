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
