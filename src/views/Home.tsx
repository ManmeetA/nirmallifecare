'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { ArrowRight, BadgeCheck, ChevronRight, Clock, FileCheck2, Headphones, IndianRupee, PackageCheck, Sparkles, Truck } from 'lucide-react'
import { api } from '../lib/api'
import { useAsync } from '../lib/hooks'
import { site } from '../data/site'
import { useUI } from '../context/ui'
import ProductArt from '../components/ProductArt'
import { ProductCard } from '../components/ProductCard'
import SearchBox from '../components/SearchBox'
import QuickEnquiry from '../components/QuickEnquiry'
import TestimonialCard from '../components/TestimonialCard'
import { Counter, Reveal, SectionHeading, Skeleton, Tilt } from '../components/primitives'
import type { Form } from '../lib/types'

const HEADLINE = ['Trusted', 'medicines,', 'supplied', 'on', 'time', 'to', 'pharmacies,', 'hospitals', 'and', 'distributors.']

function Hero() {
  const { openQuote } = useUI()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const px = useSpring(mx, { stiffness: 60, damping: 20 })
  const py = useSpring(my, { stiffness: 60, damping: 20 })
  const far = { x: useTransform(px, (v) => v * 30), y: useTransform(py, (v) => v * 30) }
  const near = { x: useTransform(px, (v) => v * -18), y: useTransform(py, (v) => v * -18) }

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-mist via-mist to-white"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        mx.set((e.clientX - r.left) / r.width - 0.5)
        my.set((e.clientY - r.top) / r.height - 0.5)
      }}
    >
      <div className="absolute inset-0 grid-dots [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <motion.div style={far} className="absolute -left-32 top-10 size-[30rem] rounded-full bg-brand/15 blur-3xl animate-blob" />
      <motion.div style={near} className="absolute -right-20 bottom-0 size-[26rem] rounded-full bg-amber/20 blur-3xl animate-blob [animation-delay:-7s]" />

      <div className="container-x relative grid items-center gap-10 pb-8 pt-6 lg:grid-cols-[1.1fr_1fr] lg:pt-8">
        <div>
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-white/70 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-brand backdrop-blur">
            <span className="relative flex size-2"><span className="absolute inset-0 animate-ping rounded-full bg-brand/60" /><span className="relative size-2 rounded-full bg-brand" /></span>
            Pharmaceutical trader & exporter
          </motion.span>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] sm:text-5xl xl:text-[3.6rem]">
            {HEADLINE.map((w, i) => (
              <motion.span
                key={i}
                className={`mr-[0.25em] inline-block ${i >= 6 && i !== 8 ? 'text-gradient' : ''}`}
                initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {w}
              </motion.span>
            ))}
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Tablets, capsules, injections and speciality medicines from licensed manufacturers — with bulk pricing and dispatch across India and overseas.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95 }} className="mt-8 max-w-xl">
            <SearchBox size="lg" placeholder="Search by brand, molecule or category" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05 }} className="mt-5 flex flex-wrap gap-3">
            <button onClick={() => openQuote()} className="btn-amber btn-shine !px-6 !py-3.5">
              Request bulk quote <ArrowRight className="size-4" />
            </button>
            <Link href="/products" className="btn-ghost !px-6 !py-3.5">Browse all products</Link>
          </motion.div>
        </div>

        <HeroVisual far={far} near={near} />
      </div>
    </section>
  )
}

type MV = { x: MotionValue<number>; y: MotionValue<number> }

/** Product-range composition. Swap the inner card for a real hero photo (1200 × 960) when available. */
function HeroVisual({ far, near }: { far: MV; near: MV }) {
  const floaters: { form: Form; cls: string; r: string; d: string }[] = [
    { form: 'capsule', cls: 'left-[2%] top-[6%] size-24', r: '-12deg', d: '0s' },
    { form: 'injection', cls: 'right-[4%] top-[2%] size-24', r: '10deg', d: '-2s' },
    { form: 'drops', cls: 'right-[-2%] bottom-[22%] size-20', r: '-8deg', d: '-4s' },
    { form: 'syrup', cls: 'left-[-3%] bottom-[18%] size-20', r: '8deg', d: '-1s' },
  ]
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="relative mx-auto aspect-[5/4] w-full max-w-xl">
      {/* rotating ring */}
      <div className="absolute inset-[8%] rounded-full border-2 border-dashed border-brand/20 animate-spin-slow" />
      <div className="absolute inset-[18%] rounded-full bg-gradient-to-br from-brand/20 to-amber/20 blur-2xl" />

      <motion.div style={near} className="absolute inset-[14%]">
        <Tilt className="size-full" max={10}>
          <div className="relative grid size-full place-items-center overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-white via-mist to-mint shadow-2xl shadow-brand/20">
            <div className="absolute inset-0 grid-dots opacity-70" />
            <div className="absolute -right-10 -top-10 size-40 rounded-full bg-amber/30 blur-2xl" />
            <ProductArt form="tablet" className="relative size-[58%] drop-shadow-2xl" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white/70 to-transparent" />
          </div>
        </Tilt>
      </motion.div>

      {floaters.map((f) => (
        <motion.div key={f.form} style={far} className={`absolute ${f.cls}`}>
          <div className="glass grid size-full place-items-center rounded-2xl shadow-xl shadow-brand/10 animate-float" style={{ ['--r' as string]: f.r, animationDelay: f.d }}>
            <ProductArt form={f.form} className="size-[72%]" />
          </div>
        </motion.div>
      ))}

      <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1 }} className="absolute -bottom-4 left-0 sm:left-[-6%]">
        <div className="glass flex items-center gap-3 rounded-2xl p-3 pr-5 shadow-2xl shadow-ink/10">
          <span className="grid size-11 place-items-center rounded-xl bg-brand text-white"><Truck className="size-5" /></span>
          <span>
            <span className="block text-sm font-bold">Pan-India & export dispatch</span>
            <span className="block text-xs text-muted">Reply to enquiries within {site.replyWithin}</span>
          </span>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }} className="absolute right-0 top-[40%] hidden sm:block sm:right-[-4%]">
        <div className="glass flex items-center gap-2 rounded-2xl px-4 py-3 shadow-2xl shadow-ink/10">
          <BadgeCheck className="size-6 text-brand" />
          <span className="text-sm font-bold leading-tight">Licensed<br /><span className="font-medium text-muted">sourcing only</span></span>
        </div>
      </motion.div>
    </motion.div>
  )
}

