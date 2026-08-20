// Servidor estatico minimo para previsualizar dist/ (solo pruebas locales).
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { join, extname, normalize } from 'node:path'

const ROOT = join(process.cwd(), 'dist')
const PORT = process.env.PORT || 4599
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
}

async function resolve(p) {
  // Intenta: archivo exacto, luego /index.html (trailingSlash export).
  try {
    const s = await stat(p)
    if (s.isDirectory()) return join(p, 'index.html')
    return p
  } catch {
    try {
      await stat(p + '.html')
      return p + '.html'
    } catch {
      return join(p, 'index.html')
    }
  }
}

createServer(async (req, res) => {
  try {
    const url = decodeURIComponent((req.url || '/').split('?')[0])
    let path = normalize(join(ROOT, url)).replace(/\\/g, '/')
    if (!path.startsWith(ROOT.replace(/\\/g, '/'))) {
      res.writeHead(403).end('forbidden')
      return
    }
    path = await resolve(path)
    const body = await readFile(path)
    res.writeHead(200, { 'content-type': TYPES[extname(path)] || 'application/octet-stream' })
    res.end(body)
  } catch {
    try {
      const nf = await readFile(join(ROOT, '404.html'))
      res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' }).end(nf)
    } catch {
      res.writeHead(404).end('not found')
    }
  }
}).listen(PORT, () => console.log(`dist server on http://localhost:${PORT}`))
