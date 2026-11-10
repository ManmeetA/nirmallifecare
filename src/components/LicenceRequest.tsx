'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, FileLock2, Loader2, X } from 'lucide-react'
import { api } from '../lib/api'
import { isValidEmail, isValidMobile } from '../lib/hooks'
import { LICENCE_REQUEST_TAG } from '../lib/licence'
import PrivacyNote from './PrivacyNote'

/**
 * "Request licence copies" button + form. Full GST / drug-licence numbers are not
 * published on the site; buyers ask here and the request lands in the admin
 * Enquiries inbox tagged as a licence request, for the owner to verify and answer.
 */
export default function LicenceRequest({ className = 'btn-ghost', label = 'Request licence copies' }: { className?: string; label?: string }) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        <FileLock2 className="size-4" /> {label}
      </button>
      {mounted && createPortal(<AnimatePresence>{open && <Dialog onClose={() => setOpen(false)} />}</AnimatePresence>, document.body)}
    </>
  )
}

function Dialog({ onClose }: { onClose: () => void }) {
  const [f, setF] = useState({ firm: '', buyerDl: '', name: '', mobile: '', email: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const set = (k: keyof typeof f, v: string) => setF((x) => ({ ...x, [k]: v }))

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
    if (!f.firm.trim()) errs.firm = 'Enter your firm / pharmacy name'
    if (f.buyerDl.trim().length < 5) errs.buyerDl = 'Enter your drug licence number'
    if (!f.name.trim()) errs.name = 'Enter your name'
    if (!isValidMobile(f.mobile)) errs.mobile = 'Enter a valid mobile number'
    if (f.email && !isValidEmail(f.email)) errs.email = 'Enter a valid email'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setStatus('sending')
    try {
      await api.submitEnquiry({
        source: 'contact',
        requirement: `${LICENCE_REQUEST_TAG} Firm: ${f.firm.trim()} · Buyer drug licence: ${f.buyerDl.trim()}`,
        company: f.firm.trim(),
        name: f.name.trim(),
        mobile: `+91 ${f.mobile}`,
        email: f.email || undefined,
      })
      setStatus('done')
    } catch (err) {
      setErrors({ form: (err as Error).message })
      setStatus('idle')
    }
  }

  const err = (k: string) => errors[k] && <p className="mt-1 text-xs text-red-600">{errors[k]}</p>

  return (
    <motion.div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lic-title"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        <div className="flex items-start gap-3 border-b border-line bg-mist px-6 py-5">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-brand"><FileLock2 className="size-5" /></span>
          <div className="flex-1">
            <h2 id="lic-title" className="text-lg font-bold">Request licence copies</h2>
            <p className="text-sm text-muted">GST and drug licence copies are shared with licensed buyers after verification.</p>
          </div>
          <button onClick={onClose} className="grid size-9 place-items-center rounded-full transition hover:bg-white" aria-label="Close"><X className="size-5" /></button>
        </div>

        {status === 'done' ? (
          <div className="flex flex-col items-center px-6 py-10 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-brand text-white shadow-lg shadow-brand/30"><Check className="size-8" strokeWidth={3} /></span>
            <h3 className="mt-5 text-xl font-bold">Request received</h3>
            <p className="mt-2 text-sm text-muted">We’ll verify your licence and share the copies by email or WhatsApp.</p>
            <button onClick={onClose} className="btn-primary mt-6">Done</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-4 px-6 py-6">
            <div><label className="label" htmlFor="lr-firm">Firm / pharmacy name</label><input id="lr-firm" className="field" value={f.firm} onChange={(e) => set('firm', e.target.value)} autoComplete="organization" />{err('firm')}</div>
            <div><label className="label" htmlFor="lr-dl">Your drug licence number</label><input id="lr-dl" className="field" value={f.buyerDl} onChange={(e) => set('buyerDl', e.target.value)} placeholder="e.g. UP14…" />{err('buyerDl')}</div>
            <div><label className="label" htmlFor="lr-name">Your name</label><input id="lr-name" className="field" value={f.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" />{err('name')}</div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="lr-mob">Mobile number</label>
                <div className="flex"><span className="grid place-items-center rounded-l-xl border border-r-0 border-line bg-mist px-3 text-sm text-muted">+91</span><input id="lr-mob" type="tel" className="field !rounded-l-none" value={f.mobile} onChange={(e) => set('mobile', e.target.value)} autoComplete="tel-national" /></div>
                {err('mobile')}
              </div>
              <div><label className="label" htmlFor="lr-em">Email <span className="font-normal text-muted">(optional)</span></label><input id="lr-em" type="email" className="field" value={f.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" />{err('email')}</div>
            </div>
            {errors.form && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errors.form}</p>}
            <button type="submit" disabled={status === 'sending'} className="btn-primary w-full !py-3.5">
              {status === 'sending' ? <><Loader2 className="size-5 animate-spin" /> Sending…</> : 'Send request'}
            </button>
            <PrivacyNote />
          </form>
        )}
      </motion.div>
    </motion.div>
  )
}
