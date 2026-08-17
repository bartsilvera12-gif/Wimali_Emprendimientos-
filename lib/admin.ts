import { createClient } from '@/lib/supabase/server'
import type { AdminUser } from '@/lib/supabase/types'

// Devuelve el admin activo asociado a la sesión actual, o null.
// Requiere que el schema `wimaliemprendimientos` esté expuesto a la API.
export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('admin_users')
    .select('*')
    .eq('user_id', user.id)
    .eq('active', true)
    .maybeSingle()

  return (data as AdminUser) ?? null
}
