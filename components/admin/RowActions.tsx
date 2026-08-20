'use client'

import { useState, useTransition } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import type { ActionResult } from '@/lib/mutations'

// Botón de eliminar con confirmación. Recibe una server action ya "bindeada".
export function DeleteButton({
  action,
  message = '¿Eliminar este elemento? Esta acción no se puede deshacer.',
  compact = false,
}: {
  action: () => Promise<ActionResult>
  message?: string
  compact?: boolean
}) {
  const [pending, start] = useTransition()

  const onClick = () => {
    if (!confirm(message)) return
    start(async () => {
      const r = await action()
      if (r.ok) window.location.reload()
      else alert(r.error || 'No se pudo eliminar')
    })
  }

  return (
    <button
      type="button"
      className={`admin-icon-btn admin-icon-btn--danger ${compact ? 'is-compact' : ''}`}
      onClick={onClick}
      disabled={pending}
      title="Eliminar"
    >
      {pending ? <Loader2 size={16} className="admin-spin" /> : <Trash2 size={16} />}
    </button>
  )
}

// Interruptor de activo/inactivo.
export function ToggleActive({
  active,
  action,
}: {
  active: boolean
  action: (next: boolean) => Promise<ActionResult>
}) {
  const [on, setOn] = useState(active)
  const [pending, start] = useTransition()

  const toggle = () => {
    const next = !on
    setOn(next)
    start(async () => {
      const r = await action(next)
      if (r.ok) window.location.reload()
      else {
        setOn(!next)
        alert(r.error || 'No se pudo actualizar')
      }
    })
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      className={`admin-switch ${on ? 'is-on' : ''}`}
      onClick={toggle}
      disabled={pending}
      title={on ? 'Activo' : 'Inactivo'}
    >
      <span className="admin-switch-dot" />
    </button>
  )
}
