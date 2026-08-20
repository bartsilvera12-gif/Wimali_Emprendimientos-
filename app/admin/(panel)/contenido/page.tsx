'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ContentManager } from '@/components/admin/ContentManager'
import type { SiteSection, Benefit } from '@/lib/supabase/types'

const HIDDEN_SECTIONS = ['catalog']

export default function ContenidoPage() {
  const [sections, setSections] = useState<SiteSection[]>([])
  const [benefits, setBenefits] = useState<Benefit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    ;(async () => {
      const [{ data: secs }, { data: bens }] = await Promise.all([
        supabase.from('site_sections').select('*').order('sort_order'),
        supabase.from('benefits').select('*').order('sort_order'),
      ])
      setSections(
        ((secs as SiteSection[]) ?? []).filter((s) => !HIDDEN_SECTIONS.includes(s.section_key)),
      )
      setBenefits((bens as Benefit[]) ?? [])
      setLoading(false)
    })()
  }, [])

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>Contenido</h1>
          <p>Textos de las secciones y beneficios de la tienda.</p>
        </div>
      </div>
      {loading ? <p className="admin-empty">Cargando…</p> : <ContentManager sections={sections} benefits={benefits} />}
    </div>
  )
}
