import { formatPYG } from '@/lib/format'

export interface CartLine {
  id: string
  name: string
  price: number
  qty: number
}

const digits = (num: string) => (num || '').replace(/[^0-9]/g, '')

export function waLink(whatsappNumber: string, message?: string): string {
  return (
    'https://wa.me/' +
    digits(whatsappNumber) +
    (message ? '?text=' + encodeURIComponent(message) : '')
  )
}

export function waPlain(whatsappNumber: string): string {
  return waLink(whatsappNumber, 'Hola WIMALI 👋 Quiero hacer una consulta sobre sus productos.')
}

export function orderMessage(cart: CartLine[]): string {
  const lines = cart.map((c) => '• ' + c.qty + 'x ' + c.name + ' — ' + formatPYG(c.price * c.qty))
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0)
  return (
    'Hola WIMALI 👋\n\nQuiero realizar el siguiente pedido:\n\n' +
    lines.join('\n') +
    '\n\nTotal: ' +
    formatPYG(total) +
    '\n\n¿Está disponible?'
  )
}

export function productMessage(name: string, price: number, qty: number): string {
  return (
    'Hola WIMALI 👋\n\nMe interesa este producto:\n\n• ' +
    qty +
    'x ' +
    name +
    ' — ' +
    formatPYG(price * qty) +
    '\n\n¿Está disponible?'
  )
}
