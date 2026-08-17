'use client'

import { useStore } from './StoreProvider'
import { WaIcon } from './WaIcon'
import { formatPYG } from '@/lib/format'
import { waLink, orderMessage } from '@/lib/whatsapp'

export function CartDrawer({ whatsappNumber }: { whatsappNumber: string }) {
  const { cart, cartOpen, count, total, setCartOpen, changeQty, removeItem } = useStore()
  if (!cartOpen) return null

  const waHref =
    count > 0
      ? waLink(whatsappNumber, orderMessage(cart))
      : waLink(whatsappNumber, 'Hola WIMALI 👋 Quiero hacer una consulta.')

  return (
    <div className="cart-root">
      <div className="cart-backdrop" onClick={() => setCartOpen(false)} />
      <aside className="cart-panel">
        <div className="cart-head">
          <div>
            <h2>Tu pedido</h2>
            <div className="cart-sub">{count === 1 ? '1 producto' : `${count} productos`}</div>
          </div>
          <button className="cart-close" onClick={() => setCartOpen(false)} aria-label="Cerrar">
            ×
          </button>
        </div>

        <div className="cart-list">
          {cart.map((c) => (
            <div className="cart-item" key={c.id}>
              <div className="cart-item-body" style={{ flex: 1 }}>
                <div className="cart-item-name">{c.name}</div>
                <div className="cart-item-total">{formatPYG(c.price * c.qty)}</div>
                <div className="cart-item-row">
                  <div className="qty-box qty-box--sm">
                    <button onClick={() => changeQty(c.id, -1)} aria-label="Menos">−</button>
                    <span>{c.qty}</span>
                    <button onClick={() => changeQty(c.id, 1)} aria-label="Más" disabled={c.qty >= c.stock}>
                      +
                    </button>
                  </div>
                  <button className="cart-remove" onClick={() => removeItem(c.id)}>
                    Quitar
                  </button>
                </div>
              </div>
            </div>
          ))}

          {count === 0 && (
            <div className="cart-empty">
              <div className="cart-empty-title">Tu pedido está vacío</div>
              <p>Agregá productos y finalizá por WhatsApp.</p>
              <button className="btn-dark" onClick={() => setCartOpen(false)}>
                Ver productos
              </button>
            </div>
          )}
        </div>

        <div className="cart-foot">
          <div className="cart-total-row">
            <span>Total del pedido</span>
            <span className="cart-total">{formatPYG(total)}</span>
          </div>
          <a className="btn-wa cart-wa" href={waHref} target="_blank" rel="noopener noreferrer">
            <WaIcon size={22} />
            Finalizar pedido por WhatsApp
          </a>
          <div className="cart-note">Sin registro. Confirmás precio y disponibilidad en el chat.</div>
        </div>
      </aside>
    </div>
  )
}
