// Ejecuta las migraciones SQL de supabase/migrations en orden, contra una
// conexión directa de Postgres (Supabase).
//
// USO:
//   1) npm i pg
//   2) definir la cadena de conexión (NO se guarda en el repo):
//        PowerShell:  $env:SUPABASE_DB_URL="postgresql://postgres:PASS@HOST:5432/postgres"
//        bash:        export SUPABASE_DB_URL="postgresql://postgres:PASS@HOST:5432/postgres"
//   3) node scripts/run-migrations.mjs
//
// Corre cada archivo dentro de su propia transacción; si uno falla, aborta.
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'

const __dirname = dirname(fileURLToPath(import.meta.url))
const MIGRATIONS_DIR = join(__dirname, '..', 'supabase', 'migrations')

const connectionString = process.env.SUPABASE_DB_URL
if (!connectionString) {
  console.error('Falta SUPABASE_DB_URL (cadena de conexión directa a Postgres).')
  process.exit(1)
}

const files = readdirSync(MIGRATIONS_DIR)
  .filter(f => f.endsWith('.sql'))
  .sort()

const client = new pg.Client({
  connectionString,
  // Supabase suele requerir SSL; con self-hosted puede variar.
  ssl: { rejectUnauthorized: false },
})

const run = async () => {
  await client.connect()
  console.log(`Conectado. ${files.length} migraciones a ejecutar.\n`)

  for (const file of files) {
    const sql = readFileSync(join(MIGRATIONS_DIR, file), 'utf8')
    process.stdout.write(`▶ ${file} ... `)
    try {
      await client.query('begin')
      await client.query(sql)
      await client.query('commit')
      console.log('OK')
    } catch (err) {
      await client.query('rollback')
      console.log('FALLÓ')
      console.error(`\nError en ${file}:\n${err.message}\n`)
      await client.end()
      process.exit(1)
    }
  }

  // Verificación rápida.
  const q = async (label, sql) => {
    const { rows } = await client.query(sql)
    console.log(`  ${label}: ${JSON.stringify(rows[0])}`)
  }
  console.log('\nVerificación:')
  await q('productos', 'select count(*)::int as n from wimaliemprendimientos.products')
  await q('categorías', 'select count(*)::int as n from wimaliemprendimientos.categories')
  await q('secciones', 'select count(*)::int as n from wimaliemprendimientos.site_sections')

  await client.end()
  console.log('\n✅ Migraciones aplicadas.')
}

run().catch(async e => {
  console.error(e)
  try { await client.end() } catch {}
  process.exit(1)
})
