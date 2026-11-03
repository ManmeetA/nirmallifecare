'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronRight, PackageSearch } from 'lucide-react'
import { api } from '../lib/api'
import { useAsync } from '../lib/hooks'
import type { Product } from '../lib/types'
import { useUI } from '../context/ui'
import ProductArt from '../components/ProductArt'
import { Breadcrumbs, PageHero, Reveal, Skeleton } from '../components/primitives'

export default function Products() {
  const { openQuote } = useUI()
  const cats = useAsync(() => api.categories(), [])
  const counts = useAsync(() => api.categoryCounts(), [])
  // First four products of each category for the preview lists.
  const all = useAsync(() => api.products({ pageSize: 500 }), [])
  const byCat = (slug: string) => (all.data?.items ?? []).filter((p: Product) => p.category === slug).slice(0, 4)

  const [active, setActive] = useState<string>('')
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-cat]')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.getAttribute('data-cat')!)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [cats.data])

  return (
    <>
      <PageHero>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Products & Services' }]} />
        <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">
          Products <span className="text-gradient">&</span> Services
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">Browse our full range by category. Every product page lists strength, pack size and rate — send an enquiry for bulk pricing.</p>
      </PageHero>

      {/* Sticky category jump bar */}
      <div className="sticky top-16 z-30 border-b border-line bg-white/85 backdrop-blur-xl">
        <div className="container-x flex gap-2 overflow-x-auto py-3 [scrollbar-width:none]">
          {(cats.data ?? []).map((c) => (
            <a key={c.slug} href={`#${c.slug}`} className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${active === c.slug ? 'text-white' : 'text-ink hover:bg-mist'}`}>
              {active === c.slug && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-brand" />}
              <span className="relative">{c.name}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="container-x grid gap-6 py-10 md:grid-cols-2">
        {(cats.data ?? Array.from({ length: 4 })).map((c, i) =>
          !c ? (
            <Skeleton key={i} className="h-72" />
          ) : (
            <Reveal key={c.slug} delay={(i % 2) * 0.08}>
              <section id={c.slug} data-cat={c.slug} className="group card scroll-mt-36 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-brand/10">
                <div className="grid sm:grid-cols-[200px_1fr]">
                  <Link href={`/products/${c.slug}`} className="relative grid min-h-44 place-items-center overflow-hidden bg-gradient-to-br from-mist to-mint">
                    <div className="absolute inset-0 grid-dots" />
                    <span className="absolute left-4 top-4 rounded-lg bg-white px-2 py-1 text-xs font-bold text-brand shadow-sm">{c.short}</span>
                    <ProductArt form={c.form} className="relative size-28 drop-shadow-xl transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110" />
                  </Link>
                  <div className="p-6">
                    <div className="flex items-baseline justify-between gap-3">
                      <h2 className="text-xl font-bold">{c.name}</h2>
                      <span className="shrink-0 rounded-full bg-mist px-2.5 py-0.5 text-xs font-semibold text-brand">{counts.data?.[c.slug] ?? '–'} items</span>
                    </div>
                    <ul className="mt-4 divide-y divide-line">
                      {byCat(c.slug).map((p) => (
                        <li key={p.slug}>
                          <Link href={`/products/${c.slug}/${p.slug}`} className="group/item flex items-center justify-between py-2.5 text-sm transition hover:text-brand">
                            <span className="truncate">{p.name}</span>
                            <ChevronRight className="size-4 shrink-0 text-muted transition group-hover/item:translate-x-1 group-hover/item:text-brand" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link href={`/products/${c.slug}`} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">
                      View all {c.name} <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </section>
            </Reveal>
          ),
        )}
      </div>

      <div className="container-x pb-12">
        <Reveal>
          <div className="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-3xl border border-dashed border-brand/30 bg-mist p-8 text-center sm:flex-row sm:text-left">
            <div className="flex items-center gap-5">
              <span className="hidden size-14 place-items-center rounded-2xl bg-white text-brand shadow sm:grid"><PackageSearch className="size-7" /></span>
              <div>
                <h2 className="text-2xl font-bold">Can’t find a product?</h2>
                <p className="mt-1 text-muted">Send us the brand or molecule name — we source on request.</p>
              </div>
            </div>
            <button onClick={() => openQuote()} className="btn-primary btn-shine shrink-0">Send requirement <ArrowRight className="size-4" /></button>
          </div>
        </Reveal>
      </div>
    </>
  )
}
