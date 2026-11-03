'use client'

import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Loader2 } from 'lucide-react'

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-white shadow-sm shadow-ink/[0.03] ${className}`}>{children}</div>
}

export function Toggle({ checked, onChange, label, disabled }: { checked: boolean; onChange: (v: boolean) => void; label: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${checked ? 'bg-brand' : 'bg-line'}`}
    >
      <motion.span layout transition={{ type: 'spring', stiffness: 500, damping: 32 }} className={`size-5 rounded-full bg-white shadow ${checked ? 'ml-[22px]' : 'ml-0.5'}`} />
    </button>
  )
}

const BADGE = {
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  amber: 'bg-amber-50 text-amber-800 ring-amber-600/20',
  gray: 'bg-slate-100 text-slate-600 ring-slate-500/20',
  brand: 'bg-mist text-brand ring-brand/20',
  red: 'bg-red-50 text-red-700 ring-red-600/20',
}
export function Badge({ tone = 'gray', children }: { tone?: keyof typeof BADGE; children: ReactNode }) {
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${BADGE[tone]}`}>{children}</span>
}

export function EmptyState({ icon, title, body, action }: { icon: ReactNode; title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-mist text-brand">{icon}</span>
      <p className="mt-4 font-semibold">{title}</p>
      {body && <p className="mt-1 max-w-sm text-sm text-muted">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function ConfirmDialog({ open, title, body, confirmLabel = 'Delete', busy, onConfirm, onCancel }: { open: boolean; title: string; body: ReactNode; confirmLabel?: string; busy?: boolean; onConfirm: () => void; onCancel: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[80] grid place-items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onCancel} />
          <motion.div role="alertdialog" aria-modal="true" initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-red-50 text-red-600"><AlertTriangle className="size-5" /></span>
              <div>
                <h2 className="text-lg font-semibold">{title}</h2>
                <div className="mt-1 text-sm text-muted">{body}</div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={onCancel} className="btn-ghost !py-2.5" disabled={busy}>Cancel</button>
              <button onClick={onConfirm} className="btn !py-2.5 bg-red-600 text-white hover:bg-red-700" disabled={busy}>
                {busy && <Loader2 className="size-4 animate-spin" />} {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export const timeAgo = (iso: string) => {
  const s = Math.round((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'just now'
  const m = Math.round(s / 60)
  if (m < 60) return `${m} min ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} h ago`
  const d = Math.round(h / 24)
  if (d < 30) return `${d} d ago`
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}
