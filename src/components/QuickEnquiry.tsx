'use client'

import { useState, type FormEvent } from 'react'
import { Loader2, Send } from 'lucide-react'
import { api } from '../lib/api'
import { isValidEmail, isValidMobile } from '../lib/hooks'
import { useUI } from '../context/ui'
import type { Enquiry } from '../lib/types'
import PrivacyNote from './PrivacyNote'

/** Short requirement + mobile + email form used in the home "best bulk deals" band. */
export default function QuickEnquiry({ source = 'home', dark = true }: { source?: Enquiry['source']; dark?: boolean }) {
  const { toast } = useUI()
  const [requirement, setRequirement] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sending, setSending] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!requirement.trim()) errs.requirement = 'Tell us the products and quantities'
    if (!isValidMobile(mobile)) errs.mobile = 'Enter a valid mobile number'
    if (email && !isValidEmail(email)) errs.email = 'Enter a valid email'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setSending(true)
    try {
      const r = await api.submitEnquiry({ source, requirement, mobile: `+91 ${mobile}`, email: email || undefined })
      toast({ kind: 'success', title: 'Enquiry sent', body: `Reference ${r.id}. We’ll get back with rates and availability.` })
      setRequirement('')
      setMobile('')
      setEmail('')
    } catch (err) {
      toast({ kind: 'error', title: 'Could not send enquiry', body: (err as Error).message })
    } finally {
      setSending(false)
    }
  }

  const lbl = `mb-1.5 block text-sm font-medium ${dark ? 'text-white/80' : 'text-ink'}`
  const err = `mt-1 text-xs ${dark ? 'text-amber' : 'text-red-600'}`
  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div>
        <label className={lbl} htmlFor={`qe-req-${source}`}>Describe your requirement</label>
        <textarea id={`qe-req-${source}`} rows={3} className="field resize-none" placeholder="e.g. Atorvastatin 10 mg — 200 boxes" value={requirement} onChange={(e) => setRequirement(e.target.value)} />
        {errors.requirement && <p className={err}>{errors.requirement}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={lbl} htmlFor={`qe-mob-${source}`}>Mobile number</label>
          <div className="flex">
            <span className="grid place-items-center rounded-l-xl border border-r-0 border-line bg-mist px-3 text-sm text-muted">+91</span>
            <input id={`qe-mob-${source}`} type="tel" inputMode="tel" className="field !rounded-l-none" value={mobile} onChange={(e) => setMobile(e.target.value)} />
          </div>
          {errors.mobile && <p className={err}>{errors.mobile}</p>}
        </div>
        <div>
          <label className={lbl} htmlFor={`qe-em-${source}`}>Email</label>
          <input id={`qe-em-${source}`} type="email" className="field" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          {errors.email && <p className={err}>{errors.email}</p>}
        </div>
      </div>
      <button type="submit" disabled={sending} className="btn-amber btn-shine w-full !py-3.5 text-base">
        {sending ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-4" />} Send enquiry
      </button>
      <PrivacyNote light={dark} />
    </form>
  )
}
