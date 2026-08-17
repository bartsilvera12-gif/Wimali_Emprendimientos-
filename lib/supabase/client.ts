'use client'

import { createBrowserClient } from '@supabase/ssr'
import { DB_SCHEMA } from '@/lib/constants'

// Cliente de Supabase para el navegador. Usa la anon key (pública) y consulta
// por defecto el schema propio del proyecto.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { db: { schema: DB_SCHEMA } },
  )
}
