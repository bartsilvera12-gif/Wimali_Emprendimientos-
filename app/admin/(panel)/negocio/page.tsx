import { createClient } from '@/lib/supabase/server'
import { BusinessForm } from '@/components/admin/BusinessForm'
import type { BusinessSettings } from '@/lib/supabase/types'

export const dynamic = 'force-dynamic'

export default async function NegocioPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('business_settings').select('*').limit(1).maybeSingle()

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>Negocio</h1>
          <p>Datos de contacto, ubicación y SEO de la tienda.</p>
        </div>
      </div>
      <BusinessForm business={(data as BusinessSettings) ?? null} />
    </div>
  )
}
