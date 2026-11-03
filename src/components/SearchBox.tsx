'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Loader2, Search } from 'lucide-react'
import { api } from '../lib/api'
import { useClickOutside, useDebounced } from '../lib/hooks'
import type { Product } from '../lib/types'
import ProductArt from './ProductArt'
import { formOf } from './ProductCard'

/** Product search with a live suggestions dropdown. `size="lg"` is the hero variant. */
export default function SearchBox({ size = 'sm', placeholder = 'Search products', onNavigate }: { size?: 'sm' | 'lg'; placeholder?: string; onNavigate?: () => void }) {
  const router = useRouter()
  const [term, setTerm] = useState('')
  const [open, setOpen] = useState(false)
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState(-1)
  const q = useDebounced(term, 150)
  const ref = useClickOutside<HTMLFormElement>(useCallback(() => setOpen(false), []))

  useEffect(() => {
    let alive = true
    if (!q.trim()) {
      setResults([])
      return
    }
    setLoading(true)
    api.search(q).then((r) => {
      if (!alive) return
      setResults(r)
      setLoading(false)
      setActive(-1)
    })
    return () => {
      alive = false
    }
  }, [q])

  const go = (path: string) => {
    setOpen(false)
    setTerm('')
    onNavigate?.()
    router.push(path)
  }

  const lg = size === 'lg'
  return (
    <form
      ref={ref}
      role="search"
      className="relative w-full"
      onSubmit={(e) => {
        e.preventDefault()
        if (active >= 0 && results[active]) go(`/products/${results[active].category}/${results[active].slug}`)
        else if (term.trim()) go(`/search?q=${encodeURIComponent(term.trim())}`)
      }}
    >
      <div className={`flex items-center gap-2 rounded-xl border bg-white transition focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10 ${lg ? 'border-white/60 p-1.5 pl-4 shadow-xl shadow-brand/10' : 'border-line pl-3'}`}>
        <Search className={`shrink-0 text-muted ${lg ? 'size-5' : 'size-4'}`} />
        <input
          value={term}
          onChange={(e) => {
            setTerm(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') setActive((a) => Math.min(a + 1, results.length - 1))
            else if (e.key === 'ArrowUp') setActive((a) => Math.max(a - 1, -1))
            else if (e.key === 'Escape') setOpen(false)
          }}
          placeholder={placeholder}
          aria-label="Search products"
          className={`w-full bg-transparent outline-none placeholder:text-muted/70 ${lg ? 'py-2.5 text-base' : 'py-2.5 text-sm'}`}
        />
        {loading && <Loader2 className="size-4 shrink-0 animate-spin text-muted" />}
        {lg && (
          <button type="submit" className="btn-primary shrink-0 !py-2.5">
            Search
          </button>
        )}
      </div>
      <AnimatePresence>
        {open && term.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-line bg-white text-ink shadow-2xl shadow-ink/10"
          >
            {results.length === 0 && !loading ? (
              <div className="p-4 text-sm text-muted">
                No match for “{term}”. <button type="button" className="font-semibold text-brand" onClick={() => go('/contact')}>Send us the name</button> — we source on request.
              </div>
            ) : (
              <ul className="max-h-80 overflow-y-auto py-1">
                {results.map((p, i) => (
                  <li key={p.slug}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(`/products/${p.category}/${p.slug}`)}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm ${i === active ? 'bg-mist' : ''}`}
                    >
                      <ProductArt form={formOf(p)} className="size-8 shrink-0" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{p.name}</span>
                        <span className="block truncate text-xs text-muted">{p.composition} · {p.pack}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {results.length > 0 && (
              <button type="submit" className="flex w-full items-center justify-between border-t border-line px-4 py-3 text-sm font-semibold text-brand hover:bg-mist">
                See all results for “{term}” <ArrowRight className="size-4" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  )
}
