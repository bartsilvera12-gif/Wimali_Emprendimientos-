'use client'

import Link from 'next/link'
import { ArrowRight, Heart } from 'lucide-react'
import { useStore } from './StoreProvider'
import { ProductImage } from './ProductImage'
import { formatPYG, discountPercent, primaryImage } from '@/lib/format'
import type { ProductWithRelations } from '@/lib/supabase/types'

export function ProductCard({
  product,
  variant = 'light',
}: {
  product: ProductWithRelations
  variant?: 'light' | 'dark'
}) {
  const { add, isFav, toggleFav } = useStore()
  const dark = variant === 'dark'
  const sold = product.stock <= 0
  const d = discountPercent(product.price, product.previous_price)
  const fav = isFav(product.id)
  const img = primaryImage(product)

  const badge = sold ? (
    <span className="badge badge--sold">AGOTADO</span>
  ) : product.previous_price ? (
    <span className="badge badge--offer">-{d}%</span>
  ) : product.is_new ? (
    <span className="badge badge--new">NUEVO</span>
  ) : null

  return (
    <article className={`prod-card ${dark ? 'prod-card--dark' : ''}`} style={{ position: 'relative' }}>
      <Link href={`/producto/${product.slug}`} className="prod-img" style={{ display: 'block' }}>
        <ProductImage src={img} name={product.name} tone={dark ? 'dark' : 'light'} />
        {badge}
      </Link>
      <button
        className={`fav-btn ${fav ? 'fav-btn--on' : ''}`}
        aria-label={fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        onClick={() => toggleFav(product.id)}
        style={{ position: 'absolute' }}
      >
        <Heart size={19} fill={fav ? 'currentColor' : 'none'} />
      </button>
      <div className="prod-body">
        <div className="prod-cat">{product.category?.name ?? ''}</div>
        <Link href={`/producto/${product.slug}`} className="prod-name" style={{ display: 'block' }}>
          {product.name}
        </Link>
        <div className="prod-prices">
          <span className="prod-price">{formatPYG(product.price)}</span>
          {product.previous_price && <span className="prod-prev">{formatPYG(product.previous_price)}</span>}
        </div>
        <div className="prod-actions">
          <button
            className={`prod-add ${dark ? 'prod-add--gold' : ''}`}
            disabled={sold}
            onClick={() =>
              !sold && add({ id: product.id, name: product.name, price: product.price, stock: product.stock }, 1)
            }
          >
            {sold ? 'Agotado' : dark ? 'Agregar al pedido' : 'Agregar'}
          </button>
          {!dark && (
            <Link href={`/producto/${product.slug}`} className="prod-open" aria-label="Ver producto">
              <ArrowRight size={19} />
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
