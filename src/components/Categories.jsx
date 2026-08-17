import SpotlightCard from '../blocks/SpotlightCard/SpotlightCard.jsx'
import AnimatedContent from '../blocks/AnimatedContent/AnimatedContent.jsx'
import { useStore } from '../store.jsx'
import { scrollToId } from '../utils.js'
import { CATS } from '../data/products.js'
import ProductImage from './ProductImage.jsx'
import SectionGradient from './SectionGradient.jsx'

// Foto representativa de cada tarjeta de categoría (producto de esa categoría)
const CAT_IMAGES = {
  Tecnología: 'assets/productos/consola-retro-portatil.jpg',
  Accesorios: 'assets/productos/cargador-rapido-usb-c-20w.jpg',
  Audio: 'assets/productos/microfono-inalambrico-dual.jpg',
  Belleza: 'assets/productos/torno-de-unas.jpg',
  Ofertas: 'assets/productos/power-bank-12000mah.jpg',
}

export default function Categories() {
  const { active, offers, pickCategory } = useStore()

  const cards = CATS.map(name => ({
    name,
    count: active.filter(p => p.category === name).length + ' productos',
    onPick: () => pickCategory(name),
  })).concat([
    {
      name: 'Ofertas',
      count: offers.length + ' en promoción',
      onPick: () => scrollToId('ofertas', 80),
    },
  ])

  return (
    <section id="categorias" className="section section--cats">
      <SectionGradient variant="light" />
      <div className="section-inner">
        <AnimatedContent distance={40} duration={0.7}>
          <div className="kicker">CATEGORÍAS</div>
          <h2 className="h2">¿Qué estás buscando?</h2>
        </AnimatedContent>
        <div className="cat-grid">
          {cards.map((c, i) => (
            <AnimatedContent key={c.name} distance={40} duration={0.65} delay={(i % 8) * 0.06} className="grid-item">
              <SpotlightCard className="cat-card" spotlightColor="rgba(228, 189, 105, 0.25)">
                <button className="cat-hit" onClick={c.onPick}>
                  <div className="cat-img">
                    {CAT_IMAGES[c.name] ? (
                      <ProductImage product={{ name: c.name, image: CAT_IMAGES[c.name] }} tone="dark" />
                    ) : (
                      <ProductImage label={c.name} tone="dark" />
                    )}
                  </div>
                  <div className="cat-shade" />
                  <div className="cat-text">
                    <div className="cat-name">{c.name}</div>
                    <div className="cat-count">{c.count}</div>
                  </div>
                </button>
              </SpotlightCard>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  )
}
