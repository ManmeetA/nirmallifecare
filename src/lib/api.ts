/**
 * Data access for the public site (runs in the browser).
 *
 * With NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY set, every call
 * reads from / writes to Supabase (access is enforced by RLS — see
 * supabase/migrations). Without them, it falls back to the starter catalog in
 * src/data so the site still runs locally. Pages only ever call `api.*`.
 */
import { categories, products, testimonials } from '../data/catalog'
import { supabaseConfigured } from './supabase/config'
import { supabaseBrowser } from './supabase/client'
import { toCategory, toProduct, type ProductRow } from './supabase/mappers'
import type { Category, Enquiry, Paged, Product, ProductQuery, Testimonial } from './types'

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
  }
}

const useMock = !supabaseConfigured
const db = () => supabaseBrowser()

function check<T>(res: { data: T | null; error: { message: string; code?: string } | null }): T {
  if (res.error) throw new ApiError(res.error.message)
  return res.data as T
}

// Small artificial latency so loading states are visible while on mock data.
const mock = <T,>(value: T, ms = 220) => new Promise<T>((r) => setTimeout(() => r(value), ms))

function queryMock(q: ProductQuery): Paged<Product> {
  const { page = 1, pageSize = 6 } = q
  let list = products.filter((p) => {
    if (q.category && p.category !== q.category) return false
    if (q.therapy?.length && !p.therapy.some((t) => q.therapy!.includes(t))) return false
    if (q.packaging?.length && !q.packaging.includes(p.packaging)) return false
    if (q.q) {
      const hay = `${p.name} ${p.composition} ${p.category} ${p.therapy.join(' ')}`.toLowerCase()
      if (!q.q.toLowerCase().split(/\s+/).every((w) => hay.includes(w))) return false
    }
    return true
  })
  if (q.sort === 'name-asc') list = [...list].sort((a, b) => a.name.localeCompare(b.name))
  if (q.sort === 'name-desc') list = [...list].sort((a, b) => b.name.localeCompare(a.name))
  const start = (page - 1) * pageSize
  return { items: list.slice(start, start + pageSize), total: list.length, page, pageSize }
}

/** Strip characters that have meaning in PostgREST filter strings. */
const safeTerm = (s: string) => s.replace(/[%,().*\\]/g, ' ').trim()

async function querySupabase(q: ProductQuery): Promise<Paged<Product>> {
  const { page = 1, pageSize = 6 } = q
  let req = db().from('products').select('*', { count: 'exact' }).eq('is_active', true)
  if (q.category) req = req.eq('category', q.category)
  if (q.therapy?.length) req = req.overlaps('therapy', q.therapy)
  if (q.packaging?.length) req = req.in('packaging', q.packaging)
  for (const word of safeTerm(q.q ?? '').split(/\s+/).filter(Boolean)) {
    req = req.or(`name.ilike.%${word}%,composition.ilike.%${word}%`)
  }
  if (q.sort === 'name-desc') req = req.order('name', { ascending: false })
  else if (q.sort === 'name-asc') req = req.order('name')
  else req = req.order('featured', { ascending: false }).order('name')
  const from = (page - 1) * pageSize
  const res = await req.range(from, from + pageSize - 1)
  const rows = check(res) as ProductRow[]
  return { items: rows.map(toProduct), total: res.count ?? rows.length, page, pageSize }
}

export const api = {
  async categories(): Promise<Category[]> {
    if (useMock) return mock(categories, 0)
    return (check(await db().from('categories').select('*').order('sort_order')) as Category[]).map(toCategory)
  },

  async categoryCounts(): Promise<Record<string, number>> {
    const list = useMock ? products : (check(await db().from('products').select('category').eq('is_active', true)) as { category: string }[])
    const counts: Record<string, number> = {}
    for (const p of list) counts[p.category] = (counts[p.category] ?? 0) + 1
    return useMock ? mock(counts, 0) : counts
  },

  products(q: ProductQuery = {}): Promise<Paged<Product>> {
    return useMock ? mock(queryMock(q)) : querySupabase(q)
  },

  async featured(): Promise<Product[]> {
    if (useMock) return mock(products.filter((p) => p.featured))
    const rows = check(await db().from('products').select('*').eq('is_active', true).eq('featured', true).order('name').limit(12)) as ProductRow[]
    return rows.map(toProduct)
  },

  async product(slug: string): Promise<Product> {
    if (useMock) {
      const p = products.find((x) => x.slug === slug)
      return p ? mock(p) : Promise.reject(new ApiError('Product not found', 404))
    }
    const row = check(await db().from('products').select('*').eq('slug', slug).maybeSingle()) as ProductRow | null
    if (!row) throw new ApiError('Product not found', 404)
    return toProduct(row)
  },

  async related(slug: string, limit = 4): Promise<Product[]> {
    let p: Product | undefined
    let pool: Product[]
    if (useMock) {
      p = products.find((x) => x.slug === slug)
      pool = products
    } else {
      p = await api.product(slug).catch(() => undefined)
      if (!p) return []
      pool = (check(await db().from('products').select('*').eq('is_active', true).eq('category', p.category).neq('slug', slug).limit(24)) as ProductRow[]).map(toProduct)
    }
    if (!p) return mock([])
    const same = pool.filter((x) => x.slug !== slug && x.category === p.category)
    const byTherapy = same.filter((x) => x.therapy.some((t) => p.therapy.includes(t)))
    const out = [...byTherapy, ...same.filter((x) => !byTherapy.includes(x))].slice(0, limit)
    return useMock ? mock(out) : out
  },

  async search(term: string, limit = 6): Promise<Product[]> {
    if (!term.trim()) return []
    if (useMock) return mock(queryMock({ q: term, pageSize: limit }).items, 80)
    return (await querySupabase({ q: term, pageSize: limit })).items
  },

  async testimonials(): Promise<Testimonial[]> {
    if (useMock) return mock(testimonials)
    return check(await db().from('testimonials').select('id, name, role, initials, rating, date, topic, text').eq('is_published', true).order('created_at')) as Testimonial[]
  },

  async submitEnquiry(e: Enquiry): Promise<{ id: string }> {
    // The id is generated here because visitors may insert enquiries but not read them back (RLS).
    const id = crypto.randomUUID()
    const ref = `ENQ-${id.slice(0, 8).toUpperCase()}`
    if (useMock) {
      console.info('[mock] enquiry submitted', e)
      return mock({ id: ref }, 900)
    }
    const { error } = await db().from('enquiries').insert({
      id,
      source: e.source,
      requirement: e.requirement.trim(),
      mobile: e.mobile,
      email: e.email || null,
      name: e.name || null,
      title: e.title || null,
      company: e.company || null,
      buyer_type: e.buyerType || null,
      country: e.country || null,
      whatsapp: !!e.whatsapp,
      product_slug: e.productSlug || null,
      quantity: e.quantity ?? null,
      unit: e.unit || null,
    })
    if (error) throw new ApiError('Could not send your enquiry. Please call or WhatsApp us instead.')
    return { id: ref }
  },
}
