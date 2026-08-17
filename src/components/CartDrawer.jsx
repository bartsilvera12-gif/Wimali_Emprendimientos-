import { useStore } from '../store.jsx'
import { fmt } from '../utils.js'
import { WaIcon } from './Icons.jsx'
import ProductImage from './ProductImage.jsx'
import { PRODUCTS } from '../data/products.js'

export default function CartDrawer() {
  const { cart, count, total, waOrder, toggleCart, changeQty, removeItem, browse } = useStore()

  return (
    <div className="cart-root">
      <div className="cart-backdrop" onClick={toggleCart} />
      <aside className="cart-panel">
        <div className="cart-head">
          <div>
            <h2>Tu pedido</h2>
            <div className="cart-sub">{count === 1 ? '1 producto' : `${count} productos`}</div>
          </div>
          <button className="cart-close" onClick={toggleCart} aria-label="Cerrar">
            ×
          </button>
        </div>

        <div className="cart-list">
          {cart.map(c => {
            const p = PRODUCTS.find(x => x.id === c.id)
            return (
              <div className="cart-item" key={c.id}>
                <div className="cart-item-img">
                  <ProductImage product={p} label={c.name} />
                </div>
                <div className="cart-item-body">
                  <div className="cart-item-name">{c.name}</div>
                  <div className="cart-item-total">{fmt(c.price * c.qty)}</div>
                  <div className="cart-item-row">
                    <div className="qty-box qty-box--sm">
                      <button onClick={() => changeQty(c.id, -1)} aria-label="Menos">−</button>
                      <span>{c.qty}</span>
                      <button onClick={() => changeQty(c.id, 1)} aria-label="Más">+</button>
                    </div>
                    <button className="cart-remove" onClick={() => removeItem(c.id)}>
                      Quitar
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          {count === 0 && (
            <div className="cart-empty">
              <div className="cart-empty-title">Tu pedido está vacío</div>
              <p>Agregá productos y finalizá por WhatsApp.</p>
              <button className="btn-dark" onClick={browse}>
                Ver productos
              </button>
            </div>
          )}
        </div>

        <div className="cart-foot">
          <div className="cart-total-row">
            <span>Total del pedido</span>
            <span className="cart-total">{fmt(total)}</span>
          </div>
          <a className="btn-wa cart-wa" href={waOrder} target="_blank" rel="noopener noreferrer">
            <WaIcon size={22} />
            Finalizar pedido por WhatsApp
          </a>
          <div className="cart-note">Sin registro. Confirmás precio y disponibilidad en el chat.</div>
        </div>
      </aside>
    </div>
  )
}