const TRUST = ['Licensed manufacturers', 'Batch & expiry on every invoice', 'Slab pricing for bulk', 'Pan-India dispatch', 'Export documentation', 'GST invoicing', 'Cold-chain on request', 'One named contact']

function TrustMarquee() {
  return (
    <div className="relative overflow-hidden border-y border-line bg-white py-5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />
      <div className="flex w-max animate-marquee gap-12 hover:[animation-play-state:paused]">
        {[...TRUST, ...TRUST].map((t, i) => (
          <span key={i} className="flex items-center gap-3 whitespace-nowrap text-sm font-semibold text-ink/70">
            <Sparkles className="size-4 text-amber" /> {t}
          </span>
        ))}
      </div>
    </div>
  )
}

function Categories() {
  const cats = useAsync(() => api.categories(), [])
  const counts = useAsync(() => api.categoryCounts(), [])
  return (
    <section className="container-x py-12">
      <SectionHeading eyebrow="Shop by category" title="Our product range" action={<Link href="/products" className="group flex items-center gap-1 text-sm font-semibold text-brand">View all categories <ChevronRight className="size-4 transition group-hover:translate-x-1" /></Link>} />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {(cats.data ?? Array.from({ length: 8 })).map((c, i) =>
          !c ? (
            <Skeleton key={i} className="h-24" />
          ) : (
            <Reveal key={c.slug} delay={i * 0.05}>
              <Link href={`/products/${c.slug}`} className="group card relative flex items-center gap-4 overflow-hidden p-4 transition-all duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-xl hover:shadow-brand/10 sm:p-5">
                <span className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-brand to-brand-400 transition-transform duration-500 group-hover:scale-x-100" />
                <span className="relative grid size-12 shrink-0 place-items-center rounded-xl bg-mist font-bold text-brand transition-colors group-hover:bg-white/15 group-hover:text-white">
                  <ProductArt form={c.form} className="size-9" />
                </span>
                <span className="relative min-w-0">
                  <span className="block font-semibold leading-snug transition-colors group-hover:text-white">{c.name}</span>
                  <span className="block text-xs text-muted transition-colors group-hover:text-white/80">{counts.data?.[c.slug] ?? '–'} products</span>
                </span>
                <ArrowRight className="relative ml-auto size-4 shrink-0 -translate-x-2 text-white opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
              </Link>
            </Reveal>
          ),
        )}
      </div>
    </section>
  )
}

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'tablets', label: 'Tablets' },
  { key: 'capsules', label: 'Capsules' },
  { key: 'injections', label: 'Injections' },
]

function Popular() {
  const [tab, setTab] = useState('all')
  const { data, loading } = useAsync(() => api.featured(), [])
  const list = (data ?? []).filter((p) => tab === 'all' || p.category === tab)
  return (
    <section className="bg-gradient-to-b from-white to-mist/60 py-12">
      <div className="container-x">
        <SectionHeading
          eyebrow="Featured"
          title="Popular products"
          action={
            <div className="flex flex-wrap gap-2 rounded-full border border-line bg-white p-1">
              {TABS.map((t) => (
                <button key={t.key} onClick={() => setTab(t.key)} className={`relative rounded-full px-4 py-2 text-sm font-medium transition ${tab === t.key ? 'text-white' : 'text-ink hover:text-brand'}`}>
                  {tab === t.key && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                  <span className="relative">{t.label}</span>
                </button>
              ))}
            </div>
          }
        />
        <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-80" />)
            : <AnimatePresence mode="popLayout">{list.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}</AnimatePresence>}
        </motion.div>
        <div className="mt-8 text-center">
          <Link href="/products" className="btn-ghost">Browse all products <ArrowRight className="size-4" /></Link>
        </div>
      </div>
    </section>
  )
}

