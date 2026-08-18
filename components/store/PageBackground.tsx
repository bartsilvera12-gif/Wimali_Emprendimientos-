'use client'

import { useEffect, useRef } from 'react'
import { AnimatedGradient } from '@/components/ui/animated-gradient'

// Un ÚNICO fondo de gradiente (dorado sobre negro) detrás de toda la página.
// Se desplaza suavemente al hacer scroll (parallax), no queda estático.
export function PageBackground() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        const p = max > 0 ? Math.min(1, window.scrollY / max) : 0
        // Desplazamiento acotado (0 → -22vh) para que siempre cubra la pantalla.
        el.style.transform = `translate3d(0, ${(-p * 22).toFixed(2)}vh, 0)`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="page-bg" aria-hidden="true" ref={ref}>
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
