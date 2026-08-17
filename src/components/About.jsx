import AnimatedContent from '../blocks/AnimatedContent/AnimatedContent.jsx'
import SpotlightCard from '../blocks/SpotlightCard/SpotlightCard.jsx'

const ITEMS = [
  { n: '01', t: 'Variedad de productos', d: 'Tecnología, accesorios, hogar y belleza en un mismo catálogo.' },
  { n: '02', t: 'Atención personalizada', d: 'Te asesoramos por WhatsApp antes y después de tu compra.' },
  { n: '03', t: 'Compra fácil', d: 'Elegí, agregá al pedido y finalizá en dos toques.' },
  { n: '04', t: 'Confianza', d: 'Precios claros, stock real y ubicación visible.' },
]

export default function About() {
  return (
    <section id="nosotros" className="section section--about">
      <div className="section-inner section-inner--narrow">
        <AnimatedContent distance={40} duration={0.7} className="about-head">
          <div className="kicker">NOSOTROS</div>
          <h2 className="h2">Sobre WIMALI</h2>
          <p>
            En WIMALI buscamos acercarte productos útiles, modernos y de calidad en un solo lugar,
            con una experiencia de compra sencilla y atención personalizada.
          </p>
        </AnimatedContent>
        <div className="about-grid">
          {ITEMS.map((it, i) => (
            <AnimatedContent key={it.n} distance={40} duration={0.65} delay={i * 0.07} className="grid-item">
              <SpotlightCard className="about-card" spotlightColor="rgba(201, 145, 61, 0.16)">
                <div className="about-num">{it.n}</div>
                <div className="about-title">{it.t}</div>
                <p>{it.d}</p>
              </SpotlightCard>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  )
}
