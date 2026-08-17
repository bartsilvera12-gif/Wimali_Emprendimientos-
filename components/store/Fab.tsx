import { WaIcon } from './WaIcon'
import { waPlain } from '@/lib/whatsapp'

export function Fab({ whatsappNumber }: { whatsappNumber: string }) {
  return (
    <a className="fab-wa" href={waPlain(whatsappNumber)} target="_blank" rel="noopener noreferrer">
      <WaIcon size={24} />
      <span className="fab-text">¿Necesitás ayuda?</span>
    </a>
  )
}
