import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigured } from './lib/supabase/config'

/**
 * Guards /admin: refreshes the Supabase session cookie and sends signed-out
 * visitors to /admin/login. The admin-role check (public.admin_users) happens
 * in app/admin/(panel)/layout.tsx and, for data, in the database's RLS policies.
 */
export async function proxy(request: NextRequest) {
  if (!supabaseConfigured) return NextResponse.next()

  let response = NextResponse.next({ request })
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl
  const onLogin = pathname === '/admin/login'

  if (!user && !onLogin) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    url.search = pathname === '/admin' ? '' : `?next=${encodeURIComponent(pathname)}`
    return NextResponse.redirect(url)
  }
  if (user && onLogin) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    url.search = ''
    return NextResponse.redirect(url)
  }
  return response
}

export const config = { matcher: ['/admin', '/admin/:path*'] }
