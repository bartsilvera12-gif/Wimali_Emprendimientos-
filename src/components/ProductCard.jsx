import ShinyText from '../blocks/ShinyText/ShinyText.jsx'
import { useStore } from '../store.jsx'
import { fmt, discount } from '../utils.js'
import { ArrowRightIcon, HeartIcon } from './Icons.jsx'
import ProductImage from './ProductImage.jsx'

// variant: 'light' (catálogo) | 'dark' (ofertas)
export default function ProductCard({ p, variant = 'light' }) {
  const { add, openProduct, favs, toggleFav } = useStore()
  const isFav = favs.includes(p.id)
  const d = discount(p)
  const sold = p.stock === 0
  const dark = variant === 'dark'

  const badge = sold ? (
    <span className="badge badge--sold">AGOTADO</span>
  ) : p.previous_price ? (
    <span className="badge badge--offer">
      <ShinyText text={`-${d}%`} color="#3a2a10" shineColor="#ffffff" speed={2.6} />
    </span>
  ) : p.isNew ? (
    <span className="badge badge--new">NUEVO</span>
  ) : null

  return (
    <article className={`prod-card ${dark ? 'prod-card--dark' : ''}`}>
      <div className="prod-img" onClick={() => openProduct(p.slug)} role="button" tabIndex={0}>
        <ProductImage product={p} tone={dark ? 'dark' : 'light'} />
        {badge}
        <button
          className={`fav-btn ${isFav ? 'fav-btn--on' : ''}`}
          aria-label={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          onClick={e => {
            e.stopPropagation()
            toggleFav(p.id)
          }}
        >
          <HeartIcon filled={isFav} />
        </button>
      </div>
      <div className="prod-body">
        <div className="prod-cat">{p.category}</div>
        <h3 className="prod-name" onClick={() => openProduct(p.slug)}>
          {p.name}
        </h3>
        <div className="prod-prices">
          <span className="prod-price">{fmt(p.price)}</span>
          {p.previous_price && <span className="prod-prev">{fmt(p.previous_price)}</span>}
        </div>
        <div className="prod-actions">
          <button
            className={`prod-add ${dark ? 'prod-add--gold' : ''}`}
            disabled={sold}
            onClick={() => !sold && add(p, 1)}
          >
            {sold ? 'Agotado' : dark ? 'Agregar al pedido' : 'Agregar'}
          </button>
          {!dark && (
            <button className="prod-open" onClick={() => openProduct(p.slug)} aria-label="Ver producto">
              <ArrowRightIcon />
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
