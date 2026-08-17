import { StoreShell } from '@/components/store/StoreShell'
import { FavoritesView } from '@/components/store/FavoritesView'
import { getBusiness, getProducts } from '@/lib/queries'

export const dynamic = 'force-dynamic'

export default async function FavoritesPage() {
  const [business, products] = await Promise.all([getBusiness(), getProducts()])
  const whatsapp = business?.whatsapp_number || '595995364978'
  return (
    <StoreShell whatsappNumber={whatsapp}>
      <FavoritesView products={products} />
    </StoreShell>
  )
}
