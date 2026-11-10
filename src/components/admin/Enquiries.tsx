'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Building2, ChevronDown, Globe2, Inbox, Mail, Package, Phone, Search, Trash2 } from 'lucide-react'
import { adminApi } from '@/lib/admin-api'
import { useAsync } from '@/lib/hooks'
import type { EnquiryRecord, EnquiryStatus } from '@/lib/types'
import { useUI } from '@/context/ui'
import { LICENCE_REQUEST_TAG, isLicenceRequest } from '@/lib/licence'
import WhatsAppIcon from '../WhatsAppIcon'
import { Badge, ConfirmDialog, EmptyState, PageHeader, Panel, timeAgo } from './ui'

const TABS: { key: EnquiryStatus | 'all'; label: string }[] = [
  { key: 'new', label: 'New' },
  { key: 'contacted', label: 'Contacted' },
  { key: 'closed', label: 'Closed' },
  { key: 'all', label: 'All' },
]
const TONE = { new: 'amber', contacted: 'brand', closed: 'gray' } as const
const SOURCE: Record<EnquiryRecord['source'], string> = { home: 'Home page', contact: 'Contact page', 'quote-modal': 'Quote pop-up', product: 'Product page', mobile: 'Mobile' }

const digits = (s: string) => s.replace(/[^\d]/g, '')

