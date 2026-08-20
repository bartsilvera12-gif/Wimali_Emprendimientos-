'use client'

import { useEffect, useState } from 'react'
import { StoreShell } from '@/components/store/StoreShell'
import { FavoritesView } from '@/components/store/FavoritesView'
import { getBusiness, getProducts } from '@/lib/queries'
import type { BusinessSettings, ProductWithRelations } from '@/lib/supabase/types'

export default function FavoritesPage() {
  const [business, setBusiness] = useState<BusinessSettings | null>(null)
  const [products, setProducts] = useState<ProductWithRelations[]>([])

  useEffect(() => {
    ;(async () => {
      const [biz, prods] = await Promise.all([getBusiness(), getProducts()])
      setBusiness(biz)
      setProducts(prods)
    })()
  }, [])

  const whatsapp = business?.whatsapp_number || '595995364978'

  return (
    <StoreShell whatsappNumber={whatsapp}>
      <FavoritesView products={products} />
    </StoreShell>
  )
}
