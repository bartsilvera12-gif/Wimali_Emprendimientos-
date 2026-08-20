'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MediaManager } from '@/components/admin/MediaManager'
import type { MediaAsset } from '@/lib/supabase/types'

export default function MediaPage() {
  const [rows, setRows] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    createClient()
      .from('media_assets')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setRows((data as MediaAsset[]) ?? [])
        setLoading(false)
      })
  }, [])

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>Multimedia</h1>
          <p>Biblioteca de imágenes reutilizables.</p>
        </div>
      </div>
      {loading ? <p className="admin-empty">Cargando…</p> : <MediaManager initial={rows} />}
    </div>
  )
}
