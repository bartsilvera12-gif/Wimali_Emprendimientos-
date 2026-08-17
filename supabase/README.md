# Supabase — WIMALI Emprendimientos

Toda la base de datos del proyecto vive en el schema **`wimaliemprendimientos`**
(ninguna tabla propia se crea en `public`). Supabase usa además sus schemas
internos `auth` y `storage`.

## 1. Ejecutar las migraciones

Corré los archivos de `supabase/migrations/` **en orden** contra tu base:

| Orden | Archivo | Qué hace |
|-------|---------|----------|
| 1 | `0001_create_wimaliemprendimientos_schema.sql` | Crea el schema + helpers + grants base |
| 2 | `0002_create_tables.sql` | Todas las tablas con constraints e índices |
| 3 | `0003_rls_policies.sql` | `is_admin()`, RLS y auditoría automática |
| 4 | `0004_storage.sql` | Bucket `wimaliemprendimientos-media` + políticas |
| 5 | `0005_seed_data.sql` | Categorías, negocio, secciones y 16 productos demo |

**Opción A — SQL Editor (Supabase Studio):** pegá y ejecutá cada archivo, en orden.

**Opción B — CLI de Supabase:**
```bash
supabase db push
# o, contra una URL directa de Postgres:
psql "$DATABASE_URL" -f supabase/migrations/0001_create_wimaliemprendimientos_schema.sql
# ...y así con cada archivo en orden.
```

## 2. ⚠️ Exponer el schema a la API (paso obligatorio)

Como las tablas **no** están en `public`, hay que exponer el schema o la API
no las verá:

- **Supabase Cloud:** Dashboard → *Project Settings* → *API* →
  **Exposed schemas** → agregar `wimaliemprendimientos`.
- **Self-hosted (`api.neura.com.py`):** en la config de PostgREST,
  `PGRST_DB_SCHEMAS = "public,storage,wimaliemprendimientos"` y reiniciar.

En el frontend siempre se consulta con:
```ts
supabase.schema('wimaliemprendimientos').from('products')
```

## 3. Crear el primer administrador

Las contraseñas las maneja **Supabase Auth**; nunca se guardan en tablas propias.

1. **Crear el usuario en Auth**: Dashboard → *Authentication* → *Users* →
   *Add user* → email + contraseña (ej. `admin@wimaliemprendimientos.com`).
   *(No habilitar registro público — el panel no tiene "Crear cuenta".)*
2. **Copiar el UUID** del usuario recién creado.
3. **Autorizarlo** en `admin_users`:

```sql
insert into wimaliemprendimientos.admin_users (user_id, email, full_name, role, active)
values (
  '2a231b14-9017-445e-943e-2f3705fc226e',  -- UUID del usuario de Auth
  'admin@wimaliemprendimientos.com',
  'Administrador WIMALI',
  'super_admin',
  true
)
on conflict (user_id) do update
  set active = true, role = excluded.role;
```

Solo los usuarios activos en `admin_users` pasan `is_admin()` y pueden hacer CRUD.

## 4. Storage

El bucket **`wimaliemprendimientos-media`** (público para lectura) se crea en la
migración `0004`. Estructura recomendada de carpetas:

```
products/   categories/   hero/   business/   content/
```

Subida/edición/borrado solo para administradores (política vía `is_admin()`).
No se guardan imágenes en base64: en la base solo van `storage_path` y `public_url`.

## 5. Variables de entorno

Copiá `.env.example` → `.env.local` y completá:

```env
NEXT_PUBLIC_SUPABASE_URL=https://api.neura.com.py
NEXT_PUBLIC_SUPABASE_ANON_KEY=<tu anon key>
NEXT_PUBLIC_SUPABASE_SCHEMA=wimaliemprendimientos
```

> La **service_role key** nunca va en el frontend ni en el repo. Si se filtró,
> rotala desde *Project Settings → API → Regenerate*.
