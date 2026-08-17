import { useStore } from '../store.jsx'
import { BUSINESS } from '../config.js'
import { waPlain } from '../utils.js'

export default function Footer() {
  const { goToSection } = useStore()
  const nav = (e, id) => {
    e.preventDefault()
    goToSection(id)
  }
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <img src="assets/wimali-logo.png" alt="WIMALI Emprendimientos" />
          <p>Todo lo que necesitás, en un solo lugar.</p>
        </div>
        <div>
          <div className="footer-title">NAVEGACIÓN</div>
          <div className="footer-links">
            <a href="#top" onClick={e => nav(e, 'top')}>Inicio</a>
            <a href="#productos" onClick={e => nav(e, 'productos')}>Productos</a>
            <a href="#ofertas" onClick={e => nav(e, 'ofertas')}>Ofertas</a>
            <a href="#nosotros" onClick={e => nav(e, 'nosotros')}>Nosotros</a>
          </div>
        </div>
        <div>
          <div className="footer-title">AYUDA</div>
          <div className="footer-links">
            <a href={waPlain} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a href="#ubicacion" onClick={e => nav(e, 'ubicacion')}>Ubicación</a>
            <a href="#contacto" onClick={e => nav(e, 'contacto')}>Contacto</a>
            <span>{BUSINESS.phoneDisplay}</span>
          </div>
        </div>
        <div>
          <div className="footer-title">CATEGORÍAS</div>
          <div className="footer-links">
            <a href="#categorias" onClick={e => nav(e, 'categorias')}>Tecnología</a>
            <a href="#categorias" onClick={e => nav(e, 'categorias')}>Audio</a>
            <a href="#categorias" onClick={e => nav(e, 'categorias')}>Accesorios</a>
            <a href="#categorias" onClick={e => nav(e, 'categorias')}>Hogar y Belleza</a>
          </div>
        </div>
        <div>
          <div className="footer-title">REDES</div>
          <div className="footer-links">
            <a href={BUSINESS.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href={BUSINESS.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href={waPlain} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© WIMALI EMPRENDIMIENTOS</span>
        <span className="footer-credit">
          Desarrollado por{' '}
          <a href="https://neura.com.py" target="_blank" rel="noopener noreferrer">
            NEURA
          </a>
        </span>
        <span className="footer-address">{BUSINESS.address}</span>
      </div>
    </footer>
  )
}
