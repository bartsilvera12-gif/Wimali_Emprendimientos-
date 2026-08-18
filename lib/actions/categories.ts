'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/format'
import type { ActionResult } from './products'

function str(fd: FormData, key: string): string {
  return (fd.get(key) ?? '').toString().trim()
}
function bool(fd: FormData, key: string): boolean {
  const v = str(fd, key)
  return v === 'on' || v === 'true' || v === '1'
}
function revalidateStore() {
  revalidatePath('/', 'layout')
  revalidatePath('/admin/categorias')
}

export async function saveCategory(fd: FormData): Promise<ActionResult> {
  const supabase = await createClient()
  const id = str(fd, 'id')
  const name = str(fd, 'name')
  if (!name) return { ok: false, error: 'El nombre es obligatorio.' }

  const slug = slugify(str(fd, 'slug') || name) || `categoria-${Date.now()}`
  const imgUrl = str(fd, 'image_url')
  const imgPath = str(fd, 'image_path')

  const payload = {
    name,
    slug,
    description: str(fd, 'description') || null,
    image_url: imgUrl || null,
    image_path: imgPath || null,
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
  revalidateStore()
  return { ok: true }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }
  revalidateStore()
  return { ok: true }
}

export async function toggleCategoryActive(id: string, active: boolean): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('categories').update({ active }).eq('id', id)
  if (error) return { ok: false, error: error.message }
  revalidateStore()
  return { ok: true }
}
