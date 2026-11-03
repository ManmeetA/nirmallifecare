'use client'

import { useRouter } from 'next/navigation'
import { Database, ShieldAlert } from 'lucide-react'
import { adminApi } from '@/lib/admin-api'
import { Logo } from '../primitives'

function Frame({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center bg-mist p-4">
      <div className="w-full max-w-xl rounded-3xl border border-line bg-white p-8 shadow-xl shadow-brand/5">
        <Logo sub={false} />
        <div className="mt-8 flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-mist text-brand">{icon}</span>
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted">{children}</div>
      </div>
    </div>
  )
}

const Code = ({ children }: { children: React.ReactNode }) => (
  <pre className="overflow-x-auto rounded-xl bg-ink p-4 text-xs leading-relaxed text-white/90">{children}</pre>
)

/** Shown when NEXT_PUBLIC_SUPABASE_* env vars are missing. */
export function SetupNotice() {
  return (
    <Frame icon={<Database className="size-5" />} title="Connect Supabase to use the admin">
      <p>The admin panel stores products in Supabase. To finish setup:</p>
      <ol className="list-decimal space-y-2 pl-5">
        <li>Create a project at supabase.com.</li>
        <li>In the SQL editor, run <b>supabase/migrations/…_init.sql</b>, then <b>supabase/seed.sql</b>.</li>
        <li>Copy the project URL and anon (publishable) key into <b>.env.local</b>:</li>
      </ol>
      <Code>{`NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=<anon or publishable key>`}</Code>
      <p>Restart the dev server, then create your admin user — see the README.</p>
    </Frame>
  )
}

/** Signed in, but the user is not in public.admin_users. */
export function NotAuthorized({ email, userId }: { email: string; userId: string }) {
  const router = useRouter()
  return (
    <Frame icon={<ShieldAlert className="size-5" />} title="This account isn’t an admin yet">
      <p>
        You’re signed in as <b className="text-ink">{email}</b>, but this account hasn’t been granted admin access. An owner can grant it by running this in the Supabase SQL editor:
      </p>
      <Code>{`insert into public.admin_users (user_id)\nvalues ('${userId}');`}</Code>
      <button
        onClick={async () => {
          await adminApi.signOut()
          router.replace('/admin/login')
          router.refresh()
        }}
        className="btn-ghost mt-2"
      >
        Sign out
      </button>
    </Frame>
  )
}
