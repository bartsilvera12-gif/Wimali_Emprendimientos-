'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  qty: number
  stock: number
}

interface StoreState {
  cart: CartItem[]
  favs: string[]
  cartOpen: boolean
  count: number
  total: number
  add: (p: { id: string; name: string; price: number; stock: number }, qty?: number) => void
  changeQty: (id: string, delta: number) => void
  removeItem: (id: string) => void
  toggleCart: () => void
  setCartOpen: (v: boolean) => void
  toggleFav: (id: string) => void
  isFav: (id: string) => boolean
}

const StoreCtx = createContext<StoreState | null>(null)
export const useStore = () => {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error('useStore debe usarse dentro de <StoreProvider>')
  return ctx
}

const read = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [favs, setFavs] = useState<string[]>([])
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    setCart(read<CartItem[]>('wimali-cart', []))
    setFavs(read<string[]>('wimali-favs', []))
  }, [])

  const persistCart = (next: CartItem[]) => {
    try {
      localStorage.setItem('wimali-cart', JSON.stringify(next))
    } catch {
      /* almacenamiento no disponible */
    }
  }
  const persistFavs = (next: string[]) => {
    try {
      localStorage.setItem('wimali-favs', JSON.stringify(next))
    } catch {
      /* almacenamiento no disponible */
    }
  }

  const add: StoreState['add'] = useCallback((p, qty = 1) => {
    setCart((prev) => {
      const i = prev.findIndex((c) => c.id === p.id)
      let next: CartItem[]
      if (i >= 0) {
        const maxQty = Math.max(1, p.stock)
        const newQty = Math.min(prev[i].qty + qty, maxQty)
        next = prev.map((c, idx) => (idx === i ? { ...c, qty: newQty, stock: p.stock } : c))
      } else {
        next = [...prev, { id: p.id, name: p.name, price: p.price, qty: Math.min(qty, Math.max(1, p.stock)), stock: p.stock }]
      }
      persistCart(next)
      return next
    })
    setCartOpen(true)
  }, [])

  const changeQty: StoreState['changeQty'] = useCallback((id, delta) => {
    setCart((prev) => {
      const next = prev
        .map((c) => {
          if (c.id !== id) return c
          const maxQty = Math.max(1, c.stock)
          return { ...c, qty: Math.min(Math.max(0, c.qty + delta), maxQty) }
        })
        .filter((c) => c.qty > 0)
      persistCart(next)
      return next
    })
  }, [])

  const removeItem: StoreState['removeItem'] = useCallback((id) => {
    setCart((prev) => {
      const next = prev.filter((c) => c.id !== id)
      persistCart(next)
      return next
    })
  }, [])

  const toggleFav: StoreState['toggleFav'] = useCallback((id) => {
    setFavs((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
      persistFavs(next)
      return next
    })
  }, [])

  const count = cart.reduce((s, c) => s + c.qty, 0)
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0)

  const value: StoreState = {
    cart,
    favs,
    cartOpen,
    count,
    total,
    add,
    changeQty,
    removeItem,
    toggleCart: () => setCartOpen((v) => !v),
    setCartOpen,
    toggleFav,
    isFav: (id) => favs.includes(id),
  }

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}
