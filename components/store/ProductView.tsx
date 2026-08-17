'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Heart } from 'lucide-react'
import { useStore } from './StoreProvider'
import { ProductImage } from './ProductImage'
import { WaIcon } from './WaIcon'
import { formatPYG, discountPercent, stockLabel } from '@/lib/format'
import { waLink, productMessage } from '@/lib/whatsapp'
import type { ProductWithRelations } from '@/lib/supabase/types'

export function ProductView({
  product,
  whatsappNumber,
}: {
  product: ProductWithRelations
  whatsappNumber: string
}) {
  const { add, isFav, toggleFav } = useStore()
  const [qty, setQty] = useState(1)
  const sold = product.stock <= 0
  const fav = isFav(product.id)
  const d = discountPercent(product.price, product.previous_price)
  const images = (product.images ?? []).slice().sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order)
  const main = images[0]?.public_url ?? null
  const stockColor = sold ? '#a33' : product.stock <= 6 ? '#C9913D' : '#128C4A'

  return (
    <main className="pv">
      <div className="section-inner">
        <Link href="/" className="pv-back">
          <ArrowLeft size={18} />
          Volver a la tienda
        </Link>

        <div className="pv-grid">
          <div>
            <div className="pv-photo">
              <ProductImage src={main} name={product.name} />
            </div>
            {images.length > 1 && (
              <div className="pv-thumbs">
                {images.slice(1, 4).map((im) => (
                  <div className="pv-thumb" key={im.id}>
                    <ProductImage src={im.public_url} name={product.name} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="pv-cat">{product.category?.name ?? ''}</div>
            <h1 className="pv-name">{product.name}</h1>
            <div className="pv-prices">
              <span className="pv-price">{formatPYG(product.price)}</span>
              {product.previous_price && <span className="pv-prev">{formatPYG(product.previous_price)}</span>}
              {product.previous_price && <span className="pv-save">Ahorrás {d}%</span>}
            </div>
            <div className="pv-stock" style={{ color: stockColor }}>
              <span className="pv-stock-dot" style={{ background: stockColor }} />
              {stockLabel(product.stock)}
            </div>
            {product.description && <p className="pv-desc">{product.description}</p>}

            <div className="pv-buy">
              <div className="qty-box">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Menos">
                  −
                </button>
                <span>{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock || 1, q + 1))}
                  aria-label="Más"
                  disabled={qty >= product.stock}
                >
                  +
                </button>
              </div>
              <button
                className="pv-add"
                disabled={sold}
                onClick={() =>
                  !sold && add({ id: product.id, name: product.name, price: product.price, stock: product.stock }, qty)
                }
              >
                {sold ? 'Producto agotado' : 'Agregar al pedido'}
              </button>
              <button
                className={`pv-fav ${fav ? 'pv-fav--on' : ''}`}
                aria-label={fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                onClick={() => toggleFav(product.id)}
              >
                <Heart size={22} fill={fav ? 'currentColor' : 'none'} />
              </button>
            </div>
            <a
              className="btn-wa pv-wa"
              href={waLink(whatsappNumber, productMessage(product.name, product.price, qty))}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WaIcon size={21} />
              Comprar ahora por WhatsApp
            </a>

            <div className="pv-info">
              <div className="pv-info-title">Información adicional</div>
              <div className="pv-info-rows">
                <div>
                  <span>Categoría</span>
                  <strong>{product.category?.name ?? '—'}</strong>
                </div>
                <div>
                  <span>Código</span>
                  <strong>{product.sku ?? '—'}</strong>
                </div>
                <div>
                  <span>Entrega</span>
                  <strong>Retiro en local o envío</strong>
                </div>
                <div>
                  <span>Pago</span>
                  <strong>Efectivo o transferencia</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
