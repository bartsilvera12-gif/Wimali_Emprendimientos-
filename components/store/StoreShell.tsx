'use client'

import { StoreProvider } from './StoreProvider'
import { Header } from './Header'
import { CartDrawer } from './CartDrawer'
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
        <Header whatsappNumber={whatsappNumber} />
        {children}
        <CartDrawer whatsappNumber={whatsappNumber} />
        <Fab whatsappNumber={whatsappNumber} />
      </div>
    </StoreProvider>
  )
}
