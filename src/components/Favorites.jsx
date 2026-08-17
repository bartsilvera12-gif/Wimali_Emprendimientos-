import AnimatedContent from '../blocks/AnimatedContent/AnimatedContent.jsx'
import { useStore } from '../store.jsx'
import { HeartIcon, ArrowLeftIcon } from './Icons.jsx'
import ProductCard from './ProductCard.jsx'
import SectionGradient from './SectionGradient.jsx'

// Vista dedicada de Favoritos (pestaña propia dentro de la misma página).
export default function Favorites() {
  const { favProducts, goHome, browse } = useStore()
  return (
    <main className="fav-page">
      <section id="favoritos" className="section section--favs">
        <SectionGradient variant="light" />
        <div className="section-inner">
          <button className="pv-back" onClick={goHome}>
            <ArrowLeftIcon />
            Volver a la tienda
          </button>

          <AnimatedContent distance={40} duration={0.7}>
            <div className="kicker">FAVORITOS</div>
            <h2 className="h2">Tus favoritos</h2>
          </AnimatedContent>

          {favProducts.length > 0 ? (
            <div className="prod-grid">
              {favProducts.map((p, i) => (
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
          ) : (
            <div className="favs-empty">
              <span className="favs-empty-heart">
                <HeartIcon size={26} />
              </span>
              <div className="favs-empty-title">Todavía no guardaste favoritos</div>
              <p>
                Tocá el corazón de un producto para guardarlo acá y encontrarlo rápido la próxima
                vez.
              </p>
              <button className="btn-dark" onClick={browse}>
                Ver productos
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
