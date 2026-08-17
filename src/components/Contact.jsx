import AnimatedContent from '../blocks/AnimatedContent/AnimatedContent.jsx'
import { BUSINESS } from '../config.js'
import { InstagramIcon, FacebookIcon } from './Icons.jsx'
import SectionGradient from './SectionGradient.jsx'

export default function Contact() {
  return (
    <section id="contacto" className="section section--contact">
      <SectionGradient variant="light" />
      <div className="section-inner section-inner--narrow">
        <AnimatedContent distance={40} duration={0.7} className="contact-head">
          <div className="kicker">REDES</div>
          <h2 className="h2">Seguinos</h2>
        </AnimatedContent>
        <div className="social-grid">
          <AnimatedContent distance={40} duration={0.65} className="grid-item">
            <a className="social-card" href={BUSINESS.instagram} target="_blank" rel="noopener noreferrer">
              <span className="social-icon social-icon--cream">
                <InstagramIcon />
              </span>
              <span>
                <span className="social-name">Instagram</span>
                <span className="social-desc">Novedades y productos nuevos</span>
              </span>
            </a>
          </AnimatedContent>
          <AnimatedContent distance={40} duration={0.65} delay={0.07} className="grid-item">
            <a className="social-card" href={BUSINESS.facebook} target="_blank" rel="noopener noreferrer">
              <span className="social-icon social-icon--cream">
                <FacebookIcon />
              </span>
              <span>
                <span className="social-name">Facebook</span>
                <span className="social-desc">Ofertas y publicaciones</span>
              </span>
            </a>
          </AnimatedContent>
        </div>
      </div>
    </section>
  )
}
