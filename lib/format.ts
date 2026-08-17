// Formato de moneda en Guaraníes (PYG): "Gs. 165.000".
export function formatPYG(value: number | null | undefined): string {
  const n = Number(value ?? 0)
  return 'Gs. ' + Math.round(n).toLocaleString('es-PY').replace(/,/g, '.')
}

// Porcentaje de descuento entre precio anterior y actual.
export function discountPercent(price: number, previousPrice: number | null): number {
  if (!previousPrice || previousPrice <= 0 || previousPrice <= price) return 0
  return Math.round((1 - price / previousPrice) * 100)
}

// Genera un slug a partir de un texto: "Auricular Bluetooth TWS" -> "auricular-bluetooth-tws".
export function slugify(text: string): string {
  return (text || '')
    .toString()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Etiqueta de stock para la ficha pública.
export function stockLabel(stock: number, lowThreshold = 6): string {
  if (stock <= 0) return 'Agotado'
  if (stock <= lowThreshold) return `Últimas ${stock} unidades`
  return 'Disponible ahora'
}

// Imagen principal de un producto (o la primera disponible). Client-safe.
export function primaryImage(product: {
  images?: { public_url: string; is_primary: boolean }[]
}): string | null {
  const imgs = product.images ?? []
  const primary = imgs.find((i) => i.is_primary) ?? imgs[0]
  return primary?.public_url ?? null
}
