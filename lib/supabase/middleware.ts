import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { DB_SCHEMA } from '@/lib/constants'

// Refresca la sesión de Supabase en cada request y protege /admin/*.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: { schema: DB_SCHEMA },
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // No alcanza con tener sesión: el usuario debe ser un admin activo.
  // (Consistente con getAdminUser del panel, para no crear un bucle de redirecciones).
  let isAdmin = false
  if (user) {
    const { data: admin } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', user.id)
      .eq('active', true)
      .maybeSingle()
    isAdmin = !!admin
  }

  const path = request.nextUrl.pathname
  const isAdminArea = path.startsWith('/admin')
  const isLoginPage = path === '/admin/login'

  // No-admin en /admin/* (que no sea el login) → al login.
  if (isAdminArea && !isLoginPage && !isAdmin) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  // Admin entrando al login → al panel.
  if (isLoginPage && isAdmin) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  return response
}
