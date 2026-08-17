/** @type {import('next').NextConfig} */
const supabaseHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://api.neura.com.py').hostname
  } catch {
    return 'api.neura.com.py'
  }
})()

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: supabaseHost, pathname: '/**' },
    ],
  },
  eslint: {
    // El linteo no bloquea el build de producción.
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
