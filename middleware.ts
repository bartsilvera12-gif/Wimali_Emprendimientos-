import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  // Corre en /admin/* (protección de sesión).
  matcher: ['/admin/:path*'],
}
