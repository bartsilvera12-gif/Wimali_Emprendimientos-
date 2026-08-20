'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ProductForm } from '@/components/admin/ProductForm'
import type { Category } from '@/lib/supabase/types'

export default function NuevoProductoPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    createClient()
      .from('categories')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        setCategories((data as Category[]) ?? [])
        setLoading(false)
      })
  }, [])

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
      {loading ? <p className="admin-empty">Cargando…</p> : <ProductForm categories={categories} />}
    </div>
  )
}
