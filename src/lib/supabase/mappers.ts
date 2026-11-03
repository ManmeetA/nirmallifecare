import type { Category, EnquiryRecord, Product, Testimonial } from '../types'

// Database rows use snake_case; the app uses the camelCase types in lib/types.ts.

export interface ProductRow {
  id: string
  slug: string
  name: string
  category: string
  strength: string
  pack: string
  unit: Product['unit']
  composition: string
  therapy: string[]
  packaging: Product['packaging']
  price: number | string | null
  moq: number | null
  featured: boolean
  is_active: boolean
  description: string | null
  images: string[]
  created_at: string
  updated_at: string
}

export const toProduct = (r: ProductRow): Product => ({
  id: r.id,
  slug: r.slug,
  name: r.name,
  category: r.category,
  strength: r.strength,
  pack: r.pack,
  unit: r.unit,
  composition: r.composition,
  therapy: r.therapy ?? [],
  packaging: r.packaging,
  price: r.price == null ? null : Number(r.price),
  moq: r.moq ?? undefined,
  featured: r.featured,
  isActive: r.is_active,
  description: r.description ?? undefined,
  images: r.images ?? [],
  createdAt: r.created_at,
  updatedAt: r.updated_at,
})

export type ProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>

export const toProductRow = (p: ProductInput) => ({
  slug: p.slug,
  name: p.name.trim(),
  category: p.category,
  strength: p.strength.trim(),
  pack: p.pack.trim(),
  unit: p.unit,
  composition: p.composition.trim(),
  therapy: p.therapy,
  packaging: p.packaging,
  price: p.price,
  moq: p.moq ?? null,
  featured: !!p.featured,
  is_active: p.isActive ?? true,
  description: p.description?.trim() || null,
  images: p.images ?? [],
})

export const toCategory = (r: Category & { sort_order?: number }): Category => ({
  slug: r.slug,
  name: r.name,
  short: r.short,
  form: r.form,
  description: r.description,
})

export const toTestimonial = (r: Testimonial): Testimonial => ({ ...r })

export interface EnquiryRow {
  id: string
  created_at: string
  source: EnquiryRecord['source']
  requirement: string
  mobile: string
  email: string | null
  name: string | null
  title: EnquiryRecord['title'] | null
  company: string | null
  buyer_type: EnquiryRecord['buyerType'] | null
  country: string | null
  whatsapp: boolean
  product_slug: string | null
  quantity: number | null
  unit: EnquiryRecord['unit'] | null
  status: EnquiryRecord['status']
  notes: string | null
}

export const toEnquiry = (r: EnquiryRow): EnquiryRecord => ({
  id: r.id,
  createdAt: r.created_at,
  source: r.source,
  requirement: r.requirement,
  mobile: r.mobile,
  email: r.email ?? undefined,
  name: r.name ?? undefined,
  title: r.title ?? undefined,
  company: r.company ?? undefined,
  buyerType: r.buyer_type ?? undefined,
  country: r.country ?? undefined,
  whatsapp: r.whatsapp,
  productSlug: r.product_slug ?? undefined,
  quantity: r.quantity ?? undefined,
  unit: r.unit ?? undefined,
  status: r.status,
  notes: r.notes,
})
