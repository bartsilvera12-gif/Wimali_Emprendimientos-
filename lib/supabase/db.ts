import { createClient as createSbClient, type SupabaseClient } from '@supabase/supabase-js'
import { DB_SCHEMA } from '@/lib/constants'

// Cliente universal (navegador y build) con la anon key (pública) sobre el
// schema propio. Se usa para TODAS las lecturas públicas del catálogo.
// Sin sesión: solo lee filas permitidas por RLS (públicas / activas).
let _client: SupabaseClient<any, any, any> | null = null

export function db(): SupabaseClient<any, any, any> {
  if (!_client) {
    _client = createSbClient<any, any, any>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { db: { schema: DB_SCHEMA }, auth: { persistSession: false } },
    )
  }
  return _client
}
