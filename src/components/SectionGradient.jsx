import AnimatedGradient from '../blocks/AnimatedGradient/AnimatedGradient.jsx'

// Fondo de gradiente animado con la paleta WIMALI (crema · dorado · negro).
// variant 'light' para secciones claras, 'dark' para secciones oscuras.
const CONFIGS = {
  light: {
    preset: 'custom',
    color1: '#f6f1e7',
    color2: '#e8d3a6',
    color3: '#c9913d',
    rotation: -30,
    proportion: 62,
    scale: 0.5,
    speed: 8,
    distortion: 22,
    swirl: 45,
    swirlIterations: 8,
    softness: 100,
    offset: 0,
    shape: 'Edge',
    shapeSize: 45,
  },
  dark: {
    preset: 'custom',
    color1: '#0a0a0a',
    color2: '#2a1c07',
    color3: '#c9913d',
    rotation: -45,
    proportion: 58,
    scale: 0.55,
    speed: 10,
    distortion: 30,
    swirl: 60,
    swirlIterations: 9,
    softness: 100,
    offset: 120,
    shape: 'Edge',
    shapeSize: 40,
  },
}

export default function SectionGradient({ variant = 'light' }) {
  return (
    <div className={`section-gradient section-gradient--${variant}`} aria-hidden="true">
      <AnimatedGradient config={CONFIGS[variant]} noise={{ opacity: 0.25 }} />
    </div>
  )
}
