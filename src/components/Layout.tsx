'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { ArrowUp, Mail, Menu, Phone, X } from 'lucide-react'
import { site } from '../data/site'
import { useScrolled } from '../lib/hooks'
import { useUI } from '../context/ui'
import { Logo } from './primitives'
import SearchBox from './SearchBox'
import WhatsAppIcon from './WhatsAppIcon'

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products & Services' },
  { to: '/about', label: 'About Us' },
  { to: '/testimonials', label: 'Testimonials' },
  { to: '/contact', label: 'Contact Us' },
]

const FOOTER_PRODUCTS = [
  { to: '/products/tablets', label: 'Tablets' },
  { to: '/products/capsules', label: 'Capsules' },
  { to: '/products/injections', label: 'Injections' },
  { to: '/products/cardiac-diabetic', label: 'Cardiac & Diabetic' },
]

const isActive = (pathname: string, to: string) => (to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`))

function Header() {
  const scrolled = useScrolled()
  const { openQuote } = useUI()
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // While the menu is open: freeze page scroll and close on Escape.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'border-b border-line/70 bg-white/80 shadow-lg shadow-ink/5 backdrop-blur-xl' : 'border-b border-line bg-white'}`}>
      <div className={`container-x flex items-center gap-4 transition-all duration-300 xl:gap-6 ${scrolled ? 'h-16' : 'h-20'}`}>
        <Logo />
        <nav className="hidden flex-1 items-center gap-0.5 lg:flex xl:gap-1" aria-label="Main">
          {NAV.map((n) => {
            const active = isActive(pathname, n.to)
            return (
              <Link key={n.to} href={n.to} aria-current={active ? 'page' : undefined} className={`relative z-0 whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium transition xl:px-3.5 ${active ? 'text-brand' : 'text-ink hover:text-brand'}`}>
                {active && <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-lg bg-mist" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                {n.label}
              </Link>
            )
          })}
        </nav>
        <div className="ml-auto hidden w-48 xl:block 2xl:w-56">
          <SearchBox />
        </div>
        <button onClick={() => openQuote()} className="btn-primary btn-shine ml-auto hidden sm:inline-flex xl:ml-0">
          Get quote
        </button>
        <button onClick={() => setOpen(true)} className="ml-auto grid size-10 place-items-center rounded-xl border border-line sm:ml-0 lg:hidden" aria-label="Open menu">
          <Menu className="size-5" />
        </button>
      </div>

      {/* Portalled to <body>: the header's backdrop-blur would otherwise make it the
          containing block for these fixed elements and squash them to header height. */}
      {mounted && createPortal(
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-[60] bg-ink/50 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="fixed inset-y-0 right-0 z-[60] flex w-[86%] max-w-sm flex-col overflow-y-auto bg-white p-6 shadow-2xl lg:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between">
                <Logo sub={false} />
                <button onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-xl border border-line" aria-label="Close menu">
                  <X className="size-5" />
                </button>
              </div>
              <div className="mt-6">
                <SearchBox onNavigate={() => setOpen(false)} />
              </div>
              <nav className="mt-6 flex flex-col gap-1" aria-label="Mobile">
                {NAV.map((n, i) => (
                  <motion.div key={n.to} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i + 0.1 }}>
                    <Link href={n.to} className={`block rounded-xl px-4 py-3 text-base font-medium ${isActive(pathname, n.to) ? 'bg-mist text-brand' : 'hover:bg-mist'}`}>
                      {n.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="mt-auto space-y-3 border-t border-line pt-6 text-sm">
                <a href={site.phoneHref} className="flex items-center gap-2"><Phone className="size-4 text-brand" /> {site.phone}</a>
                <a href={site.emailHref} className="flex items-center gap-2"><Mail className="size-4 text-brand" /> {site.email}</a>
                <button onClick={() => { setOpen(false); openQuote() }} className="btn-primary mt-2 w-full">Get quote</button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>,
      document.body,
      )}
    </header>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-white/75">
      <div className="absolute -left-40 top-0 size-[28rem] rounded-full bg-brand/20 blur-3xl" />
      <div className="container-x relative grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light sub={false} />
          <p className="mt-4 max-w-xs text-sm leading-relaxed">{site.blurb}</p>
          <div className="mt-6 flex gap-3">
            {[
              { href: site.socials.facebook, Icon: FacebookIcon, label: 'Facebook' },
              { href: site.socials.linkedin, Icon: LinkedinIcon, label: 'LinkedIn' },
              { href: site.whatsappHref, Icon: WhatsAppIcon, label: 'WhatsApp' },
            ].map(({ href, Icon, label }) => (
              <a key={label} href={href} aria-label={label} target="_blank" rel="noreferrer" className="grid size-10 place-items-center rounded-xl border border-white/15 transition hover:-translate-y-1 hover:border-amber hover:text-amber">
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-white">Company</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link className="hover:text-amber" href="/about">About Us</Link></li>
            <li><Link className="hover:text-amber" href="/testimonials">Testimonials</Link></li>
            <li><Link className="hover:text-amber" href="/contact">Contact Us</Link></li>
            <li><Link className="hover:text-amber" href="/sitemap">Sitemap</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-white">Products</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {FOOTER_PRODUCTS.map((p) => (
              <li key={p.to}><Link className="hover:text-amber" href={p.to}>{p.label}</Link></li>
            ))}
            <li><Link className="font-semibold text-amber" href="/products">View all ›</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-white">Reach us</h3>
          <address className="mt-4 space-y-2.5 text-sm not-italic">
            <p>{site.contactPerson}, {site.designation}<br />{site.addressLine}<br />{site.cityLine}</p>
            <p><a href={site.phoneHref} className="hover:text-amber">{site.phone}</a></p>
            <p><a href={site.emailHref} className="hover:text-amber">{site.email}</a></p>
          </address>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="container-x flex flex-col gap-3 py-5 text-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p>© {new Date().getFullYear()} Nirmal Lifecare. All rights reserved.</p>
            <p className="text-white/45">
              GSTIN {site.gst} · {site.drugLicences.map((l) => `DL ${l.form}: ${l.number}`).join(' · ')}
            </p>
          </div>
          <div className="flex gap-5">
            <Link href="/privacy" className="underline-offset-4 hover:text-white hover:underline">Privacy policy</Link>
            <Link href="/terms" className="underline-offset-4 hover:text-white hover:underline">Terms of use</Link>
          </div>
        </div>
      </div>
      <DeveloperCredit />
    </footer>
  )
}

/** Signature strip at the very bottom of the site: designer credit with a tap-to-call link. */
function DeveloperCredit() {
  const { name, phone, phoneHref } = site.credit
  return (
    <div className="relative bg-[#0a2020]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber/50 to-transparent" />
      {/* Extra bottom padding on mobile keeps the strip clear of the sticky action bar. */}
      <div className="container-x flex justify-center pb-24 pt-5 md:pb-5">
        <a
          href={phoneHref}
          title={`Call ${name} on ${phone}`}
          className="group inline-flex max-w-full items-center gap-2 rounded-full sm:gap-3 border border-white/10 bg-white/[0.03] py-1.5 pl-1.5 pr-1.5 text-xs text-white/55 transition-all duration-300 hover:border-amber/40 hover:bg-white/[0.06] hover:text-white/80 hover:shadow-[0_0_30px_-6px_rgba(242,169,59,0.45)]"
        >
          <span className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-amber to-amber-600 text-[11px] font-extrabold text-ink shadow-md shadow-amber/20">
            {name.slice(0, 1)}
          </span>
          <span className="whitespace-nowrap max-[359px]:text-[11px]">
            Designed &amp; developed by <span className="font-semibold text-white">{name}</span>
          </span>
          <span className="flex items-center rounded-full bg-white/5 py-1 pl-1 pr-1 text-white/80 transition-all duration-300 group-hover:bg-amber group-hover:pr-3 group-hover:text-ink">
            <span className="grid size-5 place-items-center">
              <Phone className="size-3.5 group-hover:animate-[ring_0.6s_ease-in-out_2]" />
            </span>
            <span className="max-w-0 overflow-hidden whitespace-nowrap font-semibold transition-all duration-300 group-hover:ml-1 group-hover:max-w-40">{phone}</span>
          </span>
        </a>
      </div>
    </div>
  )
}

/** Sticky Call / WhatsApp / Get quote bar from the mobile mockup. */
function MobileActionBar() {
  const { openQuote } = useUI()
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 gap-2 border-t border-line bg-white/90 p-2 backdrop-blur-xl md:hidden">
      <a href={site.phoneHref} className="btn-ghost !gap-1.5 !px-1 !py-2.5 max-[359px]:text-xs"><Phone className="size-4 shrink-0" /> Call</a>
      <a href={site.whatsappHref} target="_blank" rel="noreferrer" className="btn !gap-1.5 !px-1 !py-2.5 bg-[#25D366] text-white max-[359px]:text-xs"><WhatsAppIcon className="size-[18px] shrink-0" /> WhatsApp</a>
      <button onClick={() => openQuote()} className="btn-primary !px-1 !py-2.5 max-[359px]:text-xs">Get quote</button>
    </div>
  )
}

