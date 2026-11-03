'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { ArrowUp, Facebook, Linkedin, Mail, Menu, MessageCircle, Phone, X } from 'lucide-react'
import { site } from '../data/site'
import { useScrolled } from '../lib/hooks'
import { useUI } from '../context/ui'
import { Logo } from './primitives'
import SearchBox from './SearchBox'

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
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'border-b border-line/70 bg-white/80 shadow-lg shadow-ink/5 backdrop-blur-xl' : 'border-b border-line bg-white'}`}>
      <div className={`container-x flex items-center gap-6 transition-all duration-300 ${scrolled ? 'h-16' : 'h-20'}`}>
        <Logo />
        <nav className="hidden flex-1 items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((n) => {
            const active = isActive(pathname, n.to)
            return (
              <Link key={n.to} href={n.to} aria-current={active ? 'page' : undefined} className={`relative z-0 rounded-lg px-3.5 py-2 text-sm font-medium transition ${active ? 'text-brand' : 'text-ink hover:text-brand'}`}>
                {active && <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-lg bg-mist" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                {n.label}
              </Link>
            )
          })}
        </nav>
        <div className="ml-auto hidden w-56 xl:block">
          <SearchBox />
        </div>
        <button onClick={() => openQuote()} className="btn-primary btn-shine ml-auto hidden sm:inline-flex xl:ml-0">
          Get quote
        </button>
        <button onClick={() => setOpen(true)} className="ml-auto grid size-10 place-items-center rounded-xl border border-line sm:ml-0 lg:hidden" aria-label="Open menu">
          <Menu className="size-5" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside
              className="fixed inset-y-0 right-0 z-50 flex w-[86%] max-w-sm flex-col bg-white p-6 shadow-2xl lg:hidden"
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
      </AnimatePresence>
    </header>
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
              { href: site.socials.facebook, Icon: Facebook, label: 'Facebook' },
              { href: site.socials.linkedin, Icon: Linkedin, label: 'LinkedIn' },
              { href: site.whatsappHref, Icon: MessageCircle, label: 'WhatsApp' },
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
          <p>© {new Date().getFullYear()} Nirmal LifeCare. All rights reserved.</p>
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
          className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] py-1.5 pl-1.5 pr-1.5 text-xs text-white/55 transition-all duration-300 hover:border-amber/40 hover:bg-white/[0.06] hover:text-white/80 hover:shadow-[0_0_30px_-6px_rgba(242,169,59,0.45)]"
        >
          <span className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-amber to-amber-600 text-[11px] font-extrabold text-ink shadow-md shadow-amber/20">
            {name.slice(0, 1)}
          </span>
          <span>
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
      <a href={site.phoneHref} className="btn-ghost !px-2 !py-2.5"><Phone className="size-4" /> Call</a>
      <a href={site.whatsappHref} target="_blank" rel="noreferrer" className="btn !px-2 !py-2.5 bg-[#25D366] text-white"><MessageCircle className="size-4" /> WhatsApp</a>
      <button onClick={() => openQuote()} className="btn-primary !px-2 !py-2.5">Get quote</button>
    </div>
  )
}

function FloatingActions() {
  const scrolled = useScrolled(600)
  return (
    <div className="fixed bottom-6 right-6 z-40 hidden flex-col items-end gap-3 md:flex">
      <AnimatePresence>
        {scrolled && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="grid size-11 place-items-center rounded-full border border-line bg-white shadow-lg transition hover:-translate-y-1"
            aria-label="Back to top"
          >
            <ArrowUp className="size-5" />
          </motion.button>
        )}
      </AnimatePresence>
      <a href={site.whatsappHref} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className="group relative grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/40 transition hover:scale-110">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" />
        <MessageCircle className="relative size-6" />
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-xs font-medium opacity-0 transition group-hover:opacity-100">Chat on WhatsApp</span>
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
