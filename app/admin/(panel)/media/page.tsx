import { createClient } from '@/lib/supabase/server'
import { MediaManager } from '@/components/admin/MediaManager'
import type { MediaAsset } from '@/lib/supabase/types'

export const dynamic = 'force-dynamic'

export default async function MediaPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('media_assets').select('*').order('created_at', { ascending: false })

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>Multimedia</h1>
          <p>Biblioteca de imágenes reutilizables.</p>
        </div>
      </div>
      <MediaManager initial={(data as MediaAsset[]) ?? []} />
    </div>
  )
}
