'use client'

import Link from 'next/link'
import { Search, Heart, ShoppingCart } from 'lucide-react'
import { useStore } from './StoreProvider'
import { WaIcon } from './WaIcon'
import { waPlain } from '@/lib/whatsapp'

const NAV = [
  { href: '/#top', label: 'Inicio' },
  { href: '/#productos', label: 'Productos' },
  { href: '/#categorias', label: 'Categorías' },
  { href: '/favoritos', label: 'Favoritos' },
  { href: '/#ofertas', label: 'Ofertas' },
  { href: '/#nosotros', label: 'Nosotros' },
  { href: '/#ubicacion', label: 'Ubicación' },
  { href: '/#contacto', label: 'Contacto' },
]

export function Header({ whatsappNumber }: { whatsappNumber: string }) {
  const { count, favs, toggleCart } = useStore()

  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="header-logo">
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
          <a className="icon-btn" href="/#productos" aria-label="Buscar">
            <Search size={20} />
          </a>
          <Link className={`icon-btn icon-btn--fav ${favs.length ? 'is-active' : ''}`} href="/favoritos" aria-label="Favoritos">
            <Heart size={19} fill={favs.length ? 'currentColor' : 'none'} />
            {favs.length > 0 && <span className="cart-badge">{favs.length}</span>}
          </Link>
          <button className="icon-btn icon-btn--cart" onClick={toggleCart} aria-label="Ver pedido">
            <ShoppingCart size={21} />
            {count > 0 && <span className="cart-badge">{count}</span>}
          </button>
          <a className="btn-wa btn-wa--header" href={waPlain(whatsappNumber)} target="_blank" rel="noopener noreferrer">
            <WaIcon size={18} />
            Comprar por WhatsApp
          </a>
        </div>
      </div>
    </header>
  )
}
