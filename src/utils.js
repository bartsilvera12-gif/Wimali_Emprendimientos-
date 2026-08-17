import { BUSINESS } from './config.js'

export const fmt = n => 'Gs. ' + Math.round(n).toLocaleString('es-PY').replace(/,/g, '.')

export const phoneDigits = () => (BUSINESS.whatsappNumber || '').replace(/[^0-9]/g, '')

export const wa = msg =>
  'https://wa.me/' + phoneDigits() + (msg ? '?text=' + encodeURIComponent(msg) : '')

export const waPlain = wa('Hola WIMALI 👋 Quiero hacer una consulta sobre sus productos.')

export const discount = p =>
  p.previous_price ? Math.round((1 - p.price / p.previous_price) * 100) : 0

export const orderMessage = cart => {
  const lines = cart.map(c => '• ' + c.qty + 'x ' + c.name + ' — ' + fmt(c.price * c.qty))
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0)
  return (
    'Hola WIMALI 👋\n\nQuiero realizar el siguiente pedido:\n\n' +
    lines.join('\n') +
    '\n\nTotal: ' +
    fmt(total) +
    '\n\n¿Está disponible?'
  )
}

export const productMessage = (p, qty) =>
  'Hola WIMALI 👋\n\nMe interesa este producto:\n\n• ' +
  qty + 'x ' + p.name + ' — ' + fmt(p.price * qty) +
  '\n\n¿Está disponible?'

export const mapQuery = () => BUSINESS.mapQuery || BUSINESS.address
export const mapSrc = () =>
  'https://www.google.com/maps?q=' + encodeURIComponent(mapQuery()) + '&output=embed'
export const directionsHref = () =>
  'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(mapQuery())

export const scrollToId = (id, offset = 100) => {
  const el = document.getElementById(id)
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
  }
}
