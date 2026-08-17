import AnimatedContent from '../blocks/AnimatedContent/AnimatedContent.jsx'
import { useStore } from '../store.jsx'
import { fmt, discount, wa, productMessage } from '../utils.js'
import { WaIcon, ArrowLeftIcon, HeartIcon } from './Icons.jsx'
import ProductImage from './ProductImage.jsx'
import ProductCard from './ProductCard.jsx'

export default function ProductView() {
  const { current: p, qty, setQty, add, goHome, active, favs, toggleFav } = useStore()
  const isFav = favs.includes(p.id)
  const d = discount(p)
  const sold = p.stock === 0
  const related = active.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4)
  const stockLabel =
    p.stock === 0 ? 'Agotado' : p.stock <= 6 ? `Últimas ${p.stock} unidades` : 'Disponible ahora'
  const stockColor = p.stock === 0 ? '#a33' : p.stock <= 6 ? '#C9913D' : '#128C4A'

  return (
    <main className="pv">
      <div className="section-inner">
        <button className="pv-back" onClick={goHome}>
          <ArrowLeftIcon />
          Volver a la tienda
        </button>

        <div className="pv-grid">
          <div>
            <div className="pv-photo">
              <ProductImage product={p} />
            </div>
            <div className="pv-thumbs">
              <div className="pv-thumb">
                {p.image2 ? (
                  <ProductImage product={{ name: p.name, image: p.image2 }} />
                ) : (
                  <ProductImage label="Foto 2" />
                )}
              </div>
              <div className="pv-thumb"><ProductImage label="Foto 3" /></div>
              <div className="pv-thumb"><ProductImage label="Foto 4" /></div>
            </div>
          </div>

          <div>
            <div className="pv-cat">{p.category}</div>
            <h1 className="pv-name">{p.name}</h1>
            <div className="pv-prices">
              <span className="pv-price">{fmt(p.price)}</span>
              {p.previous_price && <span className="pv-prev">{fmt(p.previous_price)}</span>}
              {p.previous_price && <span className="pv-save">Ahorrás {d}%</span>}
            </div>
            <div className="pv-stock" style={{ color: stockColor }}>
              <span className="pv-stock-dot" style={{ background: stockColor }} />
              {stockLabel}
            </div>
            <p className="pv-desc">{p.description}</p>

            <div className="pv-buy">
              <div className="qty-box">
                <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Menos">−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(Math.min(20, qty + 1))} aria-label="Más">+</button>
              </div>
              <button className="pv-add" disabled={sold} onClick={() => !sold && add(p, qty)}>
                {sold ? 'Producto agotado' : 'Agregar al pedido'}
              </button>
              <button
                className={`pv-fav ${isFav ? 'pv-fav--on' : ''}`}
                aria-label={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                onClick={() => toggleFav(p.id)}
              >
                <HeartIcon size={22} filled={isFav} />
              </button>
            </div>
            <a
              className="btn-wa pv-wa"
              href={wa(productMessage(p, qty))}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WaIcon size={21} />
              Comprar ahora por WhatsApp
            </a>

            <div className="pv-info">
              <div className="pv-info-title">Información adicional</div>
              <div className="pv-info-rows">
                <div><span>Categoría</span><strong>{p.category}</strong></div>
                <div><span>Código</span><strong>WM-{String(p.id).padStart(4, '0')}</strong></div>
                <div><span>Entrega</span><strong>Retiro en local o envío</strong></div>
                <div><span>Pago</span><strong>Efectivo o transferencia</strong></div>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="pv-related">
            <h2>Productos relacionados</h2>
            <div className="prod-grid prod-grid--related">
              {related.map((r, i) => (
                <AnimatedContent key={r.id} distance={36} duration={0.6} delay={i * 0.06} className="grid-item">
                  <ProductCard p={r} />
                </AnimatedContent>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
