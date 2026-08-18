import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { CategoryForm } from '@/components/admin/CategoryForm'
import type { Category } from '@/lib/supabase/types'

export const dynamic = 'force-dynamic'

export default async function EditarCategoriaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('categories').select('*').eq('id', id).maybeSingle()
  if (!data) notFound()

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <Link href="/admin/categorias" className="admin-back">
            <ArrowLeft size={16} /> Categorías
          </Link>
          <h1>Editar categoría</h1>
        </div>
      </div>
      <CategoryForm category={data as Category} />
    </div>
  )
}
