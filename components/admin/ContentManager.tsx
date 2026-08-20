'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Check, Plus, Pencil } from 'lucide-react'
import { saveSection, saveBenefit, deleteBenefit } from '@/lib/mutations'
import { DeleteButton } from './RowActions'
import type { SiteSection, Benefit } from '@/lib/supabase/types'

function SectionCard({ section }: { section: SiteSection }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    const r = await saveSection(new FormData(e.currentTarget))
    setSaving(false)
    if (r.ok) {
      setSaved(true)
      router.refresh()
      setTimeout(() => setSaved(false), 2000)
    } else alert(r.error || 'No se pudo guardar')
  }

  return (
    <form className="admin-form admin-section-card" onSubmit={onSubmit}>
      <input type="hidden" name="id" value={section.id} />
      <h3 className="admin-section-key">{section.section_key}</h3>
      <div className="admin-form-grid">
        <div className="admin-field">
          <label>Eyebrow</label>
          <input name="eyebrow" defaultValue={section.eyebrow ?? ''} />
        </div>
        <div className="admin-field">
          <label>Título</label>
          <input name="title" defaultValue={section.title ?? ''} />
        </div>
        <div className="admin-field admin-field--full">
          <label>Subtítulo</label>
          <input name="subtitle" defaultValue={section.subtitle ?? ''} />
        </div>
        <div className="admin-field admin-field--full">
          <label>Texto</label>
          <textarea name="body" rows={2} defaultValue={section.body ?? ''} />
        </div>
        <div className="admin-field">
          <label>Texto del botón</label>
          <input name="button_text" defaultValue={section.button_text ?? ''} />
        </div>
        <div className="admin-field">
          <label>URL del botón</label>
          <input name="button_url" defaultValue={section.button_url ?? ''} />
        </div>
      </div>
      <div className="admin-form-foot">
        <button type="submit" className="admin-btn admin-btn--gold" disabled={saving}>
          {saving && <Loader2 size={16} className="admin-spin" />}
          {saved && <Check size={16} />}
          {saved ? 'Guardado' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}

function BenefitForm({ benefit, onDone }: { benefit?: Benefit; onDone: () => void }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    const r = await saveBenefit(new FormData(e.currentTarget))
    setSaving(false)
    if (r.ok) {
      onDone()
      router.refresh()
    } else alert(r.error || 'No se pudo guardar')
  }

  return (
    <form className="admin-form" onSubmit={onSubmit}>
      {benefit && <input type="hidden" name="id" value={benefit.id} />}
      <div className="admin-form-grid">
        <div className="admin-field">
          <label>Título *</label>
          <input name="title" defaultValue={benefit?.title ?? ''} required />
        </div>
        <div className="admin-field">
          <label>Icono (lucide, ej: truck)</label>
          <input name="icon" defaultValue={benefit?.icon ?? ''} />
        </div>
        <div className="admin-field admin-field--full">
          <label>Descripción</label>
          <input name="description" defaultValue={benefit?.description ?? ''} />
        </div>
        <div className="admin-field">
          <label>Orden</label>
          <input name="sort_order" type="number" defaultValue={benefit?.sort_order ?? 0} />
        </div>
      </div>
      <div className="admin-checks">
        <label className="admin-check">
          <input type="checkbox" name="active" defaultChecked={benefit ? benefit.active : true} /> Activo
        </label>
      </div>
      <div className="admin-form-foot">
        <button type="button" className="admin-btn admin-btn--ghost" onClick={onDone}>
          Cancelar
        </button>
        <button type="submit" className="admin-btn admin-btn--gold" disabled={saving}>
          {saving && <Loader2 size={16} className="admin-spin" />}
          Guardar
        </button>
      </div>
    </form>
  )
}

export function ContentManager({ sections, benefits }: { sections: SiteSection[]; benefits: Benefit[] }) {
  const [benefitEdit, setBenefitEdit] = useState<Benefit | 'new' | null>(null)

  return (
    <div className="admin-content">
      <section>
        <h2 className="admin-subtitle">Secciones de la página</h2>
        <div className="admin-sections">
          {sections.length ? (
            sections.map((s) => <SectionCard key={s.id} section={s} />)
          ) : (
            <p className="admin-empty">No hay secciones configuradas.</p>
          )}
        </div>
      </section>

      <section>
        <div className="admin-page-head">
          <h2 className="admin-subtitle">Beneficios / ventajas</h2>
          {!benefitEdit && (
            <button className="admin-btn admin-btn--gold" onClick={() => setBenefitEdit('new')}>
              <Plus size={18} /> Nuevo
            </button>
          )}
        </div>

        {benefitEdit ? (
          <BenefitForm
            benefit={benefitEdit === 'new' ? undefined : benefitEdit}
            onDone={() => setBenefitEdit(null)}
          />
        ) : benefits.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Descripción</th>
                  <th>Icono</th>
                  <th>Activo</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {benefits.map((b) => (
                  <tr key={b.id}>
                    <td className="admin-cell-title">{b.title}</td>
                    <td className="admin-cell-sub">{b.description ?? '—'}</td>
                    <td>{b.icon ?? '—'}</td>
                    <td>
                      <span className={`admin-pill ${b.active ? 'admin-pill--ok' : 'admin-pill--off'}`}>
                        {b.active ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        <button className="admin-icon-btn" title="Editar" onClick={() => setBenefitEdit(b)}>
                          <Pencil size={16} />
                        </button>
                        <DeleteButton action={deleteBenefit.bind(null, b.id)} message={`¿Eliminar "${b.title}"?`} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="admin-empty">No hay beneficios cargados.</p>
        )}
      </section>
    </div>
  )
}
