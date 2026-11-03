import { useEffect, useRef, useState, type DependencyList } from 'react'
import type { Product } from './types'

/** Runs an async loader and tracks loading/error state; reruns when deps change. */
export function useAsync<T>(fn: () => Promise<T>, deps: DependencyList) {
  const [state, setState] = useState<{ data?: T; error?: Error; loading: boolean }>({ loading: true })
  useEffect(() => {
    let alive = true
    setState((s) => ({ ...s, loading: true, error: undefined }))
    fn().then(
      (data) => alive && setState({ data, loading: false }),
      (error: Error) => alive && setState({ error, loading: false }),
    )
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return state
}

export function useDebounced<T>(value: T, ms = 200) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return v
}

export function useScrolled(offset = 12) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > offset)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [offset])
  return scrolled
}

export function useClickOutside<T extends HTMLElement>(onOutside: () => void) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside()
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [onOutside])
  return ref
}

export const formatPrice = (p: Product) =>
  p.price == null ? 'Price on request' : `₹ ${p.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`

/** Indian mobile: 10 digits starting 6–9; international: 7–15 digits. */
export const isValidMobile = (s: string) => {
  const d = s.replace(/[^\d]/g, '').replace(/^91(?=\d{10}$)/, '')
  return /^[6-9]\d{9}$/.test(d) || /^\d{7,15}$/.test(d)
}
export const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
