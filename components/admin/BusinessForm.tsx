'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Check } from 'lucide-react'
import { saveBusiness } from '@/lib/actions/misc'
import type { BusinessSettings } from '@/lib/supabase/types'

export function BusinessForm({ business }: { business: BusinessSettings | null }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const b = business

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)
    const r = await saveBusiness(new FormData(e.currentTarget))
    setSaving(false)
    if (r.ok) {
      setSaved(true)
      router.refresh()
      setTimeout(() => setSaved(false), 2500)
    } else setError(r.error || 'No se pudo guardar')
  }

  return (
    <form className="admin-form" onSubmit={onSubmit}>
      {b && <input type="hidden" name="id" value={b.id} />}
      {error && <div className="admin-alert">{error}</div>}

      <div className="admin-form-grid">
        <div className="admin-field">
          <label>Nombre del negocio</label>
          <input name="business_name" defaultValue={b?.business_name ?? ''} required />
        </div>
        <div className="admin-field">
          <label>WhatsApp (solo números, con código país)</label>
          <input name="whatsapp_number" defaultValue={b?.whatsapp_number ?? ''} placeholder="595981234567" required />
        </div>
        <div className="admin-field">
          <label>Teléfono visible</label>
          <input name="phone_display" defaultValue={b?.phone_display ?? ''} placeholder="+595 981 234 567" />
        </div>
        <div className="admin-field">
          <label>Horario de atención</label>
          <input name="opening_hours" defaultValue={b?.opening_hours ?? ''} />
        </div>
        <div className="admin-field admin-field--full">
          <label>Dirección</label>
          <input name="address" defaultValue={b?.address ?? ''} />
        </div>
        <div className="admin-field">
          <label>Búsqueda en el mapa (map_query)</label>
          <input name="map_query" defaultValue={b?.map_query ?? ''} placeholder="WIMALI Emprendimientos, Asunción" />
        </div>
        <div className="admin-field">
          <label>URL de Google Maps</label>
          <input name="google_maps_url" defaultValue={b?.google_maps_url ?? ''} />
        </div>
        <div className="admin-field admin-field--full">
          <label>Texto de envíos</label>
          <input name="shipping_text" defaultValue={b?.shipping_text ?? ''} />
        </div>
        <div className="admin-field admin-field--full">
          <label>Texto de pagos</label>
          <input name="payment_text" defaultValue={b?.payment_text ?? ''} />
        </div>
        <div className="admin-field admin-field--full">
          <label>Título SEO</label>
          <input name="seo_title" defaultValue={b?.seo_title ?? ''} />
        </div>
        <div className="admin-field admin-field--full">
          <label>Descripción SEO</label>
          <textarea name="seo_description" rows={2} defaultValue={b?.seo_description ?? ''} />
        </div>
      </div>

      <div className="admin-form-foot">
        <button type="submit" className="admin-btn admin-btn--gold" disabled={saving}>
          {saving && <Loader2 size={16} className="admin-spin" />}
          {saved && <Check size={16} />}
          {saved ? 'Guardado' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  )
}
