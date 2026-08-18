'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  Package,
  Tags,
  Store,
  Share2,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react'

const LINKS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/productos', label: 'Productos', icon: Package },
  { href: '/admin/categorias', label: 'Categorías', icon: Tags },
  { href: '/admin/negocio', label: 'Negocio', icon: Store },
  { href: '/admin/redes', label: 'Redes', icon: Share2 },
]

export function AdminSidebar({ adminName, role }: { adminName: string; role: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button className="admin-burger" onClick={() => setOpen(true)} aria-label="Menú">
        <Menu size={22} />
      </button>

      {open && <div className="admin-drawer-backdrop" onClick={() => setOpen(false)} />}

      <aside className={`admin-sidebar ${open ? 'admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar-top">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/wimali-logo.png" alt="WIMALI" className="admin-logo" />
          <button className="admin-drawer-close" onClick={() => setOpen(false)} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <div className="admin-user">
          <div className="admin-user-name">{adminName}</div>
          <div className="admin-user-role">{role === 'super_admin' ? 'Super admin' : 'Admin'}</div>
        </div>

        <nav className="admin-nav">
          {LINKS.map((l) => {
            const active = pathname === l.href || (l.href !== '/admin' && pathname.startsWith(l.href))
            const Icon = l.icon
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`admin-nav-link ${active ? 'is-active' : ''}`}
                onClick={() => setOpen(false)}
              >
                <Icon size={19} />
                {l.label}
              </Link>
            )
          })}
        </nav>

        <div className="admin-sidebar-foot">
          <a href="/" target="_blank" rel="noopener noreferrer" className="admin-nav-link">
            <ExternalLink size={19} />
            Ver tienda
          </a>
        </div>
      </aside>
    </>
  )
}