/** Hover label shared by the floating buttons. */
function FabLabel({ children }: { children: ReactNode }) {
  return (
    <span className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
      {children}
    </span>
  )
}

const RING_R = 25 // ring radius inside a 56 × 56 button

/** Back-to-top button whose ring fills with page scroll progress (full at the bottom). */
function BackToTop() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 })
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.6, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.6, y: 12 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="group relative grid size-14 place-items-center rounded-full bg-white text-ink shadow-lg shadow-ink/15 ring-1 ring-line transition-colors hover:text-brand"
      aria-label="Back to top"
    >
      <svg viewBox="0 0 56 56" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id="fab-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-brand)" />
            <stop offset="60%" stopColor="var(--color-brand-400)" />
            <stop offset="100%" stopColor="var(--color-amber)" />
          </linearGradient>
        </defs>
        <circle cx="28" cy="28" r={RING_R} fill="none" stroke="var(--color-mist)" strokeWidth="3" />
        <motion.circle cx="28" cy="28" r={RING_R} fill="none" stroke="url(#fab-ring)" strokeWidth="3" strokeLinecap="round" style={{ pathLength: progress }} />
      </svg>
      <ArrowUp className="relative size-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
      <FabLabel>Back to top</FabLabel>
    </motion.button>
  )
}

function FloatingActions() {
  const scrolled = useScrolled(400)
  return (
    <div className="fixed bottom-6 right-6 z-40 hidden flex-col items-center gap-3 md:flex">
      <AnimatePresence>{scrolled && <BackToTop />}</AnimatePresence>
      <a
        href={site.whatsappHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-ink/15 ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:bg-[#1fbe5b]"
      >
        <WhatsAppIcon className="size-7" />
        <FabLabel>Chat on WhatsApp</FabLabel>
      </a>
    </div>
  )
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  return <motion.div className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-brand via-brand-400 to-amber" style={{ scaleX }} />
}

/** Site chrome around every page; rendered once from app/layout.tsx. Page fade-ins live in app/template.tsx. */
export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">Skip to content</a>
      <ScrollProgress />
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <MobileActionBar />
      <FloatingActions />
    </div>
  )
}
