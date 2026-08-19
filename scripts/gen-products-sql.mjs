// Genera: (1) imagenes optimizadas en public/assets/productos/<slug>.jpg
//         (2) un archivo SQL para pegar en el SQL Editor de Supabase.
// No necesita service_role: las imagenes son estaticas y el SQL lo corre el usuario.
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

const IMG_SRC = process.env.IMG_SRC
const OUT_DIR = path.resolve(process.cwd(), 'public/assets/productos')
const SQL_OUT = path.resolve(process.cwd(), 'supabase/seed-productos-nuevos.sql')
const SCHEMA = 'wimaliemprendimientos'

fs.mkdirSync(OUT_DIR, { recursive: true })
fs.mkdirSync(path.dirname(SQL_OUT), { recursive: true })

function slugify(t) {
  return t.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
}
const q = (s) => "'" + String(s).replace(/'/g, "''") + "'"

const PRODUCTS = [
  { img: 'p01.jpeg', name: 'Aro de luz LUO LU-260 26 cm con tripode 2 m', price: 90000, cat: 'belleza', stock: 12,
    short: 'Aro de luz LED 26 cm con tripode de 2 m, 3 tonos de luz y control.',
    desc: 'Aro de luz LED de 26 cm con 3 tonalidades (blanco frio, blanco calido y amarillo calido) y brillo regulable. Incluye tripode de piso extensible hasta 2 m, soporte para celular y control de mano. Perfecto para maquillaje, videollamadas, TikTok y fotos de producto.' },
  { img: 'p02.jpeg', name: 'Auricular Bluetooth KRAB KBA698', price: 140000, cat: 'audio', stock: 10,
    short: 'Bluetooth 6.0, 20 h de reproduccion, cancelacion ENC y pantalla de bateria.',
    desc: 'Auriculares inalambricos KRAB KBA698 con Bluetooth 6.0, hasta 20 horas de reproduccion, cancelacion de ruido ENC y estuche con pantalla indicadora de bateria. Incluye cable de carga USB.' },
  { img: 'p03.jpeg', name: 'Auriculares M10 TWS V5.3 True Wireless', price: 90000, cat: 'audio', stock: 15,
    short: 'TWS Bluetooth 5.3 con estuche indicador digital y funcion power bank.',
    desc: 'Auriculares TWS M10 con Bluetooth 5.3, estuche con indicador digital de bateria y funcion power bank para cargar tu celular. Sonido estereo con graves potentes, controles tactiles y buena autonomia. Incluye estuche de carga.' },
  { img: 'p04.jpeg', name: 'Power bank Ecopower EP-C852 12000 mAh MagSafe', price: 110000, cat: 'tecnologia', stock: 10,
    short: 'Bateria 12.000 mAh con carga inalambrica magnetica y soporte plegable.',
    desc: 'Bateria portatil de 12.000 mAh con carga inalambrica magnetica (MagSafe) y carga rapida. Diseno super slim con soporte plegable integrado. Compatible con Apple y Android. Incluye cable de carga.' },
  { img: 'p05.jpeg', name: 'Microfono inalambrico BYZ K9 (doble)', price: 140000, cat: 'audio', stock: 12,
    short: 'Set de 2 microfonos de solapa inalambricos, plug & play, Tipo-C y Lightning.',
    desc: 'Set de 2 microfonos de solapa inalambricos, plug & play sin necesidad de apps. Compatibles con dispositivos Tipo-C y Lightning. Ideales para videos, entrevistas, TikTok y transmisiones en vivo.' },
  { img: 'p06.jpeg', name: 'Mini consola retro LUO LU-SY04 (400 juegos)', price: 75000, cat: 'tecnologia', stock: 10,
    short: 'Consola portatil con 400 juegos clasicos, pantalla a color y salida a TV.',
    desc: 'Consola portatil retro con 400 juegos clasicos, pantalla a color, salida AV a TV y soporte para segundo control (2 jugadores). Incluye cable USB y cable AV. Diversion retro a donde vayas.' },
  { img: 'p07.jpeg', name: 'Cargador Ecopower EP-7050 20W PD (C a C)', price: 25000, cat: 'accesorios', stock: 25,
    short: 'Cargador de pared PD 20W Tipo-C con carga rapida. Incluye cable C a C.',
    desc: 'Cargador de pared PD 20W con puerto Tipo-C y carga rapida (hasta 50% en 30 minutos). Incluye cable Tipo-C a Tipo-C. Compatible con celulares y tablets.' },
  { img: 'p08.jpeg', name: 'Torno de unas electrico rosa con cristales', price: 200000, cat: 'belleza', stock: 6,
    short: 'Torno de unas recargable con base de carga, acabado rosa con strass.',
    desc: 'Torno/pulidor de unas profesional recargable, con base de carga y acabado rosa con cristales. Velocidad regulable y giro reversible, bajo ruido y vibracion. Incluye fresa (flame bit) y cable USB. Ideal para manicura y pedicura.' },
  { img: 'p09.jpeg', name: 'Aro de luz LUO LU-380 38 cm', price: 160000, cat: 'belleza', stock: 8,
    short: 'Aro de luz LED 38 cm con soporte para 3 celulares y varias temperaturas.',
    desc: 'Aro de luz LED de 38 cm con multiples temperaturas de color y brillo regulable. Soporte para hasta 3 celulares. Luz amplia y uniforme para maquillaje, fotografia, video y transmisiones en vivo.' },
  { img: 'p10.jpeg', name: 'Soporte multifuncional LUO LU-4011', price: 30000, cat: 'accesorios', stock: 20,
    short: 'Soporte plegable con fuerte succion y angulo ajustable. Portatil.',
    desc: 'Soporte plegable para celular con base de fuerte succion y angulo ajustable. Diseno compacto y portatil, ideal para escritorio o auto. Incluye anillo metalico adhesivo.' },
  { img: 'p11.jpeg', name: 'Tensiometro de brazo Ecopower EP-2740', price: 100000, cat: 'hogar', stock: 8,
    short: 'Medidor de presion arterial digital de brazo, alta precision, carga USB.',
    desc: 'Medidor de presion arterial digital de brazo, de alta precision. Pantalla LCD grande con lectura de sistolica, diastolica y pulso, indicador WHO y memoria. Carga por USB. Facil de usar en casa.' },
]

let sql = `-- ============================================================\n`
sql += `-- WIMALI - Carga de 11 productos nuevos (con imagen estatica)\n`
sql += `-- Pegar y ejecutar en el SQL Editor de Supabase.\n`
sql += `-- Las imagenes viven en /public/assets/productos/ (desplegadas en Vercel).\n`
sql += `-- ============================================================\n\n`

for (const p of PRODUCTS) {
  const slug = slugify(p.name)
  // optimizar imagen
  await sharp(path.join(IMG_SRC, p.img))
    .rotate()
    .resize({ width: 1000, height: 1000, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 82 })
    .toFile(path.join(OUT_DIR, slug + '.jpg'))

  const url = `/assets/productos/${slug}.jpg`
  sql += `-- ${p.name}\n`
  sql += `INSERT INTO ${SCHEMA}.products (name, slug, price, stock, short_description, description, category_id, active, featured, is_offer, is_new)\n`
  sql += `VALUES (${q(p.name)}, ${q(slug)}, ${p.price}, ${p.stock}, ${q(p.short)}, ${q(p.desc)}, (SELECT id FROM ${SCHEMA}.categories WHERE slug=${q(p.cat)}), true, false, false, false)\n`
  sql += `ON CONFLICT (slug) DO UPDATE SET price=EXCLUDED.price, stock=EXCLUDED.stock, short_description=EXCLUDED.short_description, description=EXCLUDED.description, category_id=EXCLUDED.category_id, active=true;\n`
  sql += `INSERT INTO ${SCHEMA}.product_images (product_id, public_url, is_primary, sort_order)\n`
  sql += `SELECT p.id, ${q(url)}, true, 0 FROM ${SCHEMA}.products p\n`
  sql += `WHERE p.slug=${q(slug)} AND NOT EXISTS (SELECT 1 FROM ${SCHEMA}.product_images pi WHERE pi.product_id=p.id);\n\n`
}

fs.writeFileSync(SQL_OUT, sql)
console.log('OK - imagenes en public/assets/productos/ y SQL en supabase/seed-productos-nuevos.sql')
console.log('Total productos:', PRODUCTS.length)
