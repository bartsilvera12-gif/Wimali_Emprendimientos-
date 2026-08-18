import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/ProductForm'
import type { Category } from '@/lib/supabase/types'

export const dynamic = 'force-dynamic'

export default async function NuevoProductoPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('categories').select('*').order('sort_order')
  const categories = (data as Category[]) ?? []

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <Link href="/admin/productos" className="admin-back">
            <ArrowLeft size={16} /> Productos
          </Link>
          <h1>Nuevo producto</h1>
        </div>
      </div>
      <ProductForm categories={categories} />
    </div>
  )
}
