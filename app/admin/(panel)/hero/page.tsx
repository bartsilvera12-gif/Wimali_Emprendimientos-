import { createClient } from '@/lib/supabase/server'
import { HeroManager } from '@/components/admin/HeroManager'
import type { HeroProduct, Product, ProductImage } from '@/lib/supabase/types'

export const dynamic = 'force-dynamic'

export default async function HeroPage() {
  const supabase = await createClient()
  const [{ data: hero }, { data: prods }, { data: imgs }] = await Promise.all([
    supabase.from('hero_products').select('*').order('sort_order'),
    supabase.from('products').select('id,name,active').order('name'),
    supabase.from('product_images').select('product_id,public_url,is_primary'),
  ])
  const heroRows = (hero as HeroProduct[]) ?? []
  const products = (prods as Pick<Product, 'id' | 'name' | 'active'>[]) ?? []
  const imgList = (imgs as Pick<ProductImage, 'product_id' | 'public_url' | 'is_primary'>[]) ?? []
  const nameOf = new Map(products.map((p) => [p.id, p.name]))
  const imgOf = (pid: string) => {
    const list = imgList.filter((i) => i.product_id === pid)
    return (list.find((i) => i.is_primary) ?? list[0])?.public_url ?? null
  }

  const items = heroRows.map((h) => ({
    id: h.id,
    product_id: h.product_id,
    name: nameOf.get(h.product_id) ?? 'Producto',
    image: imgOf(h.product_id),
  }))
  const usedIds = new Set(heroRows.map((h) => h.product_id))
  const options = products.filter((p) => p.active && !usedIds.has(p.id)).map((p) => ({ id: p.id, name: p.name }))

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>Hero</h1>
          <p>Productos que aparecen destacados en la portada.</p>
        </div>
      </div>
      <HeroManager items={items} options={options} />
    </div>
  )
}
