// Renombra la salida del export estático de Next (`out/`) a `dist/`
// para subir a Hostinger. Se ejecuta después de `next build`.
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const out = path.join(root, 'out')
const dist = path.join(root, 'dist')

if (!fs.existsSync(out)) {
  console.error('No existe la carpeta out/. ¿Falló el export?')
  process.exit(1)
}
fs.rmSync(dist, { recursive: true, force: true })
fs.renameSync(out, dist)
console.log('Export listo en dist/ (subir a Hostinger).')
