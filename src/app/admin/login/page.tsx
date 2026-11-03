import type { Metadata } from 'next'
import { Suspense } from 'react'
import { supabaseConfigured } from '@/lib/supabase/config'
import { SetupNotice } from '@/components/admin/Gate'
import LoginForm from '@/components/admin/LoginForm'

export const metadata: Metadata = { title: 'Sign in' }

export default function LoginPage() {
  if (!supabaseConfigured) return <SetupNotice />
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
