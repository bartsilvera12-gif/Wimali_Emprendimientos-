'use client'

import { StoreProvider } from './StoreProvider'
import { Header } from './Header'
import { CartDrawer } from './CartDrawer'
import { SearchOverlay } from './SearchOverlay'
import { PageBackground } from './PageBackground'
import { Fab } from './Fab'

// Envuelve la tienda con el estado de carrito/favoritos + header + carrito + FAB.
export function StoreShell({
  whatsappNumber,
  children,
}: {
  whatsappNumber: string
  children: React.ReactNode
}) {
  return (
    <StoreProvider>
      <div className="app">
        <PageBackground />
        <Header whatsappNumber={whatsappNumber} />
        {children}
        <CartDrawer whatsappNumber={whatsappNumber} />
        <SearchOverlay />
        <Fab whatsappNumber={whatsappNumber} />
      </div>
    </StoreProvider>
  )
}
