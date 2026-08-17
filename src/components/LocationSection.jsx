import AnimatedContent from '../blocks/AnimatedContent/AnimatedContent.jsx'
import { BUSINESS } from '../config.js'
import { mapSrc, directionsHref, waPlain } from '../utils.js'

export default function LocationSection() {
  return (
    <section id="ubicacion" className="section section--location">
      <div className="section-inner">
        <AnimatedContent distance={40} duration={0.7}>
          <div className="kicker">UBICACIÓN</div>
          <h2 className="h2">Encontranos</h2>
        </AnimatedContent>
        <div className="loc-grid">
          <div className="map-box">
            <iframe
              title="Mapa WIMALI"
              src={mapSrc()}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="info-card">
            <div>
              <div className="info-label">DIRECCIÓN</div>
              <div className="info-value">{BUSINESS.address}</div>
            </div>
            <div className="info-sep" />
            <div>
              <div className="info-label">HORARIOS</div>
              <div className="info-hours">{BUSINESS.hours}</div>
            </div>
            <div className="info-sep" />
            <div>
              <div className="info-label">WHATSAPP</div>
              <div className="info-value">{BUSINESS.phoneDisplay}</div>
            </div>
            <div className="info-actions">
              <a className="btn-gold btn-gold--sm" href={directionsHref()} target="_blank" rel="noopener noreferrer">
                Cómo llegar
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
