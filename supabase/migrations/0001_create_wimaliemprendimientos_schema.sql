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