function Stats() {
  return (
    <section className="container-x -mb-16 relative z-10">
      <Reveal>
        <div className="grid grid-cols-2 overflow-hidden rounded-3xl bg-gradient-to-r from-brand to-brand-400 text-white shadow-2xl shadow-brand/30 lg:grid-cols-4">
          {site.stats.map((s, i) => (
            <div key={s.label} className={`relative p-6 text-center sm:p-8 ${i > 0 ? 'lg:border-l' : ''} ${i % 2 ? 'border-l' : ''} ${i > 1 ? 'border-t lg:border-t-0' : ''} border-white/15`}>
              <p className="text-3xl font-extrabold sm:text-4xl"><Counter to={s.value} suffix={s.suffix} /></p>
              <p className="mt-1 text-sm text-white/80">{s.label}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}

function Welcome() {
  return (
    <section className="relative overflow-hidden bg-ink pb-12 pt-28 text-white">
      <div className="absolute inset-0 grid-dots opacity-[0.06]" />
      <div className="absolute -right-40 top-20 size-[32rem] rounded-full bg-brand/30 blur-3xl animate-blob" />
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow !text-amber">Welcome to</p>
          <h2 className="mt-3 text-4xl font-bold sm:text-5xl">Nirmal LifeCare</h2>
          <p className="mt-5 max-w-lg leading-relaxed text-white/70">{site.intro}</p>
          <Link href="/about" className="btn mt-8 border border-amber text-amber hover:bg-amber hover:text-ink">Read our story <ArrowRight className="size-4" /></Link>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-3">
            {site.facts.map((f) => (
              <div key={f.label} className="group bg-ink p-5 transition hover:bg-ink-2 sm:p-6">
                <p className="text-xs text-white/50">{f.label}</p>
                <p className="mt-2 font-semibold text-white transition group-hover:text-amber">{f.value}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

const WHY = [
  { Icon: FileCheck2, title: 'Licensed sourcing', body: 'Stock from licensed manufacturers, with batch number and expiry shared on every invoice.' },
  { Icon: IndianRupee, title: 'Clear bulk pricing', body: 'Per-strip and per-box rates up front, with slab pricing for larger quantities.' },
  { Icon: PackageCheck, title: 'Reliable dispatch', body: 'Packed to protect strips and vials, shipped with tracking across India and to export markets.' },
  { Icon: Headphones, title: 'One point of contact', body: 'A named person handles your enquiry from quote to delivery, on call, email or WhatsApp.' },
]

function Why() {
  return (
    <section className="container-x py-14">
      <SectionHeading center eyebrow="Why buyers choose us" title={<>Built for <span className="text-gradient">repeat, bulk</span> orders</>} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {WHY.map(({ Icon, title, body }, i) => (
          <Reveal key={title} delay={i * 0.08}>
            <Tilt className="h-full" max={6}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-line bg-mist/60 p-7 transition-all duration-300 hover:border-brand/30 hover:bg-white hover:shadow-2xl hover:shadow-brand/10">
                <span className="absolute -right-6 -top-6 text-8xl font-black text-brand/5 transition group-hover:text-brand/10">0{i + 1}</span>
                <span className="relative grid size-12 place-items-center rounded-xl bg-white text-brand shadow-sm transition-all duration-500 group-hover:rotate-[10deg] group-hover:bg-brand group-hover:text-white">
                  <Icon className="size-6" />
                </span>
                <h3 className="relative mt-5 text-lg font-semibold">{title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted">{body}</p>
              </div>
            </Tilt>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Reviews() {
  const { data } = useAsync(() => api.testimonials(), [])
  return (
    <section className="bg-mist/70 py-12">
      <div className="container-x">
        <SectionHeading title="What our buyers say" action={<Link href="/testimonials" className="group flex items-center gap-1 text-sm font-semibold text-brand">All testimonials <ChevronRight className="size-4 transition group-hover:translate-x-1" /></Link>} />
        <div className="grid gap-5 md:grid-cols-3">
          {(data ?? []).slice(0, 3).map((t, i) => (
            <Reveal key={t.id} delay={i * 0.08}>
              <TestimonialCard t={t} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function EnquiryBand() {
  return (
    <section className="container-x py-12">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand via-brand-600 to-ink p-8 shadow-2xl shadow-brand/30 sm:p-12">
          <div className="absolute -right-20 -top-20 size-72 rounded-full bg-amber/30 blur-3xl animate-blob" />
          <div className="absolute inset-0 grid-dots opacity-10" />
          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            <div className="text-white">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold"><Clock className="size-3.5" /> Reply within {site.replyWithin}</span>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Get in touch for the best bulk deals</h2>
              <p className="mt-4 max-w-md text-white/75">Tell us the products and quantities you need. We’ll reply with rates and availability.</p>
            </div>
            <QuickEnquiry source="home" />
          </div>
        </div>
      </Reveal>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <TrustMarquee />
      <Categories />
      <Popular />
      <Stats />
      <Welcome />
      <Why />
      <Reviews />
      <EnquiryBand />
    </>
  )
}
