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
