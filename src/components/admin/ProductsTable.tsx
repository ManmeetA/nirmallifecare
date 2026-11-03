'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, Package, Pencil, PlusCircle, Search, Star, Trash2 } from 'lucide-react'
import { adminApi } from '@/lib/admin-api'
import { api } from '@/lib/api'
import { formatPrice, useAsync } from '@/lib/hooks'
import type { Product } from '@/lib/types'
import { useUI } from '@/context/ui'
import { revalidateCatalog } from '@/app/admin/actions'
import { ProductMedia } from '../ProductCard'
import { Badge, ConfirmDialog, EmptyState, PageHeader, Panel, Toggle, timeAgo } from './ui'

type Status = 'all' | 'active' | 'hidden' | 'featured'

export default function ProductsTable() {
  const { toast } = useUI()
  const [reload, setReload] = useState(0)
  const res = useAsync(() => adminApi.products(), [reload])
  const cats = useAsync(() => api.categories(), [])
  const [rows, setRows] = useState<Product[] | null>(null)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')
  const [status, setStatus] = useState<Status>('all')
  const [toDelete, setToDelete] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState(false)

  const all = rows ?? res.data ?? []
  const catName = (slug: string) => cats.data?.find((c) => c.slug === slug)?.name ?? slug

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return all.filter((p) => {
      if (cat && p.category !== cat) return false
      if (status === 'active' && !p.isActive) return false
      if (status === 'hidden' && p.isActive) return false
      if (status === 'featured' && !p.featured) return false
      return !needle || `${p.name} ${p.composition} ${p.slug}`.toLowerCase().includes(needle)
    })
  }, [all, q, cat, status])

  const counts = {
    all: all.length,
    active: all.filter((p) => p.isActive).length,
    hidden: all.filter((p) => !p.isActive).length,
    featured: all.filter((p) => p.featured).length,
  }

  // Optimistic flag updates with rollback on failure.
  async function flag(p: Product, patch: { featured?: boolean; isActive?: boolean }) {
    const before = all
    setRows(all.map((x) => (x.id === p.id ? { ...x, ...patch } : x)))
    try {
      await adminApi.setFlags(p.id!, patch)
      revalidateCatalog().catch(() => {})
    } catch (e) {
      setRows(before)
      toast({ kind: 'error', title: 'Update failed', body: (e as Error).message })
    }
  }

  async function confirmDelete() {
    if (!toDelete) return
    setDeleting(true)
    try {
      await adminApi.remove(toDelete)
      setRows(all.filter((x) => x.id !== toDelete.id))
      revalidateCatalog().catch(() => {})
      toast({ kind: 'success', title: 'Product deleted', body: toDelete.name })
      setToDelete(null)
    } catch (e) {
      toast({ kind: 'error', title: 'Couldn’t delete', body: (e as Error).message })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Products"
        subtitle={`${counts.all} products · ${counts.active} live · ${counts.featured} featured`}
        actions={<Link href="/admin/products/new" className="btn-primary btn-shine !py-2.5"><PlusCircle className="size-4" /> Add product</Link>}
      />

      <Panel>
        <div className="flex flex-wrap items-center gap-3 border-b border-line p-4">
          <div className="relative min-w-56 flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input className="field !py-2.5 !pl-10" placeholder="Search name, molecule or slug" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search products" />
          </div>
          <select className="field !w-auto !py-2.5" value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Filter by category">
            <option value="">All categories</option>
            {cats.data?.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
          <div className="flex rounded-xl border border-line p-1">
            {(['all', 'active', 'hidden', 'featured'] as Status[]).map((s) => (
              <button key={s} onClick={() => setStatus(s)} className={`relative rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${status === s ? 'text-white' : 'text-muted hover:text-ink'}`}>
                {status === s && <motion.span layoutId="status-pill" className="absolute inset-0 rounded-lg bg-ink" />}
                <span className="relative">{s} <span className="opacity-60">{counts[s]}</span></span>
              </button>
            ))}
          </div>
        </div>

        {res.error ? (
          <div className="p-6 text-sm text-red-700">Couldn’t load products: {res.error.message} <button className="ml-2 font-semibold underline" onClick={() => setReload((n) => n + 1)}>Retry</button></div>
        ) : res.loading && !rows ? (
          <div className="space-y-3 p-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-mist" />)}</div>
        ) : !list.length ? (
          <EmptyState
            icon={<Package className="size-6" />}
            title={all.length ? 'No products match these filters' : 'No products yet'}
            body={all.length ? 'Try a different search or clear the filters.' : 'Add your first product and it will appear on the website straight away.'}
            action={!all.length && <Link href="/admin/products/new" className="btn-primary !py-2.5">Add product</Link>}
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead className="bg-mist/50 text-left text-xs uppercase tracking-wider text-muted">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Product</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">Price</th>
                    <th className="px-4 py-3 text-center font-semibold">Featured</th>
                    <th className="px-4 py-3 text-center font-semibold">Live</th>
                    <th className="px-4 py-3 font-semibold">Updated</th>
                    <th className="px-4 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  <AnimatePresence initial={false}>
                    {list.map((p) => (
                      <motion.tr key={p.id} layout exit={{ opacity: 0 }} className="group transition hover:bg-mist/40">
                        <td className="px-4 py-3">
                          <Link href={`/admin/products/${p.id}`} className="flex items-center gap-3">
                            <ProductMedia product={p} className="size-12 shrink-0 rounded-lg" artClass="size-8" />
                            <span className="min-w-0">
                              <span className="block font-semibold group-hover:text-brand">{p.name}</span>
                              <span className="block truncate text-xs text-muted">{p.composition} · {p.strength} · {p.pack}</span>
                            </span>
                          </Link>
                        </td>
                        <td className="px-4 py-3"><Badge tone="brand">{catName(p.category)}</Badge></td>
                        <td className="whitespace-nowrap px-4 py-3">{p.price == null ? <span className="text-muted">On request</span> : <>{formatPrice(p)} <span className="text-xs text-muted">/{p.unit}</span></>}</td>
                        <td className="px-4 py-3 text-center">
                          <button onClick={() => flag(p, { featured: !p.featured })} aria-label={p.featured ? 'Unfeature' : 'Feature'} aria-pressed={!!p.featured} className="rounded-lg p-1.5 transition hover:bg-amber/10">
                            <Star className={`size-5 transition ${p.featured ? 'fill-amber text-amber' : 'text-line hover:text-amber'}`} />
                          </button>
                        </td>
                        <td className="px-4 py-3 text-center"><Toggle label={`Show ${p.name} on website`} checked={!!p.isActive} onChange={(v) => flag(p, { isActive: v })} /></td>
                        <td className="whitespace-nowrap px-4 py-3 text-xs text-muted">{p.updatedAt ? timeAgo(p.updatedAt) : '—'}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1 opacity-60 transition group-hover:opacity-100">
                            <Link href={`/admin/products/${p.id}`} className="grid size-8 place-items-center rounded-lg hover:bg-white hover:text-brand" aria-label={`Edit ${p.name}`} title="Edit"><Pencil className="size-4" /></Link>
                            <a href={`/products/${p.category}/${p.slug}`} target="_blank" rel="noreferrer" className="grid size-8 place-items-center rounded-lg hover:bg-white hover:text-brand" aria-label={`View ${p.name} on website`} title="View on website"><ExternalLink className="size-4" /></a>
                            <button onClick={() => setToDelete(p)} className="grid size-8 place-items-center rounded-lg hover:bg-red-50 hover:text-red-600" aria-label={`Delete ${p.name}`} title="Delete"><Trash2 className="size-4" /></button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <ul className="divide-y divide-line md:hidden">
              {list.map((p) => (
                <li key={p.id} className="flex items-center gap-3 p-4">
                  <ProductMedia product={p} className="size-14 shrink-0 rounded-xl" artClass="size-9" />
                  <Link href={`/admin/products/${p.id}`} className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{p.name}</p>
                    <p className="truncate text-xs text-muted">{catName(p.category)} · {p.price == null ? 'On request' : formatPrice(p)}</p>
                    <div className="mt-1 flex gap-1.5">
                      {p.isActive ? <Badge tone="green">Live</Badge> : <Badge>Hidden</Badge>}
                      {p.featured && <Badge tone="amber">Featured</Badge>}
                    </div>
                  </Link>
                  <button onClick={() => setToDelete(p)} className="grid size-9 place-items-center rounded-lg text-muted hover:bg-red-50 hover:text-red-600" aria-label={`Delete ${p.name}`}><Trash2 className="size-4" /></button>
                </li>
              ))}
            </ul>
          </>
        )}
      </Panel>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete this product?"
        body={<><b className="text-ink">{toDelete?.name}</b> and its images will be removed permanently. To keep it but hide it from buyers, switch off “Live” instead.</>}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  )
}
