'use client'

import { useState } from 'react'
import Link from 'next/link'
import { notFound, useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react'
import { api } from '../lib/api'
import { useAsync } from '../lib/hooks'
import type { Category as CategoryT, ProductQuery } from '../lib/types'
import { useUI } from '../context/ui'
import { ProductRow } from '../components/ProductCard'
import { Breadcrumbs, PageHero, Skeleton } from '../components/primitives'

const THERAPY = ['Cardiac', 'Diabetic', 'Thyroid', 'Gastro', 'Anti-infective', 'Ophthalmic', 'Dermatology', 'Analgesic']
const PACKAGING = ['Strip', 'Box', 'Bottle', 'Vial', 'Tube']
const PAGE_SIZE = 6

/** Page header; also used as the server-rendered Suspense fallback so the first HTML has the heading. */
export function CategoryHero({ cat, search = false, q = '' }: { cat?: CategoryT; search?: boolean; q?: string }) {
  return (
    <PageHero>
      <Breadcrumbs items={search ? [{ label: 'Home', to: '/' }, { label: 'Search' }] : [{ label: 'Home', to: '/' }, { label: 'Products & Services', to: '/products' }, { label: cat?.name ?? '…' }]} />
      <h1 className="mt-4 break-words text-3xl font-extrabold min-[380px]:text-4xl sm:text-5xl">
        {search ? <>Results for “<span className="text-gradient">{q}</span>”</> : cat ? `Pharmaceutical ${cat.name}` : <Skeleton className="h-12 w-80" />}
      </h1>
      {!search && cat && <p className="mt-4 max-w-2xl text-lg text-muted">{cat.description}</p>}
    </PageHero>
  )
}

/** Category listing (/products/:category) and search results (/search?q=). */
export default function Category({ search = false, initialCategory }: { search?: boolean; initialCategory?: CategoryT }) {
  const { category } = useParams<{ category?: string }>()
  const sp = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { openQuote } = useUI()
  const [drawer, setDrawer] = useState(false)

  const q = sp.get('q') ?? ''
  const therapy = sp.get('therapy')?.split(',').filter(Boolean) ?? []
  const packaging = sp.get('packaging')?.split(',').filter(Boolean) ?? []
  const sort = (sp.get('sort') as ProductQuery['sort']) || 'relevance'
  const page = Number(sp.get('page') || 1)

  const cats = useAsync(() => api.categories(), [])
  const counts = useAsync(() => api.categoryCounts(), [])
  const cat = cats.data?.find((c) => c.slug === category) ?? initialCategory
  const res = useAsync(
    () => api.products({ category: search ? undefined : category, q: search ? q : undefined, therapy, packaging, sort, page, pageSize: PAGE_SIZE }),
    [category, q, sp.get('therapy'), sp.get('packaging'), sort, page, search],
  )

  if (!search && cats.data && !cat) notFound()

  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(sp)
    for (const [k, v] of Object.entries(patch)) (v ? next.set(k, v) : next.delete(k))
    if (!('page' in patch)) next.delete('page')
    const qs = next.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }
  const toggle = (key: 'therapy' | 'packaging', val: string) => {
    const cur = key === 'therapy' ? therapy : packaging
    const next = cur.includes(val) ? cur.filter((x) => x !== val) : [...cur, val]
    update({ [key]: next.join(',') || null })
  }
  const clear = () => update({ therapy: null, packaging: null })
  const pages = res.data ? Math.max(1, Math.ceil(res.data.total / PAGE_SIZE)) : 1
  const chips = [...therapy.map((v) => ['therapy', v] as const), ...packaging.map((v) => ['packaging', v] as const)]

  const Sidebar = (
    <div className="space-y-5">
      <div className="card p-5">
        <h2 className="mb-3 font-semibold">Categories</h2>
        <ul className="space-y-1">
          {(cats.data ?? []).map((c) => (
            <li key={c.slug}>
              <Link href={`/products/${c.slug}`} className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${c.slug === category ? 'bg-mist font-semibold text-brand' : 'hover:bg-mist/60'}`}>
                {c.name}
                <span className="text-xs text-muted">{counts.data?.[c.slug] ?? ''}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="card p-5">
        <h2 className="mb-4 font-semibold">Filter</h2>
        {[
          { key: 'therapy' as const, title: 'Therapy area', options: THERAPY, sel: therapy },
          { key: 'packaging' as const, title: 'Packaging', options: PACKAGING, sel: packaging },
        ].map((g) => (
          <fieldset key={g.key} className="mb-5">
            <legend className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">{g.title}</legend>
            <div className="space-y-1">
              {g.options.map((o) => (
                <label key={o} className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-1.5 text-sm hover:text-brand">
                  <input type="checkbox" className="size-4 accent-[var(--color-brand)]" checked={g.sel.includes(o)} onChange={() => toggle(g.key, o)} />
                  {o}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        <button onClick={clear} className="btn-ghost w-full">Clear filters</button>
      </div>
    </div>
  )

  return (
    <>
      <CategoryHero cat={cat} search={search} q={q} />

      <div className="container-x grid gap-8 py-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">{Sidebar}</aside>

        <div className="min-w-0">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <p className="text-sm">
              <span className="font-bold">{res.data?.total ?? '…'}</span> products
            </p>
            <AnimatePresence>
              {chips.map(([k, v]) => (
                <motion.button key={k + v} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} onClick={() => toggle(k, v)} className="flex items-center gap-1 rounded-full bg-mist px-3 py-1 text-xs font-medium text-brand hover:bg-mint">
                  {v} <X className="size-3" />
                </motion.button>
              ))}
            </AnimatePresence>
            <button onClick={() => setDrawer(true)} className="btn-ghost !py-2 max-sm:order-last lg:hidden sm:ml-auto"><SlidersHorizontal className="size-4" /> Filters</button>
            <label className="flex items-center gap-2 text-sm text-muted max-sm:order-last max-sm:ml-auto lg:ml-auto">
              Sort by
              <select className="field !w-auto !py-2" value={sort} onChange={(e) => update({ sort: e.target.value === 'relevance' ? null : e.target.value })}>
                <option value="relevance">Relevance</option>
                <option value="name-asc">Name A–Z</option>
                <option value="name-desc">Name Z–A</option>
              </select>
            </label>
          </div>

          <div className="space-y-4">
            {res.loading && !res.data ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-44" />)
            ) : res.data?.items.length ? (
              <AnimatePresence mode="popLayout">
                {res.data.items.map((p, i) => <ProductRow key={p.slug} product={p} index={i} />)}
              </AnimatePresence>
            ) : (
              <div className="card flex flex-col items-center p-6 text-center sm:p-12">
                <p className="text-lg font-semibold">No products match these filters.</p>
                <p className="mt-1 text-muted">Try clearing a filter — or tell us what you need and we’ll source it.</p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button onClick={clear} className="btn-ghost">Clear filters</button>
                  <button onClick={() => openQuote({ requirement: q ? `Looking for: ${q}` : '' })} className="btn-primary">Send requirement</button>
                </div>
              </div>
            )}
          </div>

          {pages > 1 && (
            <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
              <button disabled={page <= 1} onClick={() => update({ page: String(page - 1) })} className="btn-ghost !px-3 !py-2"><ChevronLeft className="size-4" /> Prev</button>
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <button key={n} onClick={() => update({ page: n === 1 ? null : String(n) })} aria-current={n === page ? 'page' : undefined} className={`grid size-10 place-items-center rounded-xl text-sm font-semibold transition ${n === page ? 'bg-ink text-white' : 'border border-line hover:border-brand'}`}>
                  {n}
                </button>
              ))}
              <button disabled={page >= pages} onClick={() => update({ page: String(page + 1) })} className="btn-ghost !px-3 !py-2">Next <ChevronRight className="size-4" /></button>
            </nav>
          )}
        </div>
      </div>

      <AnimatePresence>
        {drawer && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} />
            <motion.div className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-mist p-5 lg:hidden" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">Filters</h2>
                <button onClick={() => setDrawer(false)} className="grid size-9 place-items-center rounded-full bg-white" aria-label="Close filters"><X className="size-5" /></button>
              </div>
              {Sidebar}
              <button onClick={() => setDrawer(false)} className="btn-primary mt-4 w-full">Show {res.data?.total ?? ''} products</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
