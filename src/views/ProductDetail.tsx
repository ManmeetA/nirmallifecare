'use client'

import { useState } from 'react'
import { notFound, useParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, CalendarClock, CreditCard, FileCheck2, MessageCircle, Minus, Phone, Plus, Share2, Truck } from 'lucide-react'
import { api } from '../lib/api'
import { formatPrice, useAsync } from '../lib/hooks'
import type { Category, Product, Unit } from '../lib/types'
import { site } from '../data/site'
import { useUI } from '../context/ui'
import { ProductCard, ProductMedia, formLabel } from '../components/ProductCard'
import { Breadcrumbs, Reveal, Skeleton, Tilt } from '../components/primitives'

const UNITS: Unit[] = ['Box', 'Strip', 'Vial', 'Bottle', 'Piece', 'Tube']
const TABS = ['Description', 'Specifications', 'Shipping & ordering'] as const

/** `initialProduct`/`initialCategory` come from the server so the first HTML has real content. */
export default function ProductDetail({ initialProduct, initialCategory }: { initialProduct?: Product; initialCategory?: Category }) {
  const { slug, category } = useParams<{ slug: string; category: string }>()
  const { openQuote, toast } = useUI()
  const prod = useAsync(() => api.product(slug), [slug])
  const related = useAsync(() => api.related(slug), [slug])
  const cats = useAsync(() => api.categories(), [])
  const [qty, setQty] = useState(50)
  const [unit, setUnit] = useState<Unit | null>(null)
  const [tab, setTab] = useState<(typeof TABS)[number]>('Description')
  const [thumb, setThumb] = useState(0)
  const p = prod.data ?? initialProduct

  if (prod.error && !initialProduct) notFound()
  const cat = cats.data?.find((c) => c.slug === (p?.category ?? category)) ?? initialCategory
  const u = unit ?? p?.unit ?? 'Box'

  const share = async () => {
    const data = { title: p?.name, url: window.location.href }
    if (navigator.share) await navigator.share(data).catch(() => {})
    else {
      await navigator.clipboard.writeText(window.location.href)
      toast({ kind: 'success', title: 'Link copied to clipboard' })
    }
  }

  const waText = encodeURIComponent(`Hello Nirmal LifeCare, I'd like a quote for ${qty} ${u} of ${p?.name ?? ''}.`)

  return (
    <>
      <div className="container-x pt-8">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Products', to: '/products' }, { label: cat?.name ?? '…', to: `/products/${category}` }, { label: p?.name ?? '…' }]} />
      </div>

      <section className="container-x grid gap-10 py-8 lg:grid-cols-2 lg:gap-14">
        {/* Gallery */}
        <div>
          {p ? (
            <Tilt max={5}>
              <div className="group relative">
                <AnimatePresence mode="wait">
                  <motion.div key={thumb} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                    <ProductMedia product={p} className="aspect-square rounded-3xl border border-line" artClass={`size-1/2 ${thumb % 2 ? '-rotate-12' : ''}`} />
                  </motion.div>
                </AnimatePresence>
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand shadow backdrop-blur">{formLabel(p)}</span>
              </div>
            </Tilt>
          ) : (
            <Skeleton className="aspect-square rounded-3xl" />
          )}
          <div className="mt-4 grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <button key={i} onClick={() => setThumb(i)} className={`overflow-hidden rounded-2xl border-2 transition ${thumb === i ? 'border-brand shadow-lg shadow-brand/20' : 'border-transparent opacity-70 hover:opacity-100'}`} aria-label={`View image ${i + 1}`}>
                {p ? <ProductMedia product={p} className="aspect-square" artClass={`size-1/2 ${i % 2 ? '-rotate-12' : ''}`} /> : <Skeleton className="aspect-square" />}
              </button>
            ))}
          </div>
        </div>

        {/* Buy box */}
        <div>
          {p ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-start justify-between gap-4">
                <span className="rounded-full bg-mist px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand">{formLabel(p)} · {p.therapy[0]}</span>
                <button onClick={share} className="grid size-10 place-items-center rounded-full border border-line transition hover:border-brand hover:text-brand" aria-label="Share"><Share2 className="size-4" /></button>
              </div>
              <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">{p.name}</h1>
              <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-3xl font-extrabold text-brand">{formatPrice(p)}</span>
                {p.price != null && <span className="text-muted">per {p.unit.toLowerCase()}</span>}
                <span className="text-sm text-muted">· Minimum order {p.moq ?? '[MOQ]'} {p.unit.toLowerCase()}{p.unit === 'Box' ? 'es' : 's'}</span>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-line p-4 text-sm">
                <div><p className="text-muted">Strength</p><p className="font-semibold">{p.strength}</p></div>
                <div><p className="text-muted">Pack</p><p className="font-semibold">{p.pack}</p></div>
                <div><p className="text-muted">Composition</p><p className="font-semibold">{p.composition}</p></div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-[auto_auto_1fr]">
                <div>
                  <label className="label" htmlFor="pd-qty">Quantity</label>
                  <div className="flex items-center rounded-xl border border-line">
                    <button onClick={() => setQty((q) => Math.max(1, q - 10))} className="grid size-11 place-items-center text-muted hover:text-brand" aria-label="Decrease"><Minus className="size-4" /></button>
                    <input id="pd-qty" type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} className="w-16 bg-transparent text-center font-semibold outline-none" />
                    <button onClick={() => setQty((q) => q + 10)} className="grid size-11 place-items-center text-muted hover:text-brand" aria-label="Increase"><Plus className="size-4" /></button>
                  </div>
                </div>
                <div>
                  <label className="label" htmlFor="pd-unit">Unit</label>
                  <select id="pd-unit" className="field !py-2.5" value={u} onChange={(e) => setUnit(e.target.value as Unit)}>
                    {UNITS.map((x) => <option key={x}>{x}</option>)}
                  </select>
                </div>
                <div className="flex items-end">
                  <button onClick={() => openQuote({ product: p, quantity: qty, unit: u })} className="btn-primary btn-shine w-full !py-3.5 text-base">Get best quote</button>
                </div>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <a href={site.phoneHref} className="btn-ghost !py-3"><Phone className="size-4" /> Call {site.phone}</a>
                <a href={`${site.whatsappHref}?text=${waText}`} target="_blank" rel="noreferrer" className="btn-ghost !py-3 hover:!border-[#25D366] hover:!text-[#128C7E]"><MessageCircle className="size-4" /> Chat on WhatsApp</a>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl bg-mist p-4 text-sm">
                {[
                  { Icon: CalendarClock, t: 'Batch & expiry', v: 'Shared on invoice' },
                  { Icon: Truck, t: 'Dispatch', v: site.dispatchDays },
                  { Icon: CreditCard, t: 'Payment', v: site.paymentTerms },
                ].map(({ Icon, t, v }) => (
                  <div key={t}>
                    <Icon className="mb-1.5 size-5 text-brand" />
                    <p className="font-semibold">{t}</p>
                    <p className="text-muted">{v}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-40" />
            </div>
          )}
        </div>
      </section>

      {/* Tabs */}
      {p && (
        <section className="container-x pb-10">
          <div className="flex gap-1 overflow-x-auto border-b border-line" role="tablist">
            {TABS.map((t) => (
              <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`relative shrink-0 px-5 py-3.5 text-sm font-medium transition ${tab === t ? 'text-ink' : 'text-muted hover:text-ink'}`}>
                {t}
                {tab === t && <motion.span layoutId="pd-tab" className="absolute inset-x-0 -bottom-px h-0.5 bg-brand" />}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="max-w-3xl py-6 leading-relaxed text-ink/80">
              {tab === 'Description' && (
                <>
                  <p>{p.description ?? '[Product description — therapeutic use, manufacturer, storage conditions and any prescription requirement. Keep to 3–5 short sentences.]'}</p>
                  <p className="mt-5 flex items-start gap-3 rounded-xl bg-cream px-4 py-3 text-sm text-amber-900">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
                    Prescription medicine. Supplied only to licensed pharmacies, hospitals and distributors.
                  </p>
                </>
              )}
              {tab === 'Specifications' && (
                <dl className="overflow-hidden rounded-2xl border border-line text-sm">
                  {[
                    ['Product name', p.name],
                    ['Composition', p.composition],
                    ['Strength', p.strength],
                    ['Pack size', p.pack],
                    ['Selling unit', p.unit],
                    ['Packaging', p.packaging],
                    ['Therapy area', p.therapy.join(', ')],
                    ['Manufacturer', '[Manufacturer]'],
                    ['Storage', '[Storage conditions]'],
                  ].map(([k, v], i) => (
                    <div key={k} className={`grid grid-cols-[180px_1fr] ${i % 2 ? 'bg-white' : 'bg-mist/60'}`}>
                      <dt className="px-4 py-3 text-muted">{k}</dt>
                      <dd className="px-4 py-3 font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {tab === 'Shipping & ordering' && (
                <ul className="space-y-3">
                  {[
                    `Minimum order: ${p.moq ?? '[MOQ]'} ${p.unit.toLowerCase()}s. Slab pricing available for larger quantities.`,
                    `Dispatch within ${site.dispatchDays} of payment confirmation, with tracking.`,
                    'Batch number and expiry date printed on every GST invoice.',
                    'Packed to protect strips and vials; cold-chain packing on request.',
                    'Export orders ship with the required documentation.',
                  ].map((s) => (
                    <li key={s} className="flex items-start gap-3"><FileCheck2 className="mt-0.5 size-5 shrink-0 text-brand" /> {s}</li>
                  ))}
                </ul>
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      )}

      {/* Related */}
      {!!related.data?.length && (
        <section className="bg-mist/70 py-12">
          <div className="container-x">
            <Reveal><h2 className="mb-8 text-3xl font-bold">Related products</h2></Reveal>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.data.map((r, i) => <ProductCard key={r.slug} product={r} index={i} compact />)}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
