'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Search, X } from 'lucide-react'
import { useStore } from './StoreProvider'
import { ProductImage } from './ProductImage'
import { createClient } from '@/lib/supabase/client'
import { formatPYG, primaryImage } from '@/lib/format'
import type { ProductWithRelations } from '@/lib/supabase/types'

const norm = (s: string) =>
  (s || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')

const PRODUCT_SELECT =
  '*, category:categories(id,name,slug), images:product_images(id,public_url,is_primary,sort_order)'

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useStore()
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState<ProductWithRelations[] | null>(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Carga los productos la primera vez que se abre.
  useEffect(() => {
    if (!searchOpen || products !== null) return
    setLoading(true)
    const run = async () => {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('products')
          .select(PRODUCT_SELECT)
          .eq('active', true)
          .order('sort_order', { ascending: true })
        const list = ((data as ProductWithRelations[]) ?? []).filter(
          (p) => Array.isArray(p.images) && p.images.length > 0,
        )
        setProducts(list)
      } catch {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [searchOpen, products])

  // Foco al input + cerrar con Escape.
  useEffect(() => {
    if (!searchOpen) return
    const t = setTimeout(() => inputRef.current?.focus(), 60)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      document.removeEventListener('keydown', onKey)
    }
  }, [searchOpen, setSearchOpen])

  if (!searchOpen) return null

  const q = norm(query.trim())
  const results = q
    ? (products ?? []).filter((p) =>
        norm(`${p.name} ${p.category?.name ?? ''} ${p.description ?? ''}`).includes(q),
      )
    : []

  const close = () => {
    setSearchOpen(false)
    setQuery('')
  }

  return (
    <div className="search-overlay">
      <div className="search-overlay-backdrop" onClick={close} />
      <div className="search-overlay-panel">
        <div className="search-overlay-bar">
          <Search size={22} color="#8a8a8a" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscá un producto…"
            aria-label="Buscar productos"
          />
          <button className="search-overlay-close" onClick={close} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <div className="search-overlay-results">
          {loading && <div className="search-overlay-msg">Cargando productos…</div>}

          {!loading && !q && (
            <div className="search-overlay-msg">Escribí para buscar entre los productos.</div>
          )}

          {!loading && q && results.length === 0 && (
            <div className="search-overlay-msg">No encontramos productos para “{query.trim()}”.</div>
          )}

          {results.map((p) => (
            <Link key={p.id} href={`/producto/${p.slug}`} className="search-result" onClick={close}>
              <span className="search-result-img">
                <ProductImage src={primaryImage(p)} name={p.name} />
              </span>
              <span className="search-result-info">
                <span className="search-result-name">{p.name}</span>
                <span className="search-result-cat">{p.category?.name ?? ''}</span>
              </span>
              <span className="search-result-price">{formatPYG(p.price)}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
