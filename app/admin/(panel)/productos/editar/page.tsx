'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ProductForm } from '@/components/admin/ProductForm'
import type { Category, Product, ProductImage } from '@/lib/supabase/types'

function EditarProducto() {
  const id = useSearchParams().get('id') ?? ''
  const [product, setProduct] = useState<Product | null>(null)
  const [images, setImages] = useState<ProductImage[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) {
      setNotFound(true)
      setLoading(false)
      return
    }
    const supabase = createClient()
    ;(async () => {
      const [{ data: prod }, { data: cats }, { data: imgs }] = await Promise.all([
        supabase.from('products').select('*').eq('id', id).maybeSingle(),
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('product_images').select('*').eq('product_id', id).order('sort_order'),
      ])
      if (!prod) {
        setNotFound(true)
      } else {
        setProduct(prod as Product)
        setImages((imgs as ProductImage[]) ?? [])
        setCategories((cats as Category[]) ?? [])
      }
      setLoading(false)
    })()
  }, [id])

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
      {loading ? (
        <p className="admin-empty">Cargando…</p>
      ) : notFound || !product ? (
        <p className="admin-empty">Producto no encontrado.</p>
      ) : (
        <ProductForm product={product} images={images} categories={categories} />
      )}
    </div>
  )
}

export default function EditarProductoPage() {
  return (
    <Suspense fallback={<div className="admin-page"><p className="admin-empty">Cargando…</p></div>}>
      <EditarProducto />
    </Suspense>
  )
}
