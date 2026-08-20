'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, Tags, Percent, AlertTriangle, PackageX, Plus, Store } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatPYG } from '@/lib/format'
import { LOW_STOCK_THRESHOLD } from '@/lib/constants'
import type { Product } from '@/lib/supabase/types'

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [categoriesCount, setCategoriesCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    ;(async () => {
      const [{ data }, { data: imgs }, { count }] = await Promise.all([
        supabase
          .from('products')
          .select('id,name,sku,price,stock,active,is_offer,previous_price,created_at')
          .order('created_at', { ascending: false }),
        supabase.from('product_images').select('product_id'),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
      ])
      const withImage = new Set(((imgs as { product_id: string }[]) ?? []).map((i) => i.product_id))
      setProducts(((data as Product[]) ?? []).filter((p) => withImage.has(p.id)))
      setCategoriesCount(count ?? 0)
      setLoading(false)
    })()
  }, [])

  const activos = products.filter((p) => p.active)
  const ofertas = products.filter(
    (p) => p.is_offer && p.active && p.stock > 0 && p.previous_price && p.previous_price > p.price,
  )
  const sinStock = products.filter((p) => p.stock <= 0)
  const bajoStock = products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD)

  const cards = [
    { label: 'Productos en la web', value: products.length, icon: Package },
    { label: 'Productos activos', value: activos.length, icon: Package },
    { label: 'Categorías', value: categoriesCount, icon: Tags },
    { label: 'Ofertas activas', value: ofertas.length, icon: Percent },
    { label: 'Sin stock', value: sinStock.length, icon: PackageX },
    { label: 'Bajo stock', value: bajoStock.length, icon: AlertTriangle },
  ]

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>Dashboard</h1>
          <p>Resumen de tu tienda.</p>
        </div>
      </div>

      <div className="admin-cards">
        {cards.map((c) => {
          const Icon = c.icon
          return (
            <div className="admin-card" key={c.label}>
              <div className="admin-card-icon">
                <Icon size={20} />
              </div>
              <div>
                <div className="admin-card-value">{loading ? '…' : c.value}</div>
                <div className="admin-card-label">{c.label}</div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="admin-quick">
        <Link href="/admin/productos/nuevo" className="admin-quick-btn">
          <Plus size={18} /> Nuevo producto
        </Link>
        <Link href="/admin/categorias/nuevo" className="admin-quick-btn">
          <Tags size={18} /> Nueva categoría
        </Link>
        <Link href="/admin/negocio" className="admin-quick-btn">
          <Store size={18} /> Configuración
        </Link>
      </div>

      <div className="admin-tables">
        <section className="admin-table-block">
          <h2>Productos con bajo stock</h2>
          {bajoStock.length ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>SKU</th>
                  <th>Stock</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                {bajoStock.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.sku ?? '—'}</td>
                    <td><span className="admin-pill admin-pill--warn">{p.stock}</span></td>
                    <td>{formatPYG(p.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="admin-empty">{loading ? 'Cargando…' : 'Sin productos con bajo stock.'}</p>
          )}
        </section>

        <section className="admin-table-block">
          <h2>Últimos productos agregados</h2>
          {products.length ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 6).map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{formatPYG(p.price)}</td>
                    <td>{p.stock}</td>
                    <td>
                      <span className={`admin-pill ${p.active ? 'admin-pill--ok' : 'admin-pill--off'}`}>
                        {p.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="admin-empty">{loading ? 'Cargando…' : 'Todavía no hay productos.'}</p>
          )}
        </section>
      </div>
    </div>
  )
}
