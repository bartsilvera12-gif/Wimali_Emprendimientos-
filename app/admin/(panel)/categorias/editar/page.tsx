'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { CategoryForm } from '@/components/admin/CategoryForm'
import type { Category } from '@/lib/supabase/types'

function EditarCategoria() {
  const id = useSearchParams().get('id') ?? ''
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    createClient()
      .from('categories')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data }) => {
        setCategory((data as Category) ?? null)
        setLoading(false)
      })
  }, [id])

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
      {loading ? (
        <p className="admin-empty">Cargando…</p>
      ) : !category ? (
        <p className="admin-empty">Categoría no encontrada.</p>
      ) : (
        <CategoryForm category={category} />
      )}
    </div>
  )
}

export default function EditarCategoriaPage() {
  return (
    <Suspense fallback={<div className="admin-page"><p className="admin-empty">Cargando…</p></div>}>
      <EditarCategoria />
    </Suspense>
  )
}
