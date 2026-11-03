'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Compass, Eye, HeartHandshake, Quote } from 'lucide-react'
import { site } from '../data/site'
import { useUI } from '../context/ui'
import ProductArt from '../components/ProductArt'
import { Breadcrumbs, PageHero, Reveal, SectionHeading, Tilt } from '../components/primitives'

const STEPS = [
  { t: 'Send enquiry', d: 'Share products, strength and quantity by form, call or WhatsApp.' },
  { t: 'Receive quote', d: 'We confirm rates, availability and dispatch date.' },
  { t: 'Confirm order', d: 'Approve the proforma invoice and complete payment.' },
  { t: 'Dispatch', d: 'Packed with batch and expiry details, shipped with tracking.' },
  { t: 'Delivery', d: 'We follow up until the order reaches you.' },
]

function Steps() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 60%'] })
  const width = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  return (
    <div ref={ref} className="relative">
      <div className="absolute left-[10%] right-[10%] top-6 hidden h-1 rounded-full bg-line lg:block">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-brand to-amber" style={{ width }} />
      </div>
      <ol className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {STEPS.map((s, i) => (
          <Reveal key={s.t} delay={i * 0.1}>
            <li className="group flex h-full flex-col items-center text-center">
              <span className="relative z-10 grid size-12 place-items-center rounded-full bg-brand text-lg font-bold text-white shadow-lg shadow-brand/30 ring-8 ring-mist transition-transform duration-500 group-hover:scale-110">
                {i + 1}
              </span>
              <div className="card mt-5 h-full w-full p-5 transition group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-brand/10">
                <h3 className="font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted">{s.d}</p>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </div>
  )
}

export default function About() {
  const { openQuote } = useUI()
  return (
    <>
      <PageHero dark>
        <Breadcrumbs light items={[{ label: 'Home', to: '/' }, { label: 'About Us' }]} />
        <h1 className="mt-5 max-w-3xl break-words text-3xl font-extrabold min-[380px]:text-4xl leading-tight sm:text-6xl">
          Supplying quality medicines <span className="text-gradient">with care</span> since {site.since}.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-white/70">[One-sentence positioning statement — who Nirmal Lifecare serves and what it supplies.]</p>
      </PageHero>

      <section className="container-x grid items-center gap-12 py-12 lg:grid-cols-2">
        <Reveal>
          <Tilt max={6}>
            {/* Replace with an office, warehouse or team photo */}
            <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-3xl bg-gradient-to-br from-mint via-mist to-white shadow-2xl shadow-brand/15">
              <div className="absolute inset-0 grid-dots" />
              <div className="absolute -bottom-10 -right-10 size-48 rounded-full bg-amber/30 blur-3xl" />
              <div className="relative grid grid-cols-3 gap-4">
                {(['tablet', 'capsule', 'injection', 'syrup', 'drops', 'cream'] as const).map((f, i) => (
                  <div key={f} className="glass grid size-20 place-items-center rounded-2xl shadow-lg animate-float sm:size-24" style={{ animationDelay: `${-i * 0.8}s` }}>
                    <ProductArt form={f} className="size-3/4" />
                  </div>
                ))}
              </div>
            </div>
          </Tilt>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="eyebrow">Our story</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">From a local pharma trader to a supplier buyers rely on</h2>
          <p className="mt-5 leading-relaxed text-muted">[Paragraph 1 — how and where the business started, and the founder’s background.]</p>
          <p className="mt-4 leading-relaxed text-muted">[Paragraph 2 — what the company supplies today, which buyers it serves, and the markets it exports to.]</p>
        </Reveal>
      </section>

      <section className="bg-mist/70 py-12">
        <div className="container-x grid gap-5 md:grid-cols-3">
          {[
            { Icon: Compass, t: 'Mission', d: '[Mission statement — one or two sentences.]' },
            { Icon: Eye, t: 'Vision', d: '[Vision statement — one or two sentences.]' },
            { Icon: HeartHandshake, t: 'Values', d: 'Genuine products, honest pricing, and replies you can count on.' },
          ].map(({ Icon, t, d }, i) => (
            <Reveal key={t} delay={i * 0.08}>
              <div className="group card relative h-full overflow-hidden p-7 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand/10">
                <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-brand to-amber transition-transform duration-500 group-hover:scale-x-100" />
                <Icon className="size-8 text-brand" />
                <h3 className="mt-4 text-xl font-bold">{t}</h3>
                <p className="mt-2 text-muted">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x grid gap-10 py-12 lg:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <p className="eyebrow">Factsheet</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Company at a glance</h2>
          <p className="mt-4 text-muted">Registration and trade details for buyers completing vendor onboarding.</p>
        </Reveal>
        <Reveal delay={0.1}>
          <dl className="overflow-hidden rounded-2xl border border-line">
            {[...site.facts, { label: 'GSTIN', value: site.gst }, { label: 'Contact person', value: `${site.contactPerson}, ${site.designation}` }].map((f, i) => (
              <div key={f.label} className={`grid text-sm transition hover:bg-mint/50 sm:grid-cols-[1fr_1.3fr] ${i % 2 ? 'bg-white' : 'bg-mist/60'}`}>
                <dt className="px-4 pt-3 text-xs text-muted sm:px-5 sm:py-3.5 sm:text-sm">{f.label}</dt>
                <dd className="break-words px-4 pb-3 pt-0.5 font-semibold sm:px-5 sm:py-3.5">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      <section className="bg-mist/70 py-12">
        <div className="container-x">
          <SectionHeading center eyebrow="Simple process" title="How ordering works" />
          <Steps />
        </div>
      </section>

      <section className="container-x py-12">
        <Reveal>
          <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12">
            {/* Replace with director photo */}
            <div className="relative shrink-0">
              <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-brand to-amber opacity-30 blur-xl" />
              <div className="relative grid size-40 place-items-center rounded-full bg-mint text-sm font-semibold text-brand ring-8 ring-white">[Director photo]</div>
            </div>
            <figure className="text-center md:text-left">
              <Quote className="mx-auto size-10 text-amber md:mx-0" />
              <blockquote className="mt-3 text-xl font-bold leading-snug sm:text-3xl">“{site.directorMessage}”</blockquote>
              <figcaption className="mt-4 text-muted"><span className="font-semibold text-ink">{site.director}</span> · Director, Nirmal Lifecare</figcaption>
            </figure>
          </div>
        </Reveal>
      </section>

      <section className="container-x pb-12">
        <Reveal>
          <div className="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-3xl bg-gradient-to-r from-brand to-brand-600 p-8 text-center sm:flex-row sm:p-10 sm:text-left">
            <div className="absolute -right-10 -top-10 size-60 rounded-full bg-amber/30 blur-3xl animate-blob" />
            <h2 className="relative text-2xl font-bold text-white sm:text-3xl">Ready to place a bulk order?</h2>
            <div className="relative flex flex-wrap justify-center gap-3">
              <button onClick={() => openQuote()} className="btn-amber btn-shine">Request a quote <ArrowRight className="size-4" /></button>
              <Link href="/contact" className="btn-outline-light">Contact us</Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
