'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult } from './products'

function str(fd: FormData, key: string): string {
  return (fd.get(key) ?? '').toString().trim()
}
function bool(fd: FormData, key: string): boolean {
  const v = str(fd, key)
  return v === 'on' || v === 'true' || v === '1'
}
function revalidateAll() {
  revalidatePath('/', 'layout')
}

/* ---------------- HERO ---------------- */

export async function addHeroProduct(productId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { count } = await supabase
    .from('hero_products')
    .select('id', { count: 'exact', head: true })
  const { error } = await supabase
    .from('hero_products')
    .insert({ product_id: productId, sort_order: count ?? 0, active: true })
  if (error) return { ok: false, error: error.message }
  revalidateAll()
  return { ok: true }
}

export async function removeHeroProduct(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('hero_products').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }
  revalidateAll()
  return { ok: true }
}

/* ---------------- SECCIONES ---------------- */

export async function saveSection(fd: FormData): Promise<ActionResult> {
  const supabase = await createClient()
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
  revalidateAll()
  return { ok: true }
}

/* ---------------- BENEFICIOS ---------------- */

export async function saveBenefit(fd: FormData): Promise<ActionResult> {
  const supabase = await createClient()
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
  revalidateAll()
  return { ok: true }
}

export async function deleteBenefit(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('benefits').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }
  revalidateAll()
  return { ok: true }
}

/* ---------------- NEGOCIO ---------------- */

export async function saveBusiness(fd: FormData): Promise<ActionResult> {
  const supabase = await createClient()
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
  revalidateAll()
  return { ok: true }
}

/* ---------------- REDES ---------------- */

export async function saveSocial(fd: FormData): Promise<ActionResult> {
  const supabase = await createClient()
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
  revalidateAll()
  return { ok: true }
}

export async function toggleSocialActive(id: string, active: boolean): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('social_links').update({ active }).eq('id', id)
  if (error) return { ok: false, error: error.message }
  revalidateAll()
  return { ok: true }
}

export async function deleteSocial(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('social_links').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }
  revalidateAll()
  return { ok: true }
}

/* ---------------- MEDIA ---------------- */

export async function registerMedia(fd: FormData): Promise<ActionResult> {
  const supabase = await createClient()
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
  revalidatePath('/admin/media')
  return { ok: true }
}

export async function deleteMedia(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('media_assets').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/admin/media')
  return { ok: true }
}
