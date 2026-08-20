'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAdminUserClient } from '@/lib/auth-client'
import { AdminSidebar } from '@/components/admin/Sidebar'
import type { AdminUser } from '@/lib/supabase/types'

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let alive = true
    getAdminUserClient().then((a) => {
      if (!alive) return
      if (!a) {
        router.replace('/admin/login')
        return
      }
      setAdmin(a)
      setChecking(false)
    })
    return () => {
      alive = false
    }
  }, [router])

  if (checking || !admin) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
      </div>
    )
  }

  return (
    <div className="admin-shell">
      <AdminSidebar adminName={admin.full_name || admin.email} role={admin.role} />
      <div className="admin-main">{children}</div>
    </div>
  )
}
