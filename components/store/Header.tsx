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
              <Link key={n.href} href={n.href}>
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
                onClick={() => setMenuOpen(false)}
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
