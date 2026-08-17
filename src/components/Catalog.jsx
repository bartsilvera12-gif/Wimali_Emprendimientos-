import AnimatedContent from '../blocks/AnimatedContent/AnimatedContent.jsx'
import { useStore } from '../store.jsx'
import { waPlain } from '../utils.js'
import ProductCard from './ProductCard.jsx'

export default function Catalog() {
  const { list, cat, query, clearFilters } = useStore()
  const filtered = !!(cat || query.trim())

  return (
    <section id="productos" className="section section--catalog">
      <div className="section-inner">
        <div className="catalog-head">
          <AnimatedContent distance={40} duration={0.7}>
            <div className="kicker">CATÁLOGO</div>
            <h2 className="h2">{cat || 'Productos destacados'}</h2>
          </AnimatedContent>
          <div className="catalog-tools">
            <span className="result-label">
              {list.length === 1 ? '1 producto' : `${list.length} productos`}
            </span>
            {filtered && (
              <button className="btn-clear" onClick={clearFilters}>
                Limpiar filtro
              </button>
            )}
          </div>
        </div>

        <div className="prod-grid">
          {list.map((p, i) => (
            <AnimatedContent
              key={p.id}
              distance={40}
              duration={0.65}
              delay={(i % 4) * 0.07}
              className="grid-item"
            >
              <ProductCard p={p} />
            </AnimatedContent>
          ))}
        </div>

        {list.length === 0 && (
          <div className="catalog-empty">
            <div className="catalog-empty-title">No encontramos ese producto</div>
            <p>Escribinos y lo buscamos para vos.</p>
            <a className="btn-wa" href={waPlain} target="_blank" rel="noopener noreferrer">
              Consultar por WhatsApp
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
