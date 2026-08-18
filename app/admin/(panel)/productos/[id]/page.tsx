import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/ProductForm'
import type { Category, Product, ProductImage } from '@/lib/supabase/types'

export const dynamic = 'force-dynamic'

export default async function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const [{ data: prod }, { data: cats }, { data: imgs }] = await Promise.all([
    supabase.from('products').select('*').eq('id', id).maybeSingle(),
    supabase.from('categories').select('*').order('sort_order'),
    supabase.from('product_images').select('*').eq('product_id', id).order('sort_order'),
  ])
  if (!prod) notFound()

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <Link href="/admin/productos" className="admin-back">
            <ArrowLeft size={16} /> Productos
          </Link>
          <h1>Editar producto</h1>
        </div>
      </div>
      <ProductForm
        product={prod as Product}
        images={(imgs as ProductImage[]) ?? []}
        categories={(cats as Category[]) ?? []}
      />
    </div>
  )
}
