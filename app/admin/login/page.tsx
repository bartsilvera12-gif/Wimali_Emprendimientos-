'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(
          error.message === 'Invalid login credentials'
            ? 'Email o contraseña incorrectos.'
            : error.message,
        )
        setLoading(false)
        return
      }
      // El middleware redirige /admin/login → /admin al haber sesión.
      router.replace('/admin')
      router.refresh()
    } catch {
      setError('No se pudo conectar. Intentá de nuevo.')
      setLoading(false)
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/wimali-logo.png" alt="WIMALI Emprendimientos" />
        </div>
        <h1 className="admin-login-title">Panel administrador</h1>
        <p className="admin-login-sub">Ingresá con tu cuenta autorizada.</p>

        <form onSubmit={onSubmit} className="admin-login-form">
          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@wimaliemprendimientos.com"
              autoComplete="email"
              required
            />
          </label>
          <label>
            <span>Contraseña</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </label>

          {error && <div className="admin-login-error">{error}</div>}

          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
