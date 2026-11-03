'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, Inbox, LayoutDashboard, LogOut, Menu, Package, PlusCircle, X } from 'lucide-react'
import { adminApi } from '@/lib/admin-api'
import { Logo } from '../primitives'

const NAV = [
  { href: '/admin', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', Icon: Package },
  { href: '/admin/products/new', label: 'Add product', Icon: PlusCircle },
  { href: '/admin/enquiries', label: 'Enquiries', Icon: Inbox },
]

const isActive = (pathname: string, href: string) =>
  href === '/admin' ? pathname === '/admin' : href === '/admin/products' ? pathname === href || /^\/admin\/products\/(?!new)/.test(pathname) : pathname.startsWith(href)

function Sidebar({ email, newCount, onNavigate }: { email: string; newCount: number; onNavigate?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const signOut = async () => {
    await adminApi.signOut()
    router.replace('/admin/login')
    router.refresh()
  }
  return (
    <div className="flex h-full flex-col bg-ink text-white">
      <div className="relative overflow-hidden px-5 py-6">
        <div className="absolute -right-10 -top-10 size-40 rounded-full bg-brand/40 blur-3xl" />
        <div className="relative">
          <Logo light sub={false} />
          <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber">Admin</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3" aria-label="Admin">
        {NAV.map(({ href, label, Icon }) => {
          const active = isActive(pathname, href)
          return (
            <Link key={href} href={href} onClick={onNavigate} aria-current={active ? 'page' : undefined} className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? 'text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
              {active && <motion.span layoutId="admin-nav" className="absolute inset-0 rounded-xl bg-white/10 ring-1 ring-white/10" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              <Icon className={`relative size-[18px] ${active ? 'text-amber' : ''}`} />
              <span className="relative">{label}</span>
              {label === 'Enquiries' && newCount > 0 && <span className="relative ml-auto rounded-full bg-amber px-2 py-0.5 text-[11px] font-bold text-ink">{newCount}</span>}
            </Link>
          )
        })}
        <div className="my-3 border-t border-white/10" />
        <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white">
          <ExternalLink className="size-[18px]" /> View website
        </a>
      </nav>
      <div className="m-3 rounded-2xl bg-white/5 p-3">
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand text-sm font-bold uppercase">{email.slice(0, 1)}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{email}</p>
            <p className="text-xs text-white/50">Administrator</p>
          </div>
          <button onClick={signOut} className="grid size-9 place-items-center rounded-lg text-white/60 transition hover:bg-white/10 hover:text-white" aria-label="Sign out" title="Sign out">
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminShell({ email, children }: { email: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [newCount, setNewCount] = useState(0)
  const pathname = usePathname()

  // Refresh the "new enquiries" badge on every navigation.
  useEffect(() => {
    adminApi.newEnquiryCount().then(setNewCount).catch(() => {})
  }, [pathname])

  return (
    <div className="min-h-screen bg-[#f6f9f8]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block">
        <Sidebar email={email} newCount={newCount} />
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-white/90 px-4 backdrop-blur lg:hidden">
        <Logo sub={false} />
        <button onClick={() => setOpen(true)} className="grid size-10 place-items-center rounded-xl border border-line" aria-label="Open menu">
          <Menu className="size-5" />
        </button>
      </header>
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden" initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}>
              <button onClick={() => setOpen(false)} className="absolute right-3 top-5 z-10 grid size-9 place-items-center rounded-lg text-white/70 hover:bg-white/10" aria-label="Close menu">
                <X className="size-5" />
              </button>
              <Sidebar email={email} newCount={newCount} onNavigate={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="lg:pl-64">
        <motion.div key={pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </motion.div>
      </main>
    </div>
  )
}
