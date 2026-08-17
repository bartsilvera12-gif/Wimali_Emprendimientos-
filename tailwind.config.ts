import type { Config } from 'tailwindcss'

// Identidad visual WIMALI expuesta como utilidades Tailwind (para el panel admin
// y componentes nuevos). La tienda pública conserva además su CSS propio.
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0A0A0A',
        'ink-2': '#141414',
        cream: '#F6F1E7',
        'cream-2': '#F2ECE1',
        gold: '#C9913D',
        'gold-2': '#E4BD69',
        wa: '#25D366',
        'wa-ink': '#062E13',
        'wa-dark': '#128C4A',
      },
      fontFamily: {
        head: ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
        body: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}

export default config
