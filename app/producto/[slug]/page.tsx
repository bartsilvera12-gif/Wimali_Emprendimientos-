import { notFound } from 'next/navigation'
import { StoreShell } from '@/components/store/StoreShell'
import { ProductView } from '@/components/store/ProductView'
import { getBusiness, getProductBySlug } from '@/lib/queries'

export const dynamic = 'force-dynamic'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [product, business] = await Promise.all([getProductBySlug(slug), getBusiness()])

  if (!product) notFound()

  const whatsapp = business?.whatsapp_number || '595995364978'

  return (
    <StoreShell whatsappNumber={whatsapp}>
      <ProductView product={product} whatsappNumber={whatsapp} />
    </StoreShell>
  )
}
