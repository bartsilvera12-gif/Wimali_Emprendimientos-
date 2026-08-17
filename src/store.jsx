import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { PRODUCTS } from './data/products.js'
import { orderMessage, wa, scrollToId } from './utils.js'
import { smartSearch } from './search.js'

const StoreCtx = createContext(null)
export const useStore = () => useContext(StoreCtx)

export function StoreProvider({ children }) {
  const [view, setView] = useState('home') // 'home' | 'product'
  const [slug, setSlug] = useState(null)
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState(null)
  const [qty, setQty] = useState(1)
  const [cart, setCart] = useState([])
  const [favs, setFavs] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 1140,
  )
  const searchRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    const onResize = () => setIsMobile(window.innerWidth < 1140)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('wimali-cart') || '[]')
      if (Array.isArray(saved) && saved.length) setCart(saved)
      const savedFavs = JSON.parse(localStorage.getItem('wimali-favs') || '[]')
      if (Array.isArray(savedFavs) && savedFavs.length) setFavs(savedFavs)
    } catch {
      // almacenamiento no disponible
    }
  }, [])

  const toggleFav = id => {
    setFavs(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
      try {
        localStorage.setItem('wimali-favs', JSON.stringify(next))
      } catch {
        // almacenamiento no disponible
      }
      return next
    })
  }

  const persist = c => {
    try {
      localStorage.setItem('wimali-cart', JSON.stringify(c))
    } catch {
      // almacenamiento no disponible
    }
  }

  const active = PRODUCTS.filter(p => p.stock !== null)
  const q = query.trim()
  let list = active
  if (cat) list = list.filter(p => p.category === cat)
  if (q) list = smartSearch(list, q)
  const offers = active.filter(p => p.previous_price && p.stock > 0).slice(0, 4)
  const favProducts = active.filter(p => favs.includes(p.id))
  const current = PRODUCTS.find(p => p.slug === slug) || PRODUCTS[0]
  const count = cart.reduce((s, c) => s + c.qty, 0)
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0)
  const waOrder = count > 0 ? wa(orderMessage(cart)) : wa('Hola WIMALI 👋 Quiero hacer una consulta.')

  const openProduct = pSlug => {
    setView('product')
    setSlug(pSlug)
    setQty(1)
    setMenuOpen(false)
    setCartOpen(false)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }
  const goHome = () => {
    setView('home')
    setMenuOpen(false)
    setCartOpen(false)
  }
  const goToSection = id => {
    setView('home')
    setMenuOpen(false)
    setTimeout(() => scrollToId(id), 80)
  }
  const goFavorites = () => {
    setView('favorites')
    setMenuOpen(false)
    setCartOpen(false)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }
  const add = (p, addQty = 1) => {
    setCart(prev => {
      const i = prev.findIndex(c => c.id === p.id)
      const next =
        i >= 0
          ? prev.map((c, idx) => (idx === i ? { ...c, qty: c.qty + addQty } : c))
          : [...prev, { id: p.id, name: p.name, price: p.price, qty: addQty }]
      persist(next)
      return next
    })
    setCartOpen(true)
  }
  const changeQty = (id, d) => {
    setCart(prev => {
      const next = prev
        .map(c => (c.id === id ? { ...c, qty: c.qty + d } : c))
        .filter(c => c.qty > 0)
      persist(next)
      return next
    })
  }
  const removeItem = id => {
    setCart(prev => {
      const next = prev.filter(c => c.id !== id)
      persist(next)
      return next
    })
  }
  const toggleCart = () => {
    setCartOpen(v => !v)
    setMenuOpen(false)
  }
  const toggleMenu = () => setMenuOpen(v => !v)
  const closeMenu = () => setMenuOpen(false)
  const focusSearch = () => {
    setView('home')
    setMenuOpen(false)
    setCartOpen(false)
    setTimeout(() => {
      const el = searchRef.current
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 160
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
        el.focus({ preventScroll: true })
      }
    }, 80)
  }
  const pickCategory = name => {
    setCat(name)
    setView('home')
    setQuery('')
    setTimeout(() => scrollToId('productos'), 80)
  }
  const clearFilters = () => {
    setCat(null)
    setQuery('')
  }
  const browse = () => {
    setCartOpen(false)
    setView('home')
    setTimeout(() => scrollToId('productos'), 80)
  }

  const value = {
    view, slug, query, setQuery, cat, qty, setQty,
    cart, favs, favProducts, toggleFav,
    cartOpen, menuOpen, scrolled, isMobile, searchRef,
    active, list, offers, current, count, total, waOrder,
    openProduct, goHome, goToSection, goFavorites, add, changeQty, removeItem,
    toggleCart, toggleMenu, closeMenu, focusSearch,
    pickCategory, clearFilters, browse,
  }
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}
