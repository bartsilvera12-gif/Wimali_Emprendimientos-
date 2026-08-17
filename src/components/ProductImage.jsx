// Espacio de imagen de producto. Si el producto tiene `image`, la muestra;
// si no, dibuja un marcador de posición con el monograma y el nombre.
export default function ProductImage({ product, label, tone = 'light' }) {
  const name = label || (product && product.name) || ''
  if (product && product.image) {
    return <img className="pimg" src={product.image} alt={name} decoding="async" />
  }
  return (
    <div className={`pimg-ph pimg-ph--${tone}`} aria-hidden="true">
      <span className="pimg-ph-mark">{(name.trim().charAt(0) || 'W').toUpperCase()}</span>
      <span className="pimg-ph-label">{name}</span>
    </div>
  )
}
