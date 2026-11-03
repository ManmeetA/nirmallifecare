import { redirect } from 'next/navigation'
import { supabaseConfigured } from '@/lib/supabase/config'
import { getAdmin } from '@/lib/supabase/server'
import AdminShell from '@/components/admin/AdminShell'
import { NotAuthorized, SetupNotice } from '@/components/admin/Gate'

// Always check the session per request — never cache admin pages.
export const dynamic = 'force-dynamic'

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!supabaseConfigured) return <SetupNotice />
  const { user, isAdmin } = await getAdmin()
  if (!user) redirect('/admin/login')
  if (!isAdmin) return <NotAuthorized email={user.email ?? ''} userId={user.id} />
  return <AdminShell email={user.email ?? 'Admin'}>{children}</AdminShell>
}
