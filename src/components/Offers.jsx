import AnimatedContent from '../blocks/AnimatedContent/AnimatedContent.jsx'
import ShinyText from '../blocks/ShinyText/ShinyText.jsx'
import { useStore } from '../store.jsx'
import ProductCard from './ProductCard.jsx'

export default function Offers() {
  const { offers } = useStore()
  return (
    <section id="ofertas" className="section section--offers">
      <div className="offers-glow" />
      <div className="section-inner">
        <AnimatedContent distance={40} duration={0.7} className="offers-head">
          <div className="kicker">
            <ShinyText text="PROMOCIONES" color="#C9913D" shineColor="#F6F1E7" speed={3} />
          </div>
          <h2 className="h2 h2--light">Ofertas que no podés dejar pasar</h2>
          <p className="offers-sub">
            Precios con descuento por tiempo limitado. Consultá disponibilidad antes de finalizar tu
            pedido.
          </p>
        </AnimatedContent>
        <div className="prod-grid">
          {offers.map((p, i) => (
            <AnimatedContent
              key={p.id}
              distance={40}
              duration={0.65}
              delay={(i % 4) * 0.07}
              className="grid-item"
            >
              <ProductCard p={p} variant="dark" />
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  )
}
