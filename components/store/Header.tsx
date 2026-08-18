'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Heart, ShoppingCart, Menu, X } from 'lucide-react'
import { useStore } from './StoreProvider'
import { WaIcon } from './WaIcon'
import { waPlain } from '@/lib/whatsapp'

const NAV = [
  { href: '/#top', label: 'Inicio' },
  { href: '/#categorias', label: 'Productos' },
  { href: '/favoritos', label: 'Favoritos' },
  { href: '/#ofertas', label: 'Ofertas' },
  { href: '/#nosotros', label: 'Nosotros' },
  { href: '/#ubicacion', label: 'Ubicación' },
  { href: '/#contacto', label: 'Contacto' },
]

export function Header({ whatsappNumber }: { whatsappNumber: string }) {
  const { count, favs, toggleCart, setSearchOpen } = useStore()
  const [menuOpen, setMenuOpen] = useState(false)

  // Desplazamiento suave a cada sección (con offset del header fijo).
  const onNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMenuOpen(false)
    if (!href.startsWith('/#')) return // enlaces a rutas (ej: /favoritos) navegan normal
    const id = href.slice(2)
    const el = typeof document !== 'undefined' ? document.getElementById(id) : null
    if (!el) return // no está en esta página: dejar que Next navegue
    e.preventDefault()
    const y = el.getBoundingClientRect().top + window.scrollY - 76
    // pequeño respiro para que el overlay se cierre antes de desplazar
    setTimeout(() => window.scrollTo({ top: y, behavior: 'smooth' }), 20)
  }

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link href="/" className="header-logo" onClick={() => setMenuOpen(false)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/wimali-logo.png" alt="WIMALI Emprendimientos" />
          </Link>

          <nav className="header-nav">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} onClick={(e) => onNavClick(e, n.href)}>
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <button className="icon-btn" onClick={() => setSearchOpen(true)} aria-label="Buscar">
              <Search size={20} />
            </button>
            <Link
              className={`icon-btn icon-btn--fav ${favs.length ? 'is-active' : ''}`}
              href="/favoritos"
              aria-label="Favoritos"
            >
              <Heart size={19} fill={favs.length ? 'currentColor' : 'none'} />
              {favs.length > 0 && <span className="cart-badge">{favs.length}</span>}
            </Link>
            <button className="icon-btn icon-btn--cart" onClick={toggleCart} aria-label="Ver pedido">
              <ShoppingCart size={21} />
              {count > 0 && <span className="cart-badge">{count}</span>}
            </button>
            <a
              className="btn-wa btn-wa--header"
              href={waPlain(whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WaIcon size={18} />
              Comprar por WhatsApp
            </a>
            <button className="icon-btn header-burger" onClick={() => setMenuOpen(true)} aria-label="Menú">
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="menu-overlay">
          <div className="menu-top">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/wimali-logo.png" alt="WIMALI" />
            <button className="menu-close" onClick={() => setMenuOpen(false)} aria-label="Cerrar">
              <X size={22} />
            </button>
          </div>
          <nav className="menu-nav">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={n.href === '/#ofertas' ? 'menu-link--gold' : ''}
                onClick={(e) => onNavClick(e, n.href)}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <a className="btn-wa menu-wa" href={waPlain(whatsappNumber)} target="_blank" rel="noopener noreferrer">
            <WaIcon size={21} />
            Comprar por WhatsApp
          </a>
        </div>
      )}
    </>
  )
}
