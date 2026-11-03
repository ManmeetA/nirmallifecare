'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { api } from '../lib/api'
import { useAsync } from '../lib/hooks'
import type { Testimonial } from '../lib/types'
import TestimonialCard from '../components/TestimonialCard'
import { Breadcrumbs, PageHero, Reveal, Skeleton, Stars } from '../components/primitives'

const FILTERS = ['All', 'Product quality', 'Response', 'Delivery'] as const
const STEP = 6

export default function Testimonials() {
  const { data, loading } = useAsync(() => api.testimonials(), [])
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')
  const [shown, setShown] = useState(STEP)

  const all = data ?? []
  const list = all.filter((t: Testimonial) => filter === 'All' || t.topic === filter)
  const avg = all.length ? all.reduce((s, t) => s + t.rating, 0) / all.length : 0
  const dist = [5, 4, 3, 2, 1].map((r) => ({ r, n: all.filter((t) => t.rating === r).length }))

  return (
    <>
      <PageHero>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Testimonials' }]} />
        <div className="mt-4 grid items-end gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <h1 className="text-4xl font-extrabold sm:text-5xl">What buyers <span className="text-gradient">say about us</span></h1>
            <p className="mt-4 max-w-xl text-lg text-muted">Feedback from pharmacies, hospitals and distributors we supply.</p>
          </div>
          <Reveal>
            <div className="glass flex items-center gap-6 rounded-3xl p-6 shadow-xl shadow-brand/10">
              <div className="text-center">
                <p className="text-5xl font-extrabold">{avg ? avg.toFixed(1) : '–'}</p>
                <Stars value={Math.round(avg)} />
                <p className="mt-1 text-xs text-muted">from {all.length} reviews</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {dist.map(({ r, n }) => (
                  <div key={r} className="flex items-center gap-2 text-xs">
                    <span className="w-3 text-muted">{r}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
                      <motion.div className="h-full rounded-full bg-amber" initial={{ width: 0 }} animate={{ width: all.length ? `${(n / all.length) * 100}%` : 0 }} transition={{ duration: 1, delay: 0.3 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </PageHero>

      <section className="container-x py-10">
        <div className="mb-8 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => { setFilter(f); setShown(STEP) }} className={`relative rounded-full border px-5 py-2 text-sm font-medium transition ${filter === f ? 'border-ink text-white' : 'border-line hover:border-brand'}`}>
              {filter === f && <motion.span layoutId="t-pill" className="absolute inset-0 rounded-full bg-ink" />}
              <span className="relative">{f}</span>
            </button>
          ))}
        </div>
        <motion.div layout className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-60" />)
            : (
              <AnimatePresence mode="popLayout">
                {list.slice(0, shown).map((t, i) => (
                  <motion.div key={t.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: (i % STEP) * 0.05 }}>
                    <TestimonialCard t={t} showMeta />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
        </motion.div>
        {shown < list.length && (
          <div className="mt-8 text-center">
            <button onClick={() => setShown((s) => s + STEP)} className="btn-ghost">Load more reviews</button>
          </div>
        )}
      </section>
    </>
  )
}
