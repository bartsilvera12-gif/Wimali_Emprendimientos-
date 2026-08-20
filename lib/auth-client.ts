'use client'

import { createClient } from '@/lib/supabase/client'
import type { AdminUser } from '@/lib/supabase/types'

// Devuelve el admin activo de la sesión del navegador, o null.
// (Reemplaza al getAdminUser de servidor en el export estático.)
export async function getAdminUserClient(): Promise<AdminUser | null> {
  const supabase = createClient()
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
