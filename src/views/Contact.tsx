'use client'

import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronRight, Clock, Loader2, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { api } from '../lib/api'
import { isValidEmail, isValidMobile } from '../lib/hooks'
import type { BuyerType } from '../lib/types'
import { site } from '../data/site'
import { Breadcrumbs, PageHero, Reveal } from '../components/primitives'

const BUYER_TYPES: BuyerType[] = ['Retail pharmacy', 'Hospital', 'Distributor', 'Wholesaler', 'Nursing home', 'Other']
const COUNTRIES = ['India', 'Nepal', 'Bangladesh', 'Sri Lanka', 'UAE', 'Kenya', 'Nigeria', 'Other']

const empty = { name: '', company: '', mobile: '', email: '', buyerType: 'Retail pharmacy' as BuyerType, country: 'India', requirement: '', whatsapp: true }

export default function Contact() {
  const [f, setF] = useState(empty)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [ref, setRef] = useState('')
  const set = <K extends keyof typeof empty>(k: K, v: (typeof empty)[K]) => setF((x) => ({ ...x, [k]: v }))

  async function submit(e: FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!f.name.trim()) errs.name = 'Enter your name'
    if (!isValidMobile(f.mobile)) errs.mobile = 'Enter a valid mobile number'
    if (f.email && !isValidEmail(f.email)) errs.email = 'Enter a valid email'
    if (!f.requirement.trim()) errs.requirement = 'Tell us the products, strength and quantity'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setStatus('sending')
    try {
      const r = await api.submitEnquiry({ source: 'contact', ...f, mobile: `+91 ${f.mobile}`, email: f.email || undefined })
      setRef(r.id)
      setStatus('done')
      setF(empty)
    } catch (err) {
      setErrors({ form: (err as Error).message })
      setStatus('idle')
    }
  }

  const info = [
    { Icon: MapPin, t: 'Address', body: <>{site.addressLine}<br />{site.cityLine}</>, link: { href: site.mapsHref, label: 'Get directions' } },
    { Icon: Phone, t: 'Phone & WhatsApp', body: <><a href={site.phoneHref} className="hover:text-brand">{site.phone}</a><br /><span className="text-muted">{site.hours}</span></>, link: { href: site.whatsappHref, label: 'Chat on WhatsApp' } },
    { Icon: Mail, t: 'Email', body: <a href={site.emailHref} className="hover:text-brand">{site.email}</a> },
  ]

  const err = (k: string) => errors[k] && <p className="mt-1 text-xs text-red-600">{errors[k]}</p>

  return (
    <>
      <PageHero>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Contact Us' }]} />
        <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">Let’s talk about <span className="text-gradient">your requirement</span></h1>
        <p className="mt-4 max-w-xl text-lg text-muted">Call, WhatsApp or send the form — we reply with rates and availability.</p>
      </PageHero>

      <section className="container-x grid gap-8 py-10 lg:grid-cols-[1fr_1.5fr]">
        <div className="space-y-5">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-ink p-7 text-white">
              <div className="absolute -right-10 -top-10 size-40 rounded-full bg-brand/50 blur-3xl" />
              <p className="eyebrow relative !text-amber">Contact person</p>
              <div className="relative mt-4 flex items-center gap-4">
                <span className="grid size-14 place-items-center rounded-2xl bg-white/10 text-lg font-bold">NL</span>
                <div>
                  <p className="text-xl font-bold">{site.contactPerson}</p>
                  <p className="text-sm text-white/60">{site.designation} · Nirmal LifeCare</p>
                </div>
              </div>
              <p className="relative mt-5 flex items-center gap-2 text-sm text-white/70"><Clock className="size-4 text-amber" /> Replies within {site.replyWithin}</p>
            </div>
          </Reveal>
          {info.map(({ Icon, t, body, link }, i) => (
            <Reveal key={t} delay={i * 0.06}>
              <div className="group card flex gap-4 p-5 transition hover:border-brand/40 hover:shadow-lg hover:shadow-brand/5">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-mist text-brand transition group-hover:bg-brand group-hover:text-white"><Icon className="size-5" /></span>
                <div className="text-sm">
                  <p className="font-semibold">{t}</p>
                  <p className="mt-1 leading-relaxed">{body}</p>
                  {link && <a href={link.href} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 font-semibold text-brand">{link.label} <ChevronRight className="size-4" /></a>}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="card relative overflow-hidden p-6 shadow-2xl shadow-brand/5 sm:p-8">
            <AnimatePresence mode="wait">
              {status === 'done' ? (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-16 text-center">
                  <motion.span initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 12 }} className="grid size-20 place-items-center rounded-full bg-brand text-white shadow-xl shadow-brand/30"><Check className="size-10" strokeWidth={3} /></motion.span>
                  <h2 className="mt-6 text-2xl font-bold">Thank you — enquiry received!</h2>
                  <p className="mt-2 text-muted">We’ll reply with rates and availability within {site.replyWithin}.</p>
                  {ref && <p className="mt-4 rounded-full bg-mist px-4 py-1.5 text-sm font-medium text-brand">Reference: {ref}</p>}
                  <button onClick={() => setStatus('idle')} className="btn-ghost mt-8">Send another enquiry</button>
                </motion.div>
              ) : (
                <motion.form key="form" exit={{ opacity: 0 }} onSubmit={submit} noValidate className="space-y-4">
                  <h2 className="text-2xl font-bold">Send an enquiry</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><label className="label" htmlFor="c-name">Full name</label><input id="c-name" className="field" value={f.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" />{err('name')}</div>
                    <div><label className="label" htmlFor="c-co">Company / pharmacy name</label><input id="c-co" className="field" value={f.company} onChange={(e) => set('company', e.target.value)} autoComplete="organization" /></div>
                    <div>
                      <label className="label" htmlFor="c-mob">Mobile number</label>
                      <div className="flex"><span className="grid place-items-center rounded-l-xl border border-r-0 border-line bg-mist px-3 text-sm text-muted">+91</span><input id="c-mob" type="tel" className="field !rounded-l-none" value={f.mobile} onChange={(e) => set('mobile', e.target.value)} autoComplete="tel-national" /></div>
                      {err('mobile')}
                    </div>
                    <div><label className="label" htmlFor="c-em">Email</label><input id="c-em" type="email" className="field" value={f.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" />{err('email')}</div>
                    <div><label className="label" htmlFor="c-bt">Buyer type</label><select id="c-bt" className="field" value={f.buyerType} onChange={(e) => set('buyerType', e.target.value as BuyerType)}>{BUYER_TYPES.map((b) => <option key={b}>{b}</option>)}</select></div>
                    <div><label className="label" htmlFor="c-ct">Country</label><select id="c-ct" className="field" value={f.country} onChange={(e) => set('country', e.target.value)}>{COUNTRIES.map((c) => <option key={c}>{c}</option>)}</select></div>
                  </div>
                  <div><label className="label" htmlFor="c-req">Describe your requirement</label><textarea id="c-req" rows={4} className="field resize-none" placeholder="Product names, strength and quantity" value={f.requirement} onChange={(e) => set('requirement', e.target.value)} />{err('requirement')}</div>
                  <label className="flex cursor-pointer items-center gap-3 text-sm">
                    <input type="checkbox" className="size-4 accent-[var(--color-brand)]" checked={f.whatsapp} onChange={(e) => set('whatsapp', e.target.checked)} />
                    <MessageCircle className="size-4 text-[#25D366]" /> Contact me on WhatsApp too
                  </label>
                  {errors.form && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errors.form}</p>}
                  <button type="submit" disabled={status === 'sending'} className="btn-primary btn-shine w-full !py-3.5 text-base">
                    {status === 'sending' ? <><Loader2 className="size-5 animate-spin" /> Sending…</> : 'Submit enquiry'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </section>

      <section className="container-x pb-12">
        <Reveal>
          {/* Replace the query with the business's exact address or a Google Maps embed URL */}
          <div className="overflow-hidden rounded-3xl border border-line shadow-xl shadow-brand/5">
            <iframe title="Nirmal LifeCare location" src="https://www.google.com/maps?q=India&z=5&output=embed" className="h-96 w-full grayscale-[30%]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </Reveal>
      </section>
    </>
  )
}
