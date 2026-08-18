'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, X } from 'lucide-react'
import { addHeroProduct, removeHeroProduct } from '@/lib/actions/misc'

interface HeroItem {
  id: string // hero_products.id
  product_id: string
  name: string
  image: string | null
}
interface Option {
  id: string
  name: string
}

export function HeroManager({ items, options }: { items: HeroItem[]; options: Option[] }) {
  const router = useRouter()
  const [pending, setPending] = useState('')
  const [sel, setSel] = useState('')

  const add = async () => {
    if (!sel) return
    setPending('add')
    const r = await addHeroProduct(sel)
    setPending('')
    if (r.ok) {
      setSel('')
      router.refresh()
    } else alert(r.error || 'No se pudo agregar')
  }

  const remove = async (id: string) => {
    setPending(id)
    const r = await removeHeroProduct(id)
    setPending('')
    if (r.ok) router.refresh()
    else alert(r.error || 'No se pudo quitar')
  }

  return (
    <div>
      <div className="admin-hero-add">
        <select value={sel} onChange={(e) => setSel(e.target.value)}>
          <option value="">Elegí un producto…</option>
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
        <button className="admin-btn admin-btn--gold" onClick={add} disabled={!sel || pending === 'add'}>
          {pending === 'add' ? <Loader2 size={16} className="admin-spin" /> : <Plus size={16} />}
          Agregar al hero
        </button>
      </div>

      {items.length ? (
        <div className="admin-hero-grid">
          {items.map((it) => (
            <div className="admin-hero-card" key={it.id}>
              <button className="admin-hero-remove" onClick={() => remove(it.id)} disabled={pending === it.id} title="Quitar">
                {pending === it.id ? <Loader2 size={14} className="admin-spin" /> : <X size={14} />}
              </button>
              <div className="admin-hero-img">
                {it.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.image} alt="" />
                ) : (
                  <span className="admin-cell-img--empty" />
                )}
              </div>
              <div className="admin-hero-name">{it.name}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="admin-empty">No hay productos en el hero. Agregá algunos arriba.</p>
      )}
    </div>
  )
}
