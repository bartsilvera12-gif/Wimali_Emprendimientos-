// Búsqueda inteligente del catálogo:
// - ignora mayúsculas y acentos ("microfono" encuentra "Micrófono")
// - tolera errores de tipeo ("auricluar" encuentra "Auricular")
// - entiende sinónimos comunes ("audifonos" → auricular, "bateria" → power bank)
// - consultas de varias palabras en cualquier orden, ordenadas por relevancia

const normalize = s =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const SYNONYMS = {
  audifono: 'auricular',
  audifonos: 'auricular',
  auriculares: 'auricular',
  bateria: 'power bank',
  pila: 'power bank',
  powerbank: 'power bank',
  cargadores: 'cargador',
  microfonos: 'microfono',
  mic: 'microfono',
  celulares: 'celular',
  telefono: 'celular',
  reloj: 'smartwatch',
  relojes: 'smartwatch',
  juegos: 'consola',
  videojuegos: 'consola',
  nintendo: 'consola',
  luz: 'aro de luz',
  unas: 'torno de unas',
  manicura: 'torno de unas',
  maquillaje: 'brochas',
  tipo: 'type',
  usb: 'usb-c',
}

// distancia de Levenshtein acotada (para tolerar 1-2 letras mal escritas)
const editDistance = (a, b, max) => {
  if (Math.abs(a.length - b.length) > max) return max + 1
  const prev = new Array(b.length + 1)
  for (let j = 0; j <= b.length; j++) prev[j] = j
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0]
    prev[0] = i
    let rowMin = prev[0]
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j]
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1))
      diag = tmp
      if (prev[j] < rowMin) rowMin = prev[j]
    }
    if (rowMin > max) return max + 1
  }
  return prev[b.length]
}

const fuzzyIncludes = (words, token) => {
  if (token.length < 4) return false
  const max = token.length >= 7 ? 2 : 1
  return words.some(w => w.length >= 3 && editDistance(w, token, max) <= max)
}

// puntúa un producto contra un token: 0 = no coincide
const scoreToken = (p, token) => {
  const name = normalize(p.name)
  const category = normalize(p.category)
  const description = normalize(p.description)
  if (name.includes(token)) return name.startsWith(token) ? 12 : 8
  if (category.includes(token)) return 6
  if (description.includes(token)) return 3
  if (fuzzyIncludes(name.split(' '), token)) return 5
  if (fuzzyIncludes(description.split(' '), token)) return 1.5
  return 0
}

export const smartSearch = (products, query) => {
  const q = normalize(query)
  if (!q) return products
  const tokens = q.split(' ').filter(Boolean)
  const scored = []
  for (const p of products) {
    let total = 0
    let allMatch = true
    for (const token of tokens) {
      let s = scoreToken(p, token)
      // probar el sinónimo si el token directo no coincide o suma poco
      const syn = SYNONYMS[token]
      if (syn) {
        const synScore = Math.max(
          ...normalize(syn)
            .split(' ')
            .filter(Boolean)
            .map(t => scoreToken(p, t)),
        )
        s = Math.max(s, synScore * 0.9)
      }
      if (s <= 0) {
        allMatch = false
        break
      }
      total += s
    }
    if (allMatch) scored.push([total, p])
  }
  scored.sort((a, b) => b[0] - a[0])
  return scored.map(([, p]) => p)
}
