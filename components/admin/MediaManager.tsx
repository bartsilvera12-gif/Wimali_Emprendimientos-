'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Upload, Copy, Check } from 'lucide-react'
import { registerMedia, deleteMedia } from '@/lib/mutations'
import { uploadToStorage } from '@/lib/upload'
import { DeleteButton } from './RowActions'
import type { MediaAsset } from '@/lib/supabase/types'

export function MediaManager({ initial }: { initial: MediaAsset[] }) {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [copied, setCopied] = useState('')
  const [error, setError] = useState('')

  const onPick = async (files: FileList | null) => {
    if (!files || !files.length) return
    setUploading(true)
    setError('')
    try {
      for (const f of Array.from(files)) {
        const up = await uploadToStorage(f, 'media')
        const fd = new FormData()
        fd.set('name', up.name)
        fd.set('storage_path', up.path)
        fd.set('public_url', up.url)
        fd.set('mime_type', up.mime)
        fd.set('file_size', String(up.size))
        const r = await registerMedia(fd)
        if (!r.ok) throw new Error(r.error)
      }
      window.location.reload()
    } catch (e) {
      setError('Error: ' + (e as Error).message)
    } finally {
      setUploading(false)
    }
  }

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(url)
      setTimeout(() => setCopied(''), 1500)
    } catch {
      /* ignore */
    }
  }

  return (
    <div>
      {error && <div className="admin-alert">{error}</div>}
      <div className="admin-page-head">
        <div />
        <label className="admin-btn admin-btn--gold">
          {uploading ? <Loader2 size={16} className="admin-spin" /> : <Upload size={16} />}
          {uploading ? 'Subiendo…' : 'Subir imágenes'}
          <input type="file" accept="image/*" multiple hidden onChange={(e) => onPick(e.target.files)} />
        </label>
      </div>

      {initial.length ? (
        <div className="admin-media-grid">
          {initial.map((m) => (
            <div className="admin-media-card" key={m.id}>
              <div className="admin-media-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.public_url} alt={m.alt_text ?? ''} />
              </div>
              <div className="admin-media-foot">
                <span className="admin-media-name" title={m.name ?? ''}>
                  {m.name ?? 'archivo'}
                </span>
                <div className="admin-row-actions">
                  <button className="admin-icon-btn" title="Copiar URL" onClick={() => copy(m.public_url)}>
                    {copied === m.public_url ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                  <DeleteButton action={deleteMedia.bind(null, m.id)} message="¿Eliminar de la biblioteca?" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="admin-empty">La biblioteca está vacía. Subí tu primera imagen.</p>
      )}
    </div>
  )
}
