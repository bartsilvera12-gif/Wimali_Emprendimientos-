'use client'

import { AnimatedGradient } from '@/components/ui/animated-gradient'

// Un ÚNICO fondo de gradiente (dorado sobre negro) fijo detrás de toda la página.
// Reemplaza los gradientes por sección para que no queden "cortes" en los bordes.
export function PageBackground() {
  return (
    <div className="page-bg" aria-hidden="true">
      <AnimatedGradient
        config={{
          preset: 'custom',
          color1: '#0a0a0a',
          color2: '#2a1c07',
          color3: '#c9913d',
          rotation: -45,
          proportion: 58,
          scale: 0.6,
          speed: 9,
          distortion: 28,
          swirl: 55,
          swirlIterations: 9,
          softness: 100,
          offset: 120,
          shape: 'Edge',
          shapeSize: 42,
        }}
        noise={{ opacity: 0.2 }}
      />
    </div>
  )
}
