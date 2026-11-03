import 'server-only'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './config'

/** Server client bound to the request's auth cookies (Server Components, Server Actions). */
export async function supabaseServer() {
  const store = await cookies()
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options))
        } catch {
          // Called from a Server Component — the middleware refreshes the session instead.
        }
      },
    },
  })
}

/** Anonymous client for public reads that must work at build time (metadata, static params). */
export function supabasePublic() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } })
}

/** The signed-in user if they are listed in public.admin_users, else null. */
export async function getAdmin() {
  const supabase = await supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { user: null, isAdmin: false }
  const { data } = await supabase.rpc('is_admin')
  return { user, isAdmin: data === true }
}
