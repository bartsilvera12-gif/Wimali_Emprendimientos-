'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SocialManager } from '@/components/admin/SocialManager'
import type { SocialLink } from '@/lib/supabase/types'

export default function RedesPage() {
  const [rows, setRows] = useState<SocialLink[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    createClient()
      .from('social_links')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        setRows((data as SocialLink[]) ?? [])
        setLoading(false)
      })
  }, [])

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>Redes sociales</h1>
          <p>Enlaces que aparecen en la sección de contacto y el footer.</p>
        </div>
      </div>
      {loading ? <p className="admin-empty">Cargando…</p> : <SocialManager initial={rows} />}
    </div>
  )
}
