import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store.jsx'
import { fmt, scrollToId } from '../utils.js'
import { smartSearch } from '../search.js'
import { SearchIcon } from './Icons.jsx'
import ProductImage from './ProductImage.jsx'

export default function SearchBar() {
  const { query, setQuery, searchRef, active, openProduct } = useStore()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  const suggestions = query.trim() ? smartSearch(active, query.trim()).slice(0, 6) : []

  // cerrar el panel al hacer clic fuera
  useEffect(() => {
    const onDown = e => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const pick = p => {
    setOpen(false)
    openProduct(p.slug)
  }

  return (
    <div className="search-wrap">
      <div className="search-box" ref={wrapRef}>
        <div className="search-bar">
          <SearchIcon size={22} stroke="#8a8a8a" />
          <input
            ref={searchRef}
            value={query}
            onChange={e => {
              setQuery(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={e => {
              if (e.key === 'Escape') setOpen(false)
              if (e.key === 'Enter') {
                setOpen(false)
                scrollToId('productos')
              }
            }}
            placeholder=""
            aria-label="Buscar productos"
          />
          <button
            className="search-go"
            onClick={() => {
              setOpen(false)
              scrollToId('productos')
            }}
          >
            Buscar
          </button>
        </div>

        {open && query.trim() && (
          <div className="search-suggest">
            {suggestions.map(p => (
              <button key={p.id} className="search-suggest-item" onClick={() => pick(p)}>
                <span className="search-suggest-img">
                  <ProductImage product={p} />
                </span>
                <span className="search-suggest-info">
                  <span className="search-suggest-name">{p.name}</span>
                  <span className="search-suggest-cat">{p.category}</span>
                </span>
                <span className="search-suggest-price">{fmt(p.price)}</span>
              </button>
            ))}
            {suggestions.length === 0 && (
              <div className="search-suggest-empty">
                Sin resultados para “{query.trim()}”. Probá con otra palabra o escribinos por
                WhatsApp.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
