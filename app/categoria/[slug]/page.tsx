import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { StoreShell } from '@/components/store/StoreShell'
import { ProductCard } from '@/components/store/ProductCard'
import { getBusiness, getCategoryBySlug, getProductsByCategory } from '@/lib/queries'

export const revalidate = 300

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [category, business] = await Promise.all([getCategoryBySlug(slug), getBusiness()])
  if (!category) notFound()

  const allProducts = await getProductsByCategory(category.id)
  // Ocultar productos sin imagen.
  const products = allProducts.filter((p) => Array.isArray(p.images) && p.images.length > 0)
  const whatsapp = business?.whatsapp_number || '595995364978'

  return (
    <StoreShell whatsappNumber={whatsapp}>
      <main className="section section--catalog" style={{ paddingTop: 'clamp(24px, 4vw, 44px)' }}>
        <div className="section-inner">
          <Link href="/#categorias" className="pv-back">
            <ArrowLeft size={18} />
            Volver a categorías
          </Link>

          <div className="catalog-head" style={{ marginTop: 18 }}>
            <div>
              <div className="kicker">CATEGORÍA</div>
              <h2 className="h2">{category.name}</h2>
            </div>
            <div className="catalog-tools">
              <span className="result-label">
                {products.length === 1 ? '1 producto' : `${products.length} productos`}
              </span>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="prod-grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="catalog-empty">
              <div className="catalog-empty-title">Todavía no hay productos en esta categoría</div>
              <p>Pronto vas a encontrar productos acá.</p>
            </div>
          )}
        </div>
      </main>
    </StoreShell>
  )
}
