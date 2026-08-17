import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/admin'
import { AdminSidebar } from '@/components/admin/Sidebar'

export const dynamic = 'force-dynamic'

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminUser()
  // Sesión inexistente o no autorizada como admin → al login.
  if (!admin) redirect('/admin/login')

  return (
    <div className="admin-shell">
      <AdminSidebar adminName={admin.full_name || admin.email} role={admin.role} />
      <div className="admin-main">{children}</div>
    </div>
  )
}
