import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CategoryForm } from '@/components/admin/CategoryForm'

export default function NuevaCategoriaPage() {
  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <Link href="/admin/categorias" className="admin-back">
            <ArrowLeft size={16} /> Categorías
          </Link>
          <h1>Nueva categoría</h1>
        </div>
      </div>
      <CategoryForm />
    </div>
  )
}
