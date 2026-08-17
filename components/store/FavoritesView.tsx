'use client'

import Link from 'next/link'
import { ArrowLeft, Heart } from 'lucide-react'
import { useStore } from './StoreProvider'
import { ProductCard } from './ProductCard'
import type { ProductWithRelations } from '@/lib/supabase/types'

export function FavoritesView({ products }: { products: ProductWithRelations[] }) {
  const { favs } = useStore()
  const favProducts = products.filter((p) => favs.includes(p.id))

  return (
    <main className="section section--catalog" style={{ paddingTop: 'clamp(24px, 4vw, 44px)' }}>
      <div className="section-inner">
        <Link href="/" className="pv-back">
          <ArrowLeft size={18} />
          Volver a la tienda
        </Link>
        <div className="catalog-head" style={{ marginTop: 18 }}>
          <div>
            <div className="kicker">FAVORITOS</div>
            <h2 className="h2">Tus favoritos</h2>
          </div>
        </div>

        {favProducts.length > 0 ? (
          <div className="prod-grid">
            {favProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="favs-empty">
            <span className="favs-empty-heart">
              <Heart size={26} />
            </span>
            <div className="favs-empty-title">Todavía no guardaste favoritos</div>
            <p>Tocá el corazón de un producto para guardarlo acá y encontrarlo rápido la próxima vez.</p>
            <Link className="btn-dark" href="/#categorias">
              Ver productos
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
