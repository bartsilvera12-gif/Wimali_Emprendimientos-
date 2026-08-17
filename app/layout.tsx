import type { Metadata } from 'next'
import { Montserrat, Inter } from 'next/font/google'
import './globals.css'
import { getBusiness } from '@/lib/queries'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  // SEO administrable desde el panel (business_settings). Con fallback seguro.
  let title = 'WIMALI Emprendimientos | Tecnología, Accesorios y Más'
  let description =
    'Encontrá tecnología, accesorios, productos para el hogar, belleza y mucho más en WIMALI. Elegí tus productos y finalizá tu pedido fácilmente por WhatsApp.'
  try {
    const business = await getBusiness()
    if (business?.seo_title) title = business.seo_title
    if (business?.seo_description) description = business.seo_description
  } catch {
    // Supabase no disponible todavía: se usan los valores por defecto.
  }
  return { title, description }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${montserrat.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
