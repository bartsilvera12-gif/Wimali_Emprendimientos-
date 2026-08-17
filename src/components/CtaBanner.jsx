import AnimatedContent from '../blocks/AnimatedContent/AnimatedContent.jsx'
import { waPlain } from '../utils.js'
import { WaIcon } from './Icons.jsx'

export default function CtaBanner() {
  return (
    <section className="section section--cta">
      <AnimatedContent distance={50} duration={0.75}>
        <div className="cta-banner">
          <div>
            <h2>¿Encontraste lo que buscabas?</h2>
            <p>Hacé tu pedido directamente por WhatsApp y te ayudamos a finalizar tu compra.</p>
          </div>
          <div className="cta-banner-btn">
            <a className="btn-white" href={waPlain} target="_blank" rel="noopener noreferrer">
              <WaIcon size={22} color="#128C4A" />
              Comprar por WhatsApp
            </a>
          </div>
        </div>
      </AnimatedContent>
    </section>
  )
}
