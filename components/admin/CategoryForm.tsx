'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Upload, X } from 'lucide-react'
import { saveCategory } from '@/lib/actions/categories'
import { uploadToStorage } from '@/lib/upload'
import { slugify } from '@/lib/format'
import type { Category } from '@/lib/supabase/types'

export function CategoryForm({ category }: { category?: Category }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [slugTouched, setSlugTouched] = useState(!!category)
  const [name, setName] = useState(category?.name ?? '')
  const [slug, setSlug] = useState(category?.slug ?? '')
  const [img, setImg] = useState<{ url: string; path: string } | null>(
    category?.image_url ? { url: category.image_url, path: category.image_path ?? '' } : null,
  )

  const onName = (v: string) => {
    setName(v)
    if (!slugTouched) setSlug(slugify(v))
  }

  const onPick = async (files: FileList | null) => {
    if (!files || !files[0]) return
    setUploading(true)
    setError('')
    try {
      const up = await uploadToStorage(files[0], 'categorias')
      setImg({ url: up.url, path: up.path })
    } catch (e) {
      setError('Error subiendo imagen: ' + (e as Error).message)
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const fd = new FormData(e.currentTarget)
    fd.set('image_url', img?.url ?? '')
    fd.set('image_path', img?.path ?? '')
    const r = await saveCategory(fd)
    if (r.ok) {
      router.push('/admin/categorias')
      router.refresh()
    } else {
      setError(r.error || 'No se pudo guardar')
      setSaving(false)
    }
  }

  return (
    <form className="admin-form" onSubmit={onSubmit}>
      {category && <input type="hidden" name="id" value={category.id} />}
      {error && <div className="admin-alert">{error}</div>}

      <div className="admin-form-grid">
        <div className="admin-field">
          <label>Nombre *</label>
          <input name="name" value={name} onChange={(e) => onName(e.target.value)} required />
        </div>
        <div className="admin-field">
          <label>Slug (URL)</label>
          <input
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value)
              setSlugTouched(true)
            }}
          />
        </div>
        <div className="admin-field admin-field--full">
          <label>Descripción</label>
          <textarea name="description" rows={3} defaultValue={category?.description ?? ''} />
        </div>
        <div className="admin-field">
          <label>Orden</label>
          <input name="sort_order" type="number" defaultValue={category?.sort_order ?? 0} />
        </div>
      </div>

      <div className="admin-images">
        <label className="admin-images-label">Imagen de la categoría</label>
        <div className="admin-thumbs">
          {img && (
            <div className="admin-thumb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" />
              <div className="admin-thumb-tools">
                <button type="button" title="Quitar" onClick={() => setImg(null)}>
                  <X size={14} />
                </button>
              </div>
            </div>
          )}
          {!img && (
            <label className="admin-thumb admin-thumb--add">
              {uploading ? <Loader2 size={20} className="admin-spin" /> : <Upload size={20} />}
              <span>{uploading ? 'Subiendo…' : 'Subir'}</span>
              <input type="file" accept="image/*" hidden onChange={(e) => onPick(e.target.files)} />
            </label>
          )}
        </div>
      </div>

      <div className="admin-checks">
        <label className="admin-check">
          <input type="checkbox" name="active" defaultChecked={category ? category.active : true} /> Activa
        </label>
      </div>

      <div className="admin-form-foot">
        <button type="button" className="admin-btn admin-btn--ghost" onClick={() => router.push('/admin/categorias')}>
          Cancelar
        </button>
        <button type="submit" className="admin-btn admin-btn--gold" disabled={saving || uploading}>
          {saving && <Loader2 size={16} className="admin-spin" />}
          {category ? 'Guardar cambios' : 'Crear categoría'}
        </button>
      </div>
    </form>
  )
}
