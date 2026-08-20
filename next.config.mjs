/** @type {import('next').NextConfig} */
const nextConfig = {
  // Export estático: genera HTML/JS estático (carpeta `out/`, renombrada a
  // `dist/` en el build) para subir a Hostinger. El panel /admin y la tienda
  // corren en el navegador (Supabase anon key + RLS).
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
  // Oculta el indicador de desarrollo de Next.js (la "N").
  devIndicators: false,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
}

export default nextConfig
