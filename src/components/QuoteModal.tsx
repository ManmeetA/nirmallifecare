'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Check, Loader2, X } from 'lucide-react'
import type { QuoteRequest } from '../context/ui'
import type { Enquiry, Unit } from '../lib/types'
import { api } from '../lib/api'
import { formatPrice, isValidEmail, isValidMobile } from '../lib/hooks'
import { site } from '../data/site'
import ProductArt from './ProductArt'
import { formOf } from './ProductCard'

const UNITS: Unit[] = ['Box', 'Strip', 'Vial', 'Bottle', 'Piece', 'Tube']
const TITLES = ['Mr.', 'Ms.', 'Mrs.', 'Dr.'] as const

export default function QuoteModal({ request, onClose }: { request: QuoteRequest; onClose: () => void }) {
  const p = request.product
  const [qty, setQty] = useState(request.quantity ?? 50)
  const [unit, setUnit] = useState<Unit>(request.unit ?? p?.unit ?? 'Box')
  const [touchedReq, setTouchedReq] = useState(!!request.requirement)
  const [requirement, setRequirement] = useState(request.requirement ?? '')
  const [title, setTitle] = useState<(typeof TITLES)[number]>('Mr.')
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [ref, setRef] = useState('')

  // Keep the requirement sentence in sync with qty/unit until the user edits it.
  useEffect(() => {
    if (!touchedReq && p) setRequirement(`I need ${qty} ${unit.toLowerCase()}${qty === 1 ? '' : unit === 'Box' ? 'es' : 's'} of ${p.name}.`)
  }, [qty, unit, p, touchedReq])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  async function submit(e: FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!requirement.trim()) errs.requirement = 'Tell us what you need'
    if (!name.trim()) errs.name = 'Enter your name'
    if (!isValidMobile(mobile)) errs.mobile = 'Enter a valid mobile number'
    if (email && !isValidEmail(email)) errs.email = 'Enter a valid email'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setStatus('sending')
    const payload: Enquiry = { source: 'quote-modal', requirement, quantity: qty, unit, title, name, mobile: `+91 ${mobile}`, email: email || undefined, productSlug: p?.slug }
    try {
      const r = await api.submitEnquiry(payload)
      setRef(r.id)
      setStatus('done')
    } catch (err) {
      setErrors({ form: (err as Error).message || 'Something went wrong. Please try again.' })
      setStatus('idle')
    }
  }

  return (
    <motion.div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-title"
        initial={{ y: 60, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.97 }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-line bg-mist/95 px-6 py-5 backdrop-blur">
          <div className="grid size-14 shrink-0 place-items-center rounded-xl border border-line bg-white">
            <ProductArt form={p ? formOf(p) : 'tablet'} className="size-10" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="quote-title" className="text-lg font-bold">Get the best quote</h2>
            <p className="truncate text-sm text-muted">{p ? `${p.name} · ${formatPrice(p)}${p.price != null ? ` / ${p.unit}` : ''}` : 'Tell us what you need — we reply with rates and availability.'}</p>
          </div>
          <button onClick={onClose} className="grid size-9 place-items-center rounded-full transition hover:rotate-90 hover:bg-white" aria-label="Close">
            <X className="size-5" />
          </button>
        </div>

        {status === 'done' ? (
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }} className="relative grid size-20 place-items-center rounded-full bg-brand text-white shadow-xl shadow-brand/30">
              <motion.span className="absolute inset-0 rounded-full border-2 border-brand" initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 1.8, opacity: 0 }} transition={{ duration: 1.2, repeat: Infinity }} />
              <Check className="size-10" strokeWidth={3} />
            </motion.div>
            <h3 className="mt-6 text-2xl font-bold">Enquiry sent!</h3>
            <p className="mt-2 max-w-sm text-muted">Thanks{name ? `, ${title} ${name}` : ''}. We’ll reply with rates and availability within {site.replyWithin}.</p>
            {ref && <p className="mt-4 rounded-full bg-mist px-4 py-1.5 text-sm font-medium text-brand">Reference: {ref}</p>}
            <button onClick={onClose} className="btn-primary mt-8">Done</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-4 px-6 py-6">
            <div>
              <label className="label" htmlFor="q-req">Describe your requirement</label>
              <textarea id="q-req" rows={3} className="field resize-none" value={requirement} placeholder="e.g. Atorvastatin 10 mg — 200 boxes" onChange={(e) => { setTouchedReq(true); setRequirement(e.target.value) }} />
              {errors.requirement && <p className="mt-1 text-xs text-red-600">{errors.requirement}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="q-qty">Quantity</label>
                <input id="q-qty" type="number" min={1} className="field" value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} />
              </div>
              <div>
                <label className="label" htmlFor="q-unit">Unit</label>
                <select id="q-unit" className="field" value={unit} onChange={(e) => setUnit(e.target.value as Unit)}>
                  {UNITS.map((u) => <option key={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <fieldset>
              <legend className="label">Title</legend>
              <div className="flex flex-wrap gap-2">
                {TITLES.map((t) => (
                  <label key={t} className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition ${title === t ? 'border-brand bg-mist font-semibold text-brand' : 'border-line hover:border-brand/50'}`}>
                    <input type="radio" name="title" className="sr-only" checked={title === t} onChange={() => setTitle(t)} />
                    {t}
                  </label>
                ))}
              </div>
            </fieldset>
            <div>
              <label className="label" htmlFor="q-name">Name</label>
              <input id="q-name" className="field" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="q-mob">Mobile number</label>
                <div className="flex">
                  <span className="grid place-items-center rounded-l-xl border border-r-0 border-line bg-mist px-3 text-sm text-muted">+91</span>
                  <input id="q-mob" type="tel" inputMode="tel" className="field !rounded-l-none" value={mobile} onChange={(e) => setMobile(e.target.value)} autoComplete="tel-national" />
                </div>
                {errors.mobile && <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>}
              </div>
              <div>
                <label className="label" htmlFor="q-email">Email</label>
                <input id="q-email" type="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>
            </div>
            {errors.form && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errors.form}</p>}
            <button type="submit" className="btn-primary btn-shine w-full !py-3.5 text-base" disabled={status === 'sending'}>
              {status === 'sending' ? <><Loader2 className="size-5 animate-spin" /> Sending…</> : 'Send enquiry'}
            </button>
            <p className="text-center text-xs text-muted">We usually reply within {site.replyWithin}.</p>
          </form>
        )}
      </motion.div>
    </motion.div>
  )
}
