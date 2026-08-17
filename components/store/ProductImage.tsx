// Imagen de producto con placeholder elegante si no hay foto.
export function ProductImage({
  src,
  name,
  tone = 'light',
}: {
  src?: string | null
  name?: string | null
  tone?: 'light' | 'dark'
}) {
  const label = name || ''
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="pimg" src={src} alt={label} decoding="async" />
  }
  return (
    <div className={`pimg-ph pimg-ph--${tone}`} aria-hidden="true">
      <span className="pimg-ph-mark">{(label.trim().charAt(0) || 'W').toUpperCase()}</span>
      <span className="pimg-ph-label">{label}</span>
    </div>
  )
}
