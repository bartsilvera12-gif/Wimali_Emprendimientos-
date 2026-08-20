'use client'

// Mutaciones del panel admin ejecutadas 100% en el navegador con el cliente
// de Supabase (anon key + sesión del admin). La seguridad la garantiza RLS
// (is_admin()). Reemplaza a las antiguas Server Actions (export estático).

import { createClient } from '@/lib/supabase/client'
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

/* ==================== PRODUCTOS ==================== */

export async function saveProduct(fd: FormData): Promise<ActionResult> {
  const supabase = createClient()
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

  let productId = id
  if (id) {
    const { error } = await supabase.from('products').update(payload).eq('id', id)
    if (error) return { ok: false, error: error.message }
  } else {
    const { data, error } = await supabase.from('products').insert(payload).select('id').single()
    if (error) return { ok: false, error: error.message }
    productId = (data as { id: string }).id
  }
  await saveImages(productId, fd)
  return { ok: true, id: productId }
}

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
  const supabase = createClient()
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
  const supabase = createClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function toggleProductActive(id: string, active: boolean): Promise<ActionResult> {
  const supabase = createClient()
  const { error } = await supabase.from('products').update({ active }).eq('id', id)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function deleteProductImage(imageId: string): Promise<ActionResult> {
  const supabase = createClient()
  const { error } = await supabase.from('product_images').delete().eq('id', imageId)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function setPrimaryImage(productId: string, imageId: string): Promise<ActionResult> {
  const supabase = createClient()
  await supabase.from('product_images').update({ is_primary: false }).eq('product_id', productId)
  const { error } = await supabase.from('product_images').update({ is_primary: true }).eq('id', imageId)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

/* ==================== CATEGORIAS ==================== */

export async function saveCategory(fd: FormData): Promise<ActionResult> {
  const supabase = createClient()
  const id = str(fd, 'id')
  const name = str(fd, 'name')
  if (!name) return { ok: false, error: 'El nombre es obligatorio.' }
  const slug = slugify(str(fd, 'slug') || name) || `categoria-${Date.now()}`
  const payload = {
    name,
    slug,
    description: str(fd, 'description') || null,
    image_url: str(fd, 'image_url') || null,
    image_path: str(fd, 'image_path') || null,
    active: bool(fd, 'active'),
    sort_order: parseInt(str(fd, 'sort_order') || '0', 10) || 0,
  }
  if (id) {
    const { error } = await supabase.from('categories').update(payload).eq('id', id)
    if (error) return { ok: false, error: error.message }
  } else {
    const { error } = await supabase.from('categories').insert(payload)
    if (error) return { ok: false, error: error.message }
  }
  return { ok: true }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const supabase = createClient()
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function toggleCategoryActive(id: string, active: boolean): Promise<ActionResult> {
  const supabase = createClient()
  const { error } = await supabase.from('categories').update({ active }).eq('id', id)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

/* ==================== HERO ==================== */

export async function addHeroProduct(productId: string): Promise<ActionResult> {
  const supabase = createClient()
  const { count } = await supabase.from('hero_products').select('id', { count: 'exact', head: true })
  const { error } = await supabase
    .from('hero_products')
    .insert({ product_id: productId, sort_order: count ?? 0, active: true })
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function removeHeroProduct(id: string): Promise<ActionResult> {
  const supabase = createClient()
  const { error } = await supabase.from('hero_products').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

/* ==================== SECCIONES / BENEFICIOS ==================== */

export async function saveSection(fd: FormData): Promise<ActionResult> {
  const supabase = createClient()
  const id = str(fd, 'id')
  if (!id) return { ok: false, error: 'Sección inválida.' }
  const payload = {
    eyebrow: str(fd, 'eyebrow') || null,
    title: str(fd, 'title') || null,
    subtitle: str(fd, 'subtitle') || null,
    body: str(fd, 'body') || null,
    button_text: str(fd, 'button_text') || null,
    button_url: str(fd, 'button_url') || null,
  }
  const { error } = await supabase.from('site_sections').update(payload).eq('id', id)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function saveBenefit(fd: FormData): Promise<ActionResult> {
  const supabase = createClient()
  const id = str(fd, 'id')
  const title = str(fd, 'title')
  if (!title) return { ok: false, error: 'El título es obligatorio.' }
  const payload = {
    title,
    description: str(fd, 'description') || null,
    icon: str(fd, 'icon') || null,
    active: bool(fd, 'active'),
    sort_order: parseInt(str(fd, 'sort_order') || '0', 10) || 0,
  }
  if (id) {
    const { error } = await supabase.from('benefits').update(payload).eq('id', id)
    if (error) return { ok: false, error: error.message }
  } else {
    const { error } = await supabase.from('benefits').insert(payload)
    if (error) return { ok: false, error: error.message }
  }
  return { ok: true }
}

export async function deleteBenefit(id: string): Promise<ActionResult> {
  const supabase = createClient()
  const { error } = await supabase.from('benefits').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

/* ==================== NEGOCIO ==================== */

export async function saveBusiness(fd: FormData): Promise<ActionResult> {
  const supabase = createClient()
  const id = str(fd, 'id')
  const payload = {
    business_name: str(fd, 'business_name'),
    whatsapp_number: str(fd, 'whatsapp_number'),
    phone_display: str(fd, 'phone_display') || null,
    address: str(fd, 'address') || null,
    map_query: str(fd, 'map_query') || null,
    google_maps_url: str(fd, 'google_maps_url') || null,
    opening_hours: str(fd, 'opening_hours') || null,
    shipping_text: str(fd, 'shipping_text') || null,
    payment_text: str(fd, 'payment_text') || null,
    seo_title: str(fd, 'seo_title') || null,
    seo_description: str(fd, 'seo_description') || null,
  }
  if (id) {
    const { error } = await supabase.from('business_settings').update(payload).eq('id', id)
    if (error) return { ok: false, error: error.message }
  } else {
    const { error } = await supabase.from('business_settings').insert(payload)
    if (error) return { ok: false, error: error.message }
  }
  return { ok: true }
}

/* ==================== REDES ==================== */

export async function saveSocial(fd: FormData): Promise<ActionResult> {
  const supabase = createClient()
  const id = str(fd, 'id')
  const url = str(fd, 'url')
  const platform = str(fd, 'platform')
  if (!platform || !url) return { ok: false, error: 'Plataforma y URL son obligatorias.' }
  const payload = {
    platform,
    label: str(fd, 'label') || null,
    url,
    icon: str(fd, 'icon') || null,
    active: bool(fd, 'active'),
    sort_order: parseInt(str(fd, 'sort_order') || '0', 10) || 0,
  }
  if (id) {
    const { error } = await supabase.from('social_links').update(payload).eq('id', id)
    if (error) return { ok: false, error: error.message }
  } else {
    const { error } = await supabase.from('social_links').insert(payload)
    if (error) return { ok: false, error: error.message }
  }
  return { ok: true }
}

export async function toggleSocialActive(id: string, active: boolean): Promise<ActionResult> {
  const supabase = createClient()
  const { error } = await supabase.from('social_links').update({ active }).eq('id', id)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function deleteSocial(id: string): Promise<ActionResult> {
  const supabase = createClient()
  const { error } = await supabase.from('social_links').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

/* ==================== MEDIA ==================== */

export async function registerMedia(fd: FormData): Promise<ActionResult> {
  const supabase = createClient()
  const payload = {
    name: str(fd, 'name') || null,
    storage_path: str(fd, 'storage_path'),
    public_url: str(fd, 'public_url'),
    mime_type: str(fd, 'mime_type') || null,
    file_size: parseInt(str(fd, 'file_size') || '0', 10) || null,
    alt_text: str(fd, 'alt_text') || null,
  }
  if (!payload.storage_path || !payload.public_url) return { ok: false, error: 'Archivo inválido.' }
  const { error } = await supabase.from('media_assets').insert(payload)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function deleteMedia(id: string): Promise<ActionResult> {
  const supabase = createClient()
  const { error } = await supabase.from('media_assets').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
