import { useStore } from '../store.jsx'
import { waPlain } from '../utils.js'
import { WaIcon, SearchIcon, CartIcon, HeartIcon } from './Icons.jsx'

const NAV = [
  { id: 'top', label: 'Inicio' },
  { id: 'productos', label: 'Productos' },
  { id: 'categorias', label: 'Categorías' },
  { id: 'favoritos', label: 'Favoritos' },
  { id: 'ofertas', label: 'Ofertas' },
  { id: 'nosotros', label: 'Nosotros' },
  { id: 'ubicacion', label: 'Ubicación' },
  { id: 'contacto', label: 'Contacto' },
]

export default function Header() {
  const {
    scrolled, isMobile, count, favs, menuOpen,
    goToSection, goHome, goFavorites, focusSearch, toggleCart, toggleMenu, closeMenu,
  } = useStore()
  const favCount = favs.length

  const nav = (e, id) => {
    e.preventDefault()
    if (id === 'favoritos') goFavorites()
    else goToSection(id)
  }

  return (
    <>
      <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
        <div className="header-inner">
          <a
            href="#top"
            className="header-logo"
            onClick={e => {
              e.preventDefault()
              goHome()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            <img src="assets/wimali-logo.png" alt="WIMALI Emprendimientos" />
          </a>

          {!isMobile && (
            <nav className="header-nav">
              {NAV.map(n => (
                <a key={n.id} href={`#${n.id}`} onClick={e => nav(e, n.id)}>
                  {n.label}
                </a>
              ))}
            </nav>
          )}

          <div className="header-actions">
            <button className="icon-btn" onClick={focusSearch} aria-label="Buscar">
              <SearchIcon />
            </button>
            <button
              className={`icon-btn icon-btn--fav ${favCount > 0 ? 'is-active' : ''}`}
              onClick={goFavorites}
              aria-label="Ver favoritos"
            >
              <HeartIcon filled={favCount > 0} />
              {favCount > 0 && <span className="cart-badge">{favCount}</span>}
            </button>
            <button className="icon-btn icon-btn--cart" onClick={toggleCart} aria-label="Ver pedido">
              <CartIcon />
              {count > 0 && <span className="cart-badge">{count}</span>}
            </button>
            {!isMobile && (
              <a className="btn-wa btn-wa--header" href={waPlain} target="_blank" rel="noopener noreferrer">
                <WaIcon size={18} />
                Comprar por WhatsApp
              </a>
            )}
            {isMobile && (
              <button className="icon-btn burger" onClick={toggleMenu} aria-label="Menú">
                <span />
                <span />
                <span className="burger-gold" />
              </button>
            )}
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="menu-overlay">
          <div className="menu-top">
            <img src="assets/wimali-logo.png" alt="WIMALI" />
            <button className="menu-close" onClick={closeMenu} aria-label="Cerrar">
              ×
            </button>
          </div>
          <nav className="menu-nav">
            {NAV.map(n => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className={n.id === 'ofertas' ? 'menu-link--gold' : ''}
                onClick={e => nav(e, n.id)}
              >
                {n.label}
              </a>
            ))}
          </nav>
          <a className="btn-wa menu-wa" href={waPlain} target="_blank" rel="noopener noreferrer">
            <WaIcon size={21} />
            Comprar por WhatsApp
          </a>
        </div>
      )}
    </>
  )
}
