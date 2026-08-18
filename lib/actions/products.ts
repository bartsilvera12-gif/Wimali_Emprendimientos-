'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/format'

export interface ActionResult {
  ok: boolean
  error?: string
  id?: string
}

function str(fd: FormData, key: string): string {
  return (fd.get(key) ?? '').toString().trim()
}
function num(fd: FormData, key: string): number {
  const v = parseFloat(str(fd, key).replace(/\./g, '').replace(',', '.'))
  return Number.isFinite(v) ? v : 0
}
function bool(fd: FormData, key: string): boolean {
  const v = str(fd, key)
  return v === 'on' || v === 'true' || v === '1'
}

function revalidateStore() {
  revalidatePath('/', 'layout')
  revalidatePath('/admin/productos')
}

// Crea o actualiza un producto. Si viene `id`, actualiza.
export async function saveProduct(fd: FormData): Promise<ActionResult> {
  const supabase = await createClient()
  const id = str(fd, 'id')
  const name = str(fd, 'name')
  if (!name) return { ok: false, error: 'El nombre es obligatorio.' }

  let slug = slugify(str(fd, 'slug') || name)
  if (!slug) slug = slugify(name) || `producto-${Date.now()}`

  const categoryId = str(fd, 'category_id')
  const prev = num(fd, 'previous_price')

  const payload = {
    name,
    slug,
    sku: str(fd, 'sku') || null,
    category_id: categoryId || null,
    short_description: str(fd, 'short_description') || null,
    description: str(fd, 'description') || null,
    price: num(fd, 'price'),
    previous_price: prev > 0 ? prev : null,
    stock: Math.round(num(fd, 'stock')),
    featured: bool(fd, 'featured'),
    is_new: bool(fd, 'is_new'),
    is_offer: bool(fd, 'is_offer'),
    active: bool(fd, 'active'),
    sort_order: Math.round(num(fd, 'sort_order')),
  }

  if (id) {
    const { error } = await supabase.from('products').update(payload).eq('id', id)
    if (error) return { ok: false, error: error.message }
    await saveImages(id, fd)
    revalidateStore()
    return { ok: true, id }
  }

  const { data, error } = await supabase.from('products').insert(payload).select('id').single()
  if (error) return { ok: false, error: error.message }
  const newId = (data as { id: string }).id
  await saveImages(newId, fd)
  revalidateStore()
  return { ok: true, id: newId }
}

// Persiste las imágenes nuevas (subidas ya a Storage) enviadas como JSON.
async function saveImages(productId: string, fd: FormData) {
  const raw = str(fd, 'new_images')
  if (!raw) return
  let imgs: { path: string; url: string }[] = []
  try {
    imgs = JSON.parse(raw)
  } catch {
    return
  }
  if (!imgs.length) return

  const supabase = await createClient()
  const { count } = await supabase
    .from('product_images')
    .select('id', { count: 'exact', head: true })
    .eq('product_id', productId)
  const base = count ?? 0

  const rows = imgs.map((im, i) => ({
    product_id: productId,
    storage_path: im.path,
    public_url: im.url,
    is_primary: base === 0 && i === 0,
    sort_order: base + i,
  }))
  await supabase.from('product_images').insert(rows)
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }
  revalidateStore()
  return { ok: true }
}

export async function toggleProductActive(id: string, active: boolean): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('products').update({ active }).eq('id', id)
  if (error) return { ok: false, error: error.message }
  revalidateStore()
  return { ok: true }
}

export async function deleteProductImage(imageId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('product_images').delete().eq('id', imageId)
  if (error) return { ok: false, error: error.message }
  revalidateStore()
  return { ok: true }
}

export async function setPrimaryImage(productId: string, imageId: string): Promise<ActionResult> {
  const supabase = await createClient()
  await supabase.from('product_images').update({ is_primary: false }).eq('product_id', productId)
  const { error } = await supabase.from('product_images').update({ is_primary: true }).eq('id', imageId)
  if (error) return { ok: false, error: error.message }
  revalidateStore()
  return { ok: true }
}
