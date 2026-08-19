// Cargador de productos WIMALI — sube imagen a Storage + inserta producto.
// Uso:  node scripts/load-products.mjs
// Requiere en .env.local:  NEXT_PUBLIC_SUPABASE_URL  y  SUPABASE_SERVICE_ROLE_KEY
// (la service_role NO se sube al repo; .env.local está gitignored)

import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

// --- cargar .env.local a mano (sin dependencias) ---
const envPath = path.resolve(process.cwd(), '.env.local')
const env = Object.fromEntries(
  fs.readFileSync(envPath, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
    }),
)

const URL = env.NEXT_PUBLIC_SUPABASE_URL
const KEY = env.SUPABASE_SERVICE_ROLE_KEY
const SCHEMA = env.NEXT_PUBLIC_SUPABASE_SCHEMA || 'wimaliemprendimientos'
const BUCKET = 'wimaliemprendimientos-media'

if (!URL || !KEY) {
  console.error('❌ Falta NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local')
  process.exit(1)
}

const supabase = createClient(URL, KEY, { db: { schema: SCHEMA }, auth: { persistSession: false } })

const IMG_DIR = process.env.IMG_DIR || path.resolve(process.cwd(), 'scripts/_img')

function slugify(t) {
  return t.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
}

// Manifiesto: cada producto con su imagen (pNN.jpeg en IMG_DIR)
const PRODUCTS = [
  { img: 'p01.jpeg', name: 'Aro de luz LUO LU-260 26 cm con trípode 2 m', price: 90000, cat: 'Belleza', stock: 12,
    short: 'Aro de luz LED 26 cm con trípode de 2 m, 3 tonos de luz y control.',
    desc: 'Aro de luz LED de 26 cm con 3 tonalidades (blanco frío, blanco cálido y amarillo cálido) y brillo regulable. Incluye trípode de piso extensible hasta 2 m, soporte para celular y control de mano. Perfecto para maquillaje, videollamadas, TikTok y fotos de producto.' },
  { img: 'p02.jpeg', name: 'Auricular Bluetooth KRAB KBA698', price: 140000, cat: 'Audio', stock: 10, updateExisting: true,
    short: 'Bluetooth 6.0, 20 h de reproducción, cancelación ENC y pantalla de batería.',
    desc: 'Auriculares inalámbricos KRAB KBA698 con Bluetooth 6.0, hasta 20 horas de reproducción, cancelación de ruido ENC y estuche con pantalla indicadora de batería. Incluye cable de carga USB.' },
  { img: 'p03.jpeg', name: 'Auriculares M10 TWS V5.3 True Wireless', price: 90000, cat: 'Audio', stock: 15,
    short: 'TWS Bluetooth 5.3 con estuche indicador digital y función power bank.',
    desc: 'Auriculares TWS M10 con Bluetooth 5.3, estuche con indicador digital de batería y función power bank para cargar tu celular. Sonido estéreo con graves potentes, controles táctiles y buena autonomía. Incluye estuche de carga.' },
  { img: 'p04.jpeg', name: 'Power bank Ecopower EP-C852 12000 mAh MagSafe', price: 110000, cat: 'Tecnología', stock: 10,
    short: 'Batería 12.000 mAh con carga inalámbrica magnética y soporte plegable.',
    desc: 'Batería portátil de 12.000 mAh con carga inalámbrica magnética (MagSafe) y carga rápida. Diseño super slim con soporte plegable integrado. Compatible con Apple y Android. Incluye cable de carga.' },
  { img: 'p05.jpeg', name: 'Micrófono inalámbrico BYZ K9 (doble)', price: 140000, cat: 'Audio', stock: 12,
    short: 'Set de 2 micrófonos de solapa inalámbricos, plug & play, Tipo-C y Lightning.',
    desc: 'Set de 2 micrófonos de solapa inalámbricos, plug & play sin necesidad de apps. Compatibles con dispositivos Tipo-C y Lightning. Ideales para videos, entrevistas, TikTok y transmisiones en vivo.' },
  { img: 'p06.jpeg', name: 'Mini consola retro LUO LU-SY04 (400 juegos)', price: 75000, cat: 'Tecnología', stock: 10,
    short: 'Consola portátil con 400 juegos clásicos, pantalla a color y salida a TV.',
    desc: 'Consola portátil retro con 400 juegos clásicos, pantalla a color, salida AV a TV y soporte para segundo control (2 jugadores). Incluye cable USB y cable AV. Diversión retro a donde vayas.' },
  { img: 'p07.jpeg', name: 'Cargador Ecopower EP-7050 20W PD (C a C)', price: 25000, cat: 'Accesorios', stock: 25,
    short: 'Cargador de pared PD 20W Tipo-C con carga rápida. Incluye cable C a C.',
    desc: 'Cargador de pared PD 20W con puerto Tipo-C y carga rápida (hasta 50% en 30 minutos). Incluye cable Tipo-C a Tipo-C. Compatible con celulares y tablets.' },
  { img: 'p08.jpeg', name: 'Torno de uñas eléctrico rosa con cristales', price: 200000, cat: 'Belleza', stock: 6,
    short: 'Torno de uñas recargable con base de carga, acabado rosa con strass.',
    desc: 'Torno/pulidor de uñas profesional recargable, con base de carga y acabado rosa con cristales. Velocidad regulable y giro reversible, bajo ruido y vibración. Incluye fresa (flame bit) y cable USB. Ideal para manicura y pedicura.' },
  { img: 'p09.jpeg', name: 'Aro de luz LUO LU-380 38 cm', price: 160000, cat: 'Belleza', stock: 8,
    short: 'Aro de luz LED 38 cm con soporte para 3 celulares y varias temperaturas.',
    desc: 'Aro de luz LED de 38 cm con múltiples temperaturas de color y brillo regulable. Soporte para hasta 3 celulares. Luz amplia y uniforme para maquillaje, fotografía, video y transmisiones en vivo.' },
  { img: 'p10.jpeg', name: 'Soporte multifuncional LUO LU-4011', price: 30000, cat: 'Accesorios', stock: 20,
    short: 'Soporte plegable con fuerte succión y ángulo ajustable. Portátil.',
    desc: 'Soporte plegable para celular con base de fuerte succión y ángulo ajustable. Diseño compacto y portátil, ideal para escritorio o auto. Incluye anillo metálico adhesivo.' },
  { img: 'p11.jpeg', name: 'Tensiómetro de brazo Ecopower EP-2740', price: 100000, cat: 'Hogar', stock: 8,
    short: 'Medidor de presión arterial digital de brazo, alta precisión, carga USB.',
    desc: 'Medidor de presión arterial digital de brazo, de alta precisión. Pantalla LCD grande con lectura de sistólica, diastólica y pulso, indicador WHO y memoria. Carga por USB. Fácil de usar en casa.' },
]

