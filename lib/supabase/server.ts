import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { DB_SCHEMA } from '@/lib/constants'

// Cliente de Supabase para Server Components / Route Handlers.
// Lee y escribe la sesión desde las cookies de Next.
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: { schema: DB_SCHEMA },
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // Llamado desde un Server Component: el middleware refresca la sesión.
          }
        },
      },
    },
  )
}

// Cliente de solo lectura para datos públicos (sin manejo de sesión), útil en
// componentes de servidor que solo leen catálogo/contenido.
export async function createReadClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: { schema: DB_SCHEMA },
      cookies: { getAll: () => [], setAll: () => {} },
    },
  )
}