function Inner() {
  const { toast } = useUI()
  const params = useSearchParams()
  const res = useAsync(() => adminApi.enquiries(), [])
  const [rows, setRows] = useState<EnquiryRecord[] | null>(null)
  const [tab, setTab] = useState<EnquiryStatus | 'all'>(params.get('open') ? 'all' : 'new')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<string | null>(params.get('open'))
  const [toDelete, setToDelete] = useState<EnquiryRecord | null>(null)
  const [busy, setBusy] = useState(false)

  const all = rows ?? res.data ?? []
  useEffect(() => {
    if (res.data) setRows(res.data)
  }, [res.data])

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return all.filter((e) => (tab === 'all' || e.status === tab) && (!needle || [e.name, e.company, e.mobile, e.email, e.requirement, e.productSlug].join(' ').toLowerCase().includes(needle)))
  }, [all, tab, q])
  const count = (k: EnquiryStatus | 'all') => (k === 'all' ? all.length : all.filter((e) => e.status === k).length)

  async function patch(e: EnquiryRecord, p: { status?: EnquiryStatus; notes?: string | null }) {
    const before = all
    setRows(all.map((x) => (x.id === e.id ? { ...x, ...p } : x)))
    try {
      await adminApi.updateEnquiry(e.id, p)
      if (p.status) toast({ kind: 'success', title: `Marked as ${p.status}` })
    } catch (err) {
      setRows(before)
      toast({ kind: 'error', title: 'Update failed', body: (err as Error).message })
    }
  }

  async function remove() {
    if (!toDelete) return
    setBusy(true)
    try {
      await adminApi.deleteEnquiry(toDelete.id)
      setRows(all.filter((x) => x.id !== toDelete.id))
      setToDelete(null)
    } catch (err) {
      toast({ kind: 'error', title: 'Couldn’t delete', body: (err as Error).message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <PageHeader title="Enquiries" subtitle="Quote requests from the website’s forms. Newest first." />
      <Panel>
        <div className="flex flex-wrap items-center gap-3 border-b border-line p-4">
          <div className="flex max-w-full overflow-x-auto rounded-xl border border-line p-1 [scrollbar-width:none]">
            {TABS.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)} className={`relative shrink-0 whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${tab === t.key ? 'text-white' : 'text-muted hover:text-ink'}`}>
                {tab === t.key && <motion.span layoutId="enq-tab" className="absolute inset-0 rounded-lg bg-ink" />}
                <span className="relative">{t.label} <span className="opacity-60">{count(t.key)}</span></span>
              </button>
            ))}
          </div>
          <div className="relative min-w-56 flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input className="field !py-2.5 !pl-10" placeholder="Search name, phone, product…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search enquiries" />
          </div>
        </div>

        {res.error ? (
          <p className="p-6 text-sm text-red-700">Couldn’t load enquiries: {res.error.message}</p>
        ) : res.loading && !rows ? (
          <div className="space-y-3 p-4">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-mist" />)}</div>
        ) : !list.length ? (
          <EmptyState icon={<Inbox className="size-6" />} title={tab === 'new' ? 'Inbox zero 🎉' : 'Nothing here'} body={tab === 'new' ? 'No new enquiries waiting for a reply.' : 'No enquiries match this view.'} />
        ) : (
          <ul className="divide-y divide-line">
            {list.map((e) => {
              const isOpen = open === e.id
              const wa = `https://wa.me/${digits(e.mobile)}?text=${encodeURIComponent(`Hello${e.name ? ` ${e.name}` : ''}, this is Nirmal Lifecare regarding your enquiry: ${e.requirement.slice(0, 120)}`)}`
              return (
                <li key={e.id} className={isOpen ? 'bg-mist/30' : ''}>
                  <button onClick={() => setOpen(isOpen ? null : e.id)} className="flex w-full items-start gap-3 px-5 py-4 text-left transition hover:bg-mist/40" aria-expanded={isOpen}>
                    <span className={`mt-1.5 size-2 shrink-0 rounded-full ${e.status === 'new' ? 'bg-amber' : 'bg-transparent'}`} />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">{[e.title, e.name].filter(Boolean).join(' ') || e.mobile}</span>
                        {e.company && <span className="text-sm text-muted">· {e.company}</span>}
                        <Badge tone={TONE[e.status]}>{e.status}</Badge>
                        {isLicenceRequest(e.requirement) && <Badge tone="brand">Licence request</Badge>}
                      </span>
                      <span className={`mt-0.5 block text-sm text-ink/80 ${isOpen ? '' : 'truncate'}`}>{e.requirement.replace(LICENCE_REQUEST_TAG, '').trim()}</span>
                      <span className="mt-1 flex flex-wrap gap-x-3 text-xs text-muted">
                        <span>{SOURCE[e.source]}</span>
                        {e.quantity && <span>{e.quantity} {e.unit}</span>}
                        {e.productSlug && <span>{e.productSlug}</span>}
                      </span>
                    </span>
                    <span className="shrink-0 text-right text-xs text-muted">
                      {timeAgo(e.createdAt)}
                      <ChevronDown className={`ml-auto mt-2 size-4 transition ${isOpen ? 'rotate-180' : ''}`} />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="grid gap-5 px-5 pb-5 pl-10 lg:grid-cols-[1fr_1fr]">
                          <div className="space-y-2 text-sm">
                            <p className="flex items-center gap-2"><Phone className="size-4 text-brand" /> <a href={`tel:${e.mobile.replace(/\s/g, '')}`} className="hover:underline">{e.mobile}</a>{e.whatsapp && <Badge tone="green">Prefers WhatsApp</Badge>}</p>
                            {e.email && <p className="flex items-center gap-2"><Mail className="size-4 text-brand" /> <a href={`mailto:${e.email}`} className="hover:underline">{e.email}</a></p>}
                            {e.company && <p className="flex items-center gap-2"><Building2 className="size-4 text-brand" /> {e.company}{e.buyerType && ` · ${e.buyerType}`}</p>}
                            {e.country && <p className="flex items-center gap-2"><Globe2 className="size-4 text-brand" /> {e.country}</p>}
                            {e.productSlug && <p className="flex items-center gap-2"><Package className="size-4 text-brand" /> {e.productSlug}</p>}
                            <p className="text-xs text-muted">Received {new Date(e.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                            <div className="flex flex-wrap gap-2 pt-2">
                              <a href={`tel:${e.mobile.replace(/\s/g, '')}`} className="btn-ghost !px-3 !py-2 text-xs"><Phone className="size-3.5" /> Call</a>
                              <a href={wa} target="_blank" rel="noreferrer" className="btn !px-3 !py-2 text-xs bg-[#25D366] text-white"><WhatsAppIcon className="size-3.5" /> WhatsApp</a>
                              {e.email && <a href={`mailto:${e.email}?subject=${encodeURIComponent('Your enquiry — Nirmal Lifecare')}`} className="btn-ghost !px-3 !py-2 text-xs"><Mail className="size-3.5" /> Email</a>}
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <p className="label">Status</p>
                              <div className="flex gap-2">
                                {(['new', 'contacted', 'closed'] as EnquiryStatus[]).map((s) => (
                                  <button key={s} onClick={() => e.status !== s && patch(e, { status: s })} className={`flex-1 rounded-xl border px-3 py-2 text-sm capitalize transition ${e.status === s ? 'border-brand bg-brand text-white' : 'border-line bg-white hover:border-brand/50'}`}>{s}</button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="label" htmlFor={`n-${e.id}`}>Internal notes</label>
                              <textarea id={`n-${e.id}`} rows={3} className="field resize-y" placeholder="Quoted ₹…, follow up on…" defaultValue={e.notes ?? ''} onBlur={(ev) => ev.target.value !== (e.notes ?? '') && patch(e, { notes: ev.target.value || null })} />
                              <p className="mt-1 text-xs text-muted">Saved when you click away. Only admins can see notes.</p>
                            </div>
                            <button onClick={() => setToDelete(e)} className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 hover:underline"><Trash2 className="size-3.5" /> Delete enquiry</button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>
        )}
      </Panel>
      <ConfirmDialog open={!!toDelete} title="Delete this enquiry?" body="This can’t be undone. Mark it as closed instead if you want to keep a record." busy={busy} onConfirm={remove} onCancel={() => setToDelete(null)} />
    </>
  )
}

export default function Enquiries() {
  return (
    <Suspense>
      <Inner />
    </Suspense>
  )
}
