export type Form = 'tablet' | 'capsule' | 'injection' | 'syrup' | 'cream' | 'drops' | 'cardiac' | 'oncology'

export interface Category {
  slug: string
  name: string
  short: string // two-letter badge shown in the mockups (Tb, Cp, Inj…)
  form: Form
  description: string
}

export type Unit = 'Box' | 'Strip' | 'Vial' | 'Bottle' | 'Piece' | 'Tube'

export interface Product {
  id?: string // set for products stored in Supabase
  slug: string
  name: string
  category: string // Category.slug
  strength: string
  pack: string
  unit: Unit
  composition: string
  therapy: string[] // Cardiac, Diabetic, Thyroid, Gastro…
  packaging: 'Strip' | 'Box' | 'Bottle' | 'Vial' | 'Tube'
  price: number | null // null → "Price on request"
  moq?: number
  featured?: boolean
  description?: string
  images?: string[]
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  initials: string
  rating: number
  date: string
  text: string
  topic: 'Product quality' | 'Response' | 'Delivery'
}

export type BuyerType = 'Retail pharmacy' | 'Hospital' | 'Distributor' | 'Wholesaler' | 'Nursing home' | 'Other'

export interface Enquiry {
  source: 'home' | 'contact' | 'quote-modal' | 'product' | 'mobile'
  requirement: string
  mobile: string
  email?: string
  name?: string
  title?: 'Mr.' | 'Ms.' | 'Mrs.' | 'Dr.'
  company?: string
  buyerType?: BuyerType
  country?: string
  whatsapp?: boolean
  productSlug?: string
  quantity?: number
  unit?: Unit
}

export interface ProductQuery {
  category?: string
  q?: string
  therapy?: string[]
  packaging?: string[]
  sort?: 'relevance' | 'name-asc' | 'name-desc'
  page?: number
  pageSize?: number
}

export interface Paged<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export type EnquiryStatus = 'new' | 'contacted' | 'closed'

/** An enquiry as stored in the database (admin view). */
export interface EnquiryRecord extends Enquiry {
  id: string
  createdAt: string
  status: EnquiryStatus
  notes?: string | null
}
