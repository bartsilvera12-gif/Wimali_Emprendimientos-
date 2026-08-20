'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { BusinessForm } from '@/components/admin/BusinessForm'
import type { BusinessSettings } from '@/lib/supabase/types'

export default function NegocioPage() {
  const [business, setBusiness] = useState<BusinessSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    createClient()
      .from('business_settings')
      .select('*')
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        setBusiness((data as BusinessSettings) ?? null)
        setLoading(false)
      })
  }, [])

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>Negocio</h1>
          <p>Datos de contacto, ubicación y SEO de la tienda.</p>
        </div>
      </div>
      {loading ? <p className="admin-empty">Cargando…</p> : <BusinessForm business={business} />}
    </div>
  )
}
