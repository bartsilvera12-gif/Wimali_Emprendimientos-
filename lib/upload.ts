'use client'

import { createClient } from '@/lib/supabase/client'
import { STORAGE_BUCKET } from '@/lib/constants'

export interface UploadedFile {
  path: string
  url: string
  name: string
  size: number
  mime: string
}

// Sube un archivo al bucket de Storage y devuelve su ruta + URL pública.
// Usa la sesión del admin (cookies) → las policies de Storage lo autorizan.
export async function uploadToStorage(file: File, folder = 'productos'): Promise<UploadedFile> {
  const supabase = createClient()
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase()
  const rand = Math.random().toString(36).slice(2, 10)
  const stamp = `${folder}/${Date.now()}-${rand}.${ext}`

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(stamp, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  })
  if (error) throw new Error(error.message)

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(stamp)
  return {
    path: stamp,
    url: data.publicUrl,
    name: file.name,
    size: file.size,
    mime: file.type || 'application/octet-stream',
  }
}
