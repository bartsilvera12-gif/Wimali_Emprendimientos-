import { waPlain } from '../utils.js'
import { WaIcon } from './Icons.jsx'

export default function Fab() {
  return (
    <a className="fab-wa" href={waPlain} target="_blank" rel="noopener noreferrer">
      <WaIcon size={24} />
      <span className="fab-text">¿Necesitás ayuda?</span>
    </a>
  )
}
