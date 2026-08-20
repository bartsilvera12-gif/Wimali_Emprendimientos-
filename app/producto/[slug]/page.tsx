import { ProductPageClient } from '@/components/store/ProductPageClient'
import { getProducts } from '@/lib/queries'

export async function generateStaticParams() {
  try {
    const products = await getProducts()
    return products.map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <ProductPageClient slug={slug} />
}
