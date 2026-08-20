import { CategoryView } from '@/components/store/CategoryView'
import { getCategories } from '@/lib/queries'

export async function generateStaticParams() {
  try {
    const cats = await getCategories()
    return cats.map((c) => ({ slug: c.slug }))
  } catch {
    return []
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <CategoryView slug={slug} />
}
