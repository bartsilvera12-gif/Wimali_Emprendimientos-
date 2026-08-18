import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatPYG } from '@/lib/format'
import { DeleteButton, ToggleActive } from '@/components/admin/RowActions'
import { deleteProduct, toggleProductActive } from '@/lib/actions/products'
import type { Category, Product, ProductImage } from '@/lib/supabase/types'

export const dynamic = 'force-dynamic'

export default async function ProductosPage() {
  const supabase = await createClient()
  const [{ data: prods }, { data: cats }, { data: imgs }] = await Promise.all([
    supabase.from('products').select('*').order('sort_order').order('created_at', { ascending: false }),
    supabase.from('categories').select('id,name'),
    supabase.from('product_images').select('product_id,public_url,is_primary'),
  ])
  const allProducts = (prods as Product[]) ?? []
  const catMap = new Map((((cats as Category[]) ?? [])).map((c) => [c.id, c.name]))
  const imgList = (imgs as Pick<ProductImage, 'product_id' | 'public_url' | 'is_primary'>[]) ?? []
  const withImage = new Set(imgList.map((i) => i.product_id))
  const imgFor = (pid: string) => {
    const list = imgList.filter((i) => i.product_id === pid)
    return (list.find((i) => i.is_primary) ?? list[0])?.public_url ?? null
  }
  // Solo los productos que aparecen en la web (los que tienen imagen).
  const products = allProducts.filter((p) => withImage.has(p.id))

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>Productos</h1>
          <p>
            {products.length} productos en la web
            {allProducts.length > products.length
              ? ` · ${allProducts.length - products.length} ocultos (sin imagen)`
              : ''}
          </p>
        </div>
        <Link href="/admin/productos/nuevo" className="admin-btn admin-btn--gold">
          <Plus size={18} /> Nuevo producto
        </Link>
      </div>

      {products.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Activo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const src = imgFor(p.id)
                return (
                  <tr key={p.id}>
                    <td>
                      <div className="admin-cell-img">
                        {src ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={src} alt="" />
                        ) : (
                          <span className="admin-cell-img--empty" />
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="admin-cell-title">{p.name}</div>
                      <div className="admin-cell-sub">{p.sku ?? '—'}</div>
                    </td>
                    <td>{p.category_id ? catMap.get(p.category_id) ?? '—' : '—'}</td>
                    <td>
                      {formatPYG(p.price)}
                      {p.previous_price ? <div className="admin-cell-sub admin-strike">{formatPYG(p.previous_price)}</div> : null}
                    </td>
                    <td>
                      <span className={`admin-pill ${p.stock <= 0 ? 'admin-pill--off' : p.stock <= 6 ? 'admin-pill--warn' : 'admin-pill--ok'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td>
                      <ToggleActive active={p.active} action={toggleProductActive.bind(null, p.id)} />
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        <Link href={`/admin/productos/${p.id}`} className="admin-icon-btn" title="Editar">
                          <Pencil size={16} />
                        </Link>
                        <DeleteButton action={deleteProduct.bind(null, p.id)} message={`¿Eliminar "${p.name}"?`} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="admin-empty">Todavía no hay productos. Creá el primero.</p>
      )}
    </div>
  )
}
