import { createClient } from '@/lib/supabase/server'
import { ContentManager } from '@/components/admin/ContentManager'
import type { SiteSection, Benefit } from '@/lib/supabase/types'

export const dynamic = 'force-dynamic'

export default async function ContenidoPage() {
  const supabase = await createClient()
  const [{ data: secs }, { data: bens }] = await Promise.all([
    supabase.from('site_sections').select('*').order('sort_order'),
    supabase.from('benefits').select('*').order('sort_order'),
  ])

  // Secciones que ya no se muestran en la web (ocultas del editor).
  const HIDDEN_SECTIONS = ['catalog']
  const sections = ((secs as SiteSection[]) ?? []).filter(
    (s) => !HIDDEN_SECTIONS.includes(s.section_key),
  )

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>Contenido</h1>
          <p>Textos de las secciones y beneficios de la tienda.</p>
        </div>
      </div>
      <ContentManager sections={sections} benefits={(bens as Benefit[]) ?? []} />
    </div>
  )
}
