'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Eye, EyeOff, Inbox, Package, PlusCircle, Star } from 'lucide-react'
import { adminApi } from '@/lib/admin-api'
import { api } from '@/lib/api'
import { useAsync } from '@/lib/hooks'
import ProductArt from '../ProductArt'
import { ProductMedia } from '../ProductCard'
import { Badge, EmptyState, Panel, timeAgo } from './ui'

const STATUS_TONE = { new: 'amber', contacted: 'brand', closed: 'gray' } as const

export default function Dashboard() {
  const products = useAsync(() => adminApi.products(), [])
  const enquiries = useAsync(() => adminApi.enquiries(), [])
  const cats = useAsync(() => api.categories(), [])

  const all = products.data ?? []
  const enq = enquiries.data ?? []
  const newEnq = enq.filter((e) => e.status === 'new').length
  const weekAgo = Date.now() - 7 * 864e5
  const thisWeek = enq.filter((e) => new Date(e.createdAt).getTime() > weekAgo).length

  const stats = [
    { label: 'Products', value: all.length, sub: `${all.filter((p) => p.isActive).length} live on the website`, Icon: Package, href: '/admin/products' },
    { label: 'Featured', value: all.filter((p) => p.featured).length, sub: 'shown on the home page', Icon: Star, href: '/admin/products' },
    { label: 'Hidden', value: all.filter((p) => !p.isActive).length, sub: 'not visible to buyers', Icon: EyeOff, href: '/admin/products' },
    { label: 'New enquiries', value: newEnq, sub: `${thisWeek} received this week`, Icon: Inbox, href: '/admin/enquiries', hot: newEnq > 0 },
  ]

  const perCat = (cats.data ?? []).map((c) => ({ ...c, n: all.filter((p) => p.category === c.slug).length }))
  const max = Math.max(1, ...perCat.map((c) => c.n))
  const loading = products.loading || enquiries.loading
  const hour = new Date().getHours()

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted">{hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'} 👋</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <a href="/" target="_blank" rel="noreferrer" className="btn-ghost !py-2.5"><Eye className="size-4" /> View site</a>
          <Link href="/admin/products/new" className="btn-primary btn-shine !py-2.5"><PlusCircle className="size-4" /> Add product</Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, sub, Icon, href, hot }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Link href={href} className={`group relative block overflow-hidden rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:shadow-xl ${hot ? 'border-amber/40 bg-gradient-to-br from-amber/10 to-white hover:shadow-amber/10' : 'border-line bg-white hover:shadow-brand/10'}`}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted">{label}</p>
                <span className={`grid size-9 place-items-center rounded-xl ${hot ? 'bg-amber text-ink' : 'bg-mist text-brand'}`}><Icon className="size-[18px]" /></span>
              </div>
              <p className="mt-3 text-3xl font-extrabold">{loading ? <span className="inline-block h-8 w-12 animate-pulse rounded bg-mist" /> : value}</p>
              <p className="mt-1 text-xs text-muted">{sub}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Panel>
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-semibold">Latest enquiries</h2>
            <Link href="/admin/enquiries" className="flex items-center gap-1 text-sm font-semibold text-brand">Open inbox <ArrowRight className="size-4" /></Link>
          </div>
          {enquiries.error ? (
            <p className="p-5 text-sm text-red-700">{enquiries.error.message}</p>
          ) : !enq.length && !loading ? (
            <EmptyState icon={<Inbox className="size-6" />} title="No enquiries yet" body="Quote requests from the website will show up here." />
          ) : (
            <ul className="divide-y divide-line">
              {enq.slice(0, 6).map((e) => (
                <li key={e.id}>
                  <Link href={`/admin/enquiries?open=${e.id}`} className="flex items-start gap-3 px-5 py-3.5 transition hover:bg-mist/40">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-mist text-xs font-bold uppercase text-brand">{(e.name || e.company || '?').slice(0, 2)}</span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold">{e.name || e.company || e.mobile}</span>
                        <Badge tone={STATUS_TONE[e.status]}>{e.status}</Badge>
                      </span>
                      <span className="block truncate text-sm text-muted">{e.requirement}</span>
                    </span>
                    <span className="shrink-0 text-xs text-muted">{timeAgo(e.createdAt)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel className="p-5">
          <h2 className="font-semibold">Products by category</h2>
          <ul className="mt-5 space-y-3.5">
            {perCat.map((c, i) => (
              <li key={c.slug} className="flex items-center gap-3">
                <ProductArt form={c.form} className="size-7 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="truncate">{c.name}</span>
                    <span className="font-semibold">{c.n}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-mist">
                    <motion.div className="h-full rounded-full bg-gradient-to-r from-brand to-brand-400" initial={{ width: 0 }} animate={{ width: `${(c.n / max) * 100}%` }} transition={{ duration: 0.8, delay: 0.2 + i * 0.05 }} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel className="mt-6">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-semibold">Recently updated products</h2>
          <Link href="/admin/products" className="flex items-center gap-1 text-sm font-semibold text-brand">All products <ArrowRight className="size-4" /></Link>
        </div>
        <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {all.slice(0, 4).map((p) => (
            <Link key={p.id} href={`/admin/products/${p.id}`} className="group flex items-center gap-3 bg-white p-4 transition hover:bg-mist/40">
              <ProductMedia product={p} className="size-12 shrink-0 rounded-lg" artClass="size-8" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold group-hover:text-brand">{p.name}</span>
                <span className="block text-xs text-muted">{p.updatedAt ? timeAgo(p.updatedAt) : ''}</span>
              </span>
            </Link>
          ))}
        </div>
      </Panel>
    </>
  )
}
