'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { StoreShell } from '@/components/store/StoreShell'
import { ProductView } from '@/components/store/ProductView'
import { getBusiness, getProductBySlug } from '@/lib/queries'
import type { BusinessSettings, ProductWithRelations } from '@/lib/supabase/types'

export function ProductPageClient({ slug }: { slug: string }) {
  const [product, setProduct] = useState<ProductWithRelations | null>(null)
  const [business, setBusiness] = useState<BusinessSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const [prod, biz] = await Promise.all([getProductBySlug(slug), getBusiness()])
      setProduct(prod)
      setBusiness(biz)
      setLoading(false)
    })()
  }, [slug])

  const whatsapp = business?.whatsapp_number || '595995364978'

  return (
    <StoreShell whatsappNumber={whatsapp}>
      {loading ? (
        <main className="section section--catalog" style={{ paddingTop: 'clamp(24px, 4vw, 44px)' }}>
          <div className="section-inner">
            <div className="catalog-empty" style={{ marginTop: 24 }}>
              <div className="catalog-empty-title">Cargando…</div>
            </div>
          </div>
        </main>
      ) : !product ? (
        <main className="section section--catalog" style={{ paddingTop: 'clamp(24px, 4vw, 44px)' }}>
          <div className="section-inner">
            <Link href="/#categorias" className="pv-back">
              <ArrowLeft size={18} />
              Volver
            </Link>
            <div className="catalog-empty" style={{ marginTop: 24 }}>
              <div className="catalog-empty-title">Producto no encontrado</div>
              <p>Puede que ya no esté disponible.</p>
            </div>
          </div>
        </main>
      ) : (
        <ProductView product={product} whatsappNumber={whatsapp} />
      )}
    </StoreShell>
  )
}