async function categoryMap() {
  const { data, error } = await supabase.from('categories').select('id,name')
  if (error) throw error
  const m = new Map()
  for (const c of data) m.set(c.name.toLowerCase(), c.id)
  return m
}

async function uploadImage(file) {
  const buf = await sharp(path.join(IMG_DIR, file))
    .rotate()
    .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 82 })
    .toBuffer()
  const key = `productos/${Date.now()}-${slugify(file.replace(/\.[^.]+$/, ''))}-${Math.random().toString(36).slice(2, 8)}.jpg`
  const { error } = await supabase.storage.from(BUCKET).upload(key, buf, { contentType: 'image/jpeg', upsert: false })
  if (error) throw new Error('upload ' + file + ': ' + error.message)
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(key)
  return { path: key, url: data.publicUrl }
}

async function run() {
  const cats = await categoryMap()
  let ok = 0, fail = 0
  for (const p of PRODUCTS) {
    try {
      const catId = cats.get(p.cat.toLowerCase())
      if (!catId) throw new Error('categoría no encontrada: ' + p.cat)
      const slug = slugify(p.name)
      const img = await uploadImage(p.img)

      // ¿ya existe (por slug o nombre)?
      const { data: existing } = await supabase.from('products').select('id')
        .or(`slug.eq.${slug},name.eq.${p.name}`).limit(1).maybeSingle()

      let productId
      if (existing) {
        productId = existing.id
        await supabase.from('products').update({
          price: p.price, short_description: p.short, description: p.desc,
          category_id: catId, stock: p.stock, active: true,
        }).eq('id', productId)
        console.log(`↻ actualizado: ${p.name}`)
      } else {
        const { data: ins, error } = await supabase.from('products').insert({
          name: p.name, slug, price: p.price, short_description: p.short, description: p.desc,
          category_id: catId, stock: p.stock, active: true, featured: false, is_offer: false,
        }).select('id').single()
        if (error) throw error
        productId = ins.id
        console.log(`＋ creado: ${p.name}`)
      }

      // ¿ya tiene imagen? si no, agregar como principal
      const { count } = await supabase.from('product_images')
        .select('id', { count: 'exact', head: true }).eq('product_id', productId)
      await supabase.from('product_images').insert({
        product_id: productId, storage_path: img.path, public_url: img.url,
        is_primary: (count ?? 0) === 0, sort_order: count ?? 0,
      })
      ok++
    } catch (e) {
      fail++
      console.error(`✖ ${p.name}: ${e.message}`)
    }
  }
  console.log(`\nListo. ${ok} cargados, ${fail} con error.`)
}

run().catch((e) => { console.error(e); process.exit(1) })
