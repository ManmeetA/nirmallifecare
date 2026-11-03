'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, XCircle } from 'lucide-react'
import type { Product, Unit } from '../lib/types'
import QuoteModal from '../components/QuoteModal'

export interface QuoteRequest {
  product?: Product
  quantity?: number
  unit?: Unit
  requirement?: string
}

interface Toast {
  id: number
  kind: 'success' | 'error'
  title: string
  body?: string
}

interface UI {
  openQuote: (req?: QuoteRequest) => void
  toast: (t: Omit<Toast, 'id'>) => void
}

const Ctx = createContext<UI | null>(null)

export function UIProvider({ children }: { children: ReactNode }) {
  const [quote, setQuote] = useState<QuoteRequest | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Date.now() + Math.random()
    setToasts((xs) => [...xs, { ...t, id }])
    setTimeout(() => setToasts((xs) => xs.filter((x) => x.id !== id)), 5000)
  }, [])

  const value = useMemo<UI>(() => ({ openQuote: (r = {}) => setQuote(r), toast }), [toast])

  return (
    <Ctx.Provider value={value}>
      {children}
      <AnimatePresence>{quote && <QuoteModal request={quote} onClose={() => setQuote(null)} />}</AnimatePresence>
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[90] flex flex-col items-center gap-2 px-4">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl border border-line bg-white p-4 shadow-2xl shadow-ink/10"
              role="status"
            >
              {t.kind === 'success' ? (
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand" />
              ) : (
                <XCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
              )}
              <div>
                <p className="text-sm font-semibold">{t.title}</p>
                {t.body && <p className="mt-0.5 text-sm text-muted">{t.body}</p>}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  )
}

export function useUI() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useUI must be used inside <UIProvider>')
  return ctx
}
