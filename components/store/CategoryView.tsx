'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { StoreShell } from '@/components/store/StoreShell'
import { ProductCard } from '@/components/store/ProductCard'
import { getBusiness, getCategoryBySlug, getProductsByCategory } from '@/lib/queries'
import type { BusinessSettings, Category, ProductWithRelations } from '@/lib/supabase/types'

export function CategoryView({ slug }: { slug: string }) {
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<ProductWithRelations[]>([])
  const [business, setBusiness] = useState<BusinessSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const [cat, biz] = await Promise.all([getCategoryBySlug(slug), getBusiness()])
      setBusiness(biz)
      if (cat) {
        setCategory(cat)
        const all = await getProductsByCategory(cat.id)
        setProducts(all.filter((p) => Array.isArray(p.images) && p.images.length > 0))
      }
      setLoading(false)
    })()
  }, [slug])

  const whatsapp = business?.whatsapp_number || '595995364978'

  return (
    <StoreShell whatsappNumber={whatsapp}>
      <main className="section section--catalog" style={{ paddingTop: 'clamp(24px, 4vw, 44px)' }}>
        <div className="section-inner">
          <Link href="/#categorias" className="pv-back">
            <ArrowLeft size={18} />
            Volver a categorías
          </Link>

          {loading ? (
            <div className="catalog-empty" style={{ marginTop: 24 }}>
              <div className="catalog-empty-title">Cargando…</div>
            </div>
          ) : !category ? (
            <div className="catalog-empty" style={{ marginTop: 24 }}>
              <div className="catalog-empty-title">Categoría no encontrada</div>
              <p>Puede que ya no esté disponible.</p>
            </div>
          ) : (
            <>
              <div className="catalog-head" style={{ marginTop: 18 }}>
                <div>
                  <div className="kicker">CATEGORÍA</div>
                  <h2 className="h2">{category.name}</h2>
                </div>
                <div className="catalog-tools">
                  <span className="result-label">
                    {products.length === 1 ? '1 producto' : `${products.length} productos`}
                  </span>
                </div>
              </div>

              {products.length > 0 ? (
                <div className="prod-grid">
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              ) : (
                <div className="catalog-empty">
                  <div className="catalog-empty-title">Todavía no hay productos en esta categoría</div>
                  <p>Pronto vas a encontrar productos acá.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </StoreShell>
  )
}
