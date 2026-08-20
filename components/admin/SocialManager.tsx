'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, Pencil } from 'lucide-react'
import { saveSocial, deleteSocial, toggleSocialActive } from '@/lib/mutations'
import { DeleteButton, ToggleActive } from './RowActions'
import type { SocialLink } from '@/lib/supabase/types'

const PLATFORMS = ['instagram', 'facebook', 'whatsapp', 'tiktok', 'youtube', 'x', 'otro']

export function SocialManager({ initial }: { initial: SocialLink[] }) {
  const router = useRouter()
  const [editing, setEditing] = useState<SocialLink | 'new' | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const r = await saveSocial(new FormData(e.currentTarget))
    setSaving(false)
    if (r.ok) {
      setEditing(null)
      router.refresh()
    } else setError(r.error || 'No se pudo guardar')
  }

  const cur = editing === 'new' ? undefined : editing || undefined

  return (
    <div>
      {editing ? (
        <form className="admin-form" onSubmit={onSubmit}>
          {cur && <input type="hidden" name="id" value={cur.id} />}
          {error && <div className="admin-alert">{error}</div>}
          <div className="admin-form-grid">
            <div className="admin-field">
              <label>Plataforma *</label>
              <select name="platform" defaultValue={cur?.platform ?? 'instagram'}>
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label>Etiqueta</label>
              <input name="label" defaultValue={cur?.label ?? ''} placeholder="@wimali" />
            </div>
            <div className="admin-field admin-field--full">
              <label>URL *</label>
              <input name="url" defaultValue={cur?.url ?? ''} placeholder="https://instagram.com/…" required />
            </div>
            <div className="admin-field">
              <label>Orden</label>
              <input name="sort_order" type="number" defaultValue={cur?.sort_order ?? 0} />
            </div>
          </div>
          <div className="admin-checks">
            <label className="admin-check">
              <input type="checkbox" name="active" defaultChecked={cur ? cur.active : true} /> Activa
            </label>
          </div>
          <div className="admin-form-foot">
            <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setEditing(null)}>
              Cancelar
            </button>
            <button type="submit" className="admin-btn admin-btn--gold" disabled={saving}>
              {saving && <Loader2 size={16} className="admin-spin" />}
              Guardar
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="admin-page-head">
            <div />
            <button className="admin-btn admin-btn--gold" onClick={() => setEditing('new')}>
              <Plus size={18} /> Nueva red
            </button>
          </div>
          {initial.length ? (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Plataforma</th>
                    <th>Etiqueta</th>
                    <th>URL</th>
                    <th>Activa</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {initial.map((s) => (
                    <tr key={s.id}>
                      <td className="admin-cell-title" style={{ textTransform: 'capitalize' }}>
                        {s.platform}
                      </td>
                      <td>{s.label ?? '—'}</td>
                      <td className="admin-cell-sub" style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {s.url}
                      </td>
                      <td>
                        <ToggleActive active={s.active} action={toggleSocialActive.bind(null, s.id)} />
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          <button className="admin-icon-btn" title="Editar" onClick={() => setEditing(s)}>
                            <Pencil size={16} />
                          </button>
                          <DeleteButton action={deleteSocial.bind(null, s.id)} message={`¿Eliminar ${s.platform}?`} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="admin-empty">Todavía no hay redes cargadas.</p>
          )}
        </>
      )}
    </div>
  )
}
