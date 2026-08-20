'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Upload, Star, Trash2, X } from 'lucide-react'
import { saveProduct, deleteProductImage, setPrimaryImage } from '@/lib/mutations'
import { uploadToStorage } from '@/lib/upload'
import { slugify } from '@/lib/format'
import type { Category, Product, ProductImage } from '@/lib/supabase/types'

interface Props {
  product?: Product
  images?: ProductImage[]
  categories: Category[]
}

export function ProductForm({ product, images = [], categories }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [slugTouched, setSlugTouched] = useState(!!product)
  const [name, setName] = useState(product?.name ?? '')
  const [slug, setSlug] = useState(product?.slug ?? '')
  const [existing, setExisting] = useState<ProductImage[]>(images)
  const [uploads, setUploads] = useState<{ path: string; url: string }[]>([])
  const [uploading, setUploading] = useState(false)

  const onName = (v: string) => {
    setName(v)
    if (!slugTouched) setSlug(slugify(v))
  }

  const onPickFiles = async (files: FileList | null) => {
    if (!files || !files.length) return
    setUploading(true)
    setError('')
    try {
      const done: { path: string; url: string }[] = []
      for (const f of Array.from(files)) {
        const up = await uploadToStorage(f, 'productos')
        done.push({ path: up.path, url: up.url })
      }
      setUploads((u) => [...u, ...done])
    } catch (e) {
      setError('Error subiendo imagen: ' + (e as Error).message)
    } finally {
      setUploading(false)
    }
  }

  const removeUpload = (i: number) => setUploads((u) => u.filter((_, idx) => idx !== i))

  const onDeleteExisting = async (img: ProductImage) => {
    if (!confirm('¿Eliminar esta imagen?')) return
    const r = await deleteProductImage(img.id)
    if (r.ok) setExisting((e) => e.filter((x) => x.id !== img.id))
    else setError(r.error || 'No se pudo eliminar')
  }

  const onSetPrimary = async (img: ProductImage) => {
    if (!product) return
    const r = await setPrimaryImage(product.id, img.id)
    if (r.ok) setExisting((e) => e.map((x) => ({ ...x, is_primary: x.id === img.id })))
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const fd = new FormData(e.currentTarget)
    fd.set('new_images', JSON.stringify(uploads))
    const r = await saveProduct(fd)
    if (r.ok) {
      router.push('/admin/productos')
      router.refresh()
    } else {
      setError(r.error || 'No se pudo guardar')
      setSaving(false)
    }
  }

  return (
    <form className="admin-form" onSubmit={onSubmit}>
      {product && <input type="hidden" name="id" value={product.id} />}
      {/* "Nuevo" y "SKU" están ocultos del formulario; se conserva su valor actual */}
      <input type="hidden" name="is_new" value={product?.is_new ? 'true' : 'false'} />
      <input type="hidden" name="sku" value={product?.sku ?? ''} />
      {error && <div className="admin-alert">{error}</div>}

      <div className="admin-form-grid">
        <div className="admin-field admin-field--full">
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
        <div className="admin-field">
          <label>Categoría</label>
          <select name="category_id" defaultValue={product?.category_id ?? ''}>
            <option value="">Sin categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="admin-field">
          <label>Orden</label>
          <input name="sort_order" type="number" defaultValue={product?.sort_order ?? 0} />
        </div>

        <div className="admin-field">
          <label>Precio (Gs.) *</label>
          <input name="price" type="number" step="1" defaultValue={product?.price ?? ''} required />
        </div>
        <div className="admin-field">
          <label>Precio anterior (Gs.)</label>
          <input name="previous_price" type="number" step="1" defaultValue={product?.previous_price ?? ''} />
        </div>

        <div className="admin-field">
          <label>Stock</label>
          <input name="stock" type="number" step="1" defaultValue={product?.stock ?? 0} />
        </div>
        <div className="admin-field" />

        <div className="admin-field admin-field--full">
          <label>Descripción corta</label>
          <input name="short_description" defaultValue={product?.short_description ?? ''} />
        </div>
        <div className="admin-field admin-field--full">
          <label>Descripción</label>
          <textarea name="description" rows={4} defaultValue={product?.description ?? ''} />
        </div>
      </div>

      <div className="admin-checks">
        <label className="admin-check">
          <input type="checkbox" name="active" defaultChecked={product ? product.active : true} /> Activo
        </label>
        <label className="admin-check">
          <input type="checkbox" name="featured" defaultChecked={product?.featured ?? false} /> Destacado
        </label>
        <label className="admin-check">
          <input type="checkbox" name="is_offer" defaultChecked={product?.is_offer ?? false} /> En oferta
        </label>
      </div>

      <div className="admin-images">
        <label className="admin-images-label">Imágenes</label>
        <div className="admin-thumbs">
          {existing.map((img) => (
            <div className={`admin-thumb ${img.is_primary ? 'is-primary' : ''}`} key={img.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.public_url} alt="" />
              <div className="admin-thumb-tools">
                <button type="button" title="Principal" onClick={() => onSetPrimary(img)}>
                  <Star size={14} fill={img.is_primary ? 'currentColor' : 'none'} />
                </button>
                <button type="button" title="Eliminar" onClick={() => onDeleteExisting(img)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {uploads.map((u, i) => (
            <div className="admin-thumb" key={u.path}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u.url} alt="" />
              <div className="admin-thumb-tools">
                <button type="button" title="Quitar" onClick={() => removeUpload(i)}>
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
          <label className="admin-thumb admin-thumb--add">
            {uploading ? <Loader2 size={20} className="admin-spin" /> : <Upload size={20} />}
            <span>{uploading ? 'Subiendo…' : 'Subir'}</span>
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => onPickFiles(e.target.files)}
            />
          </label>
        </div>
      </div>

      <div className="admin-form-foot">
        <button type="button" className="admin-btn admin-btn--ghost" onClick={() => router.push('/admin/productos')}>
          Cancelar
        </button>
        <button type="submit" className="admin-btn admin-btn--gold" disabled={saving || uploading}>
          {saving && <Loader2 size={16} className="admin-spin" />}
          {product ? 'Guardar cambios' : 'Crear producto'}
        </button>
      </div>
    </form>
  )
}
