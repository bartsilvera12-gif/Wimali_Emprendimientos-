// Recorta el fondo rojo de los logos WIMALI dejando dorado + blanco sobre
// transparente. Se apoya en que el rojo tiene G (verde) muy bajo, mientras
// el dorado y el blanco tienen G alto.
import sharp from 'sharp'
import path from 'node:path'

const SRC = process.env.LOGO_SRC
const OUT = process.env.LOGO_OUT

async function keyOut(input, output, targetHeight) {
  const img = sharp(input).ensureAlpha()
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2]
    const reddish = r > g + 25 && r > b + 20
    if (reddish) {
      // rampa suave sobre el canal verde: G bajo => transparente (rojo),
      // G alto => opaco (dorado). Bordes anti-alias quedan semitransparentes.
      const lo = 55, hi = 120
      let a = Math.round(((g - lo) / (hi - lo)) * 255)
      a = a < 0 ? 0 : a > 255 ? 255 : a
      data[i + 3] = a
    }
    // blanco (r≈g≈b altos) y demás quedan opacos
  }
  let out = sharp(data, { raw: { width, height, channels } })
  // recortar el sobrante transparente alrededor
  out = out.png().trim({ threshold: 10 })
  if (targetHeight) out = out.resize({ height: targetHeight, withoutEnlargement: false })
  await out.png().toFile(output)
  console.log('✓', path.basename(output))
}

await keyOut(path.join(SRC, 'logoC.jpeg'), path.join(OUT, 'wimali-logo.png'), 200)      // header horizontal
await keyOut(path.join(SRC, 'logoB.jpeg'), path.join(OUT, 'wimali-iso.png'), 256)        // isotipo
await keyOut(path.join(SRC, 'logoA.jpeg'), path.join(OUT, 'wimali-vertical.png'), 320)   // vertical
console.log('listo')
