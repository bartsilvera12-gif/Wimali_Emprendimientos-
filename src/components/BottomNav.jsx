import { useStore } from '../store.jsx'
import { HomeIcon, GridIcon, SearchIcon, CartIcon } from './Icons.jsx'

export default function BottomNav() {
  const { count, goToSection, goHome, focusSearch, toggleCart } = useStore()
  return (
    <nav className="bottom-nav">
      <a
        href="#top"
        onClick={e => {
          e.preventDefault()
          goHome()
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      >
        <HomeIcon />
        Inicio
      </a>
      <a
        href="#productos"
        onClick={e => {
          e.preventDefault()
          goToSection('productos')
        }}
      >
        <GridIcon />
        Productos
      </a>
      <button onClick={focusSearch}>
        <SearchIcon size={22} />
        Buscar
      </button>
      <button className="bottom-nav-cart" onClick={toggleCart}>
        <CartIcon size={22} />
        Pedido
        {count > 0 && <span className="bottom-nav-badge">{count}</span>}
      </button>
    </nav>
  )
}
