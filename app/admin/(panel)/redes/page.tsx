import { createClient } from '@/lib/supabase/server'
import { SocialManager } from '@/components/admin/SocialManager'
import type { SocialLink } from '@/lib/supabase/types'

export const dynamic = 'force-dynamic'

export default async function RedesPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('social_links').select('*').order('sort_order')

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>Redes sociales</h1>
          <p>Enlaces que aparecen en la sección de contacto y el footer.</p>
        </div>
      </div>
      <SocialManager initial={(data as SocialLink[]) ?? []} />
    </div>
  )
}
