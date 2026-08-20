'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { DeleteButton, ToggleActive } from '@/components/admin/RowActions'
import { deleteCategory, toggleCategoryActive } from '@/lib/mutations'
import type { Category, Product } from '@/lib/supabase/types'

export default function CategoriasPage() {
  const [allCategories, setAllCategories] = useState<Category[]>([])
  const [counts, setCounts] = useState<Map<string, number>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    ;(async () => {
      const [{ data: cats }, { data: prods }, { data: imgs }] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('products').select('id,category_id'),
        supabase.from('product_images').select('product_id'),
      ])
      setAllCategories((cats as Category[]) ?? [])
      const withImage = new Set(((imgs as { product_id: string }[]) ?? []).map((i) => i.product_id))
      const m = new Map<string, number>()
      for (const p of ((prods as Pick<Product, 'id' | 'category_id'>[]) ?? [])) {
        if (p.category_id && withImage.has(p.id)) m.set(p.category_id, (m.get(p.category_id) ?? 0) + 1)
      }
      setCounts(m)
      setLoading(false)
    })()
  }, [])

  const categories = allCategories.filter((c) => !!c.image_url || !!c.image_path)

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>Categorías</h1>
          <p>
            {categories.length} categorías en la web
            {allCategories.length > categories.length
              ? ` · ${allCategories.length - categories.length} ocultas (sin imagen)`
              : ''}
          </p>
        </div>
        <Link href="/admin/categorias/nuevo" className="admin-btn admin-btn--gold">
          <Plus size={18} /> Nueva categoría
        </Link>
      </div>

      {loading ? (
        <p className="admin-empty">Cargando…</p>
      ) : categories.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Nombre</th>
                <th>Productos</th>
                <th>Orden</th>
                <th>Activa</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="admin-cell-img">
                      {c.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.image_url} alt="" />
                      ) : (
                        <span className="admin-cell-img--empty" />
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="admin-cell-title">{c.name}</div>
                    <div className="admin-cell-sub">/{c.slug}</div>
                  </td>
                  <td>{counts.get(c.id) ?? 0}</td>
                  <td>{c.sort_order}</td>
                  <td>
                    <ToggleActive active={c.active} action={toggleCategoryActive.bind(null, c.id)} />
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <Link href={`/admin/categorias/editar?id=${c.id}`} className="admin-icon-btn" title="Editar">
                        <Pencil size={16} />
                      </Link>
                      <DeleteButton
                        action={deleteCategory.bind(null, c.id)}
                        message={`¿Eliminar "${c.name}"? Los productos quedarán sin categoría.`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="admin-empty">Todavía no hay categorías.</p>
      )}
    </div>
  )
}
