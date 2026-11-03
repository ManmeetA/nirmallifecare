import 'server-only'
import { categories as seedCategories, products as seedProducts } from '../data/catalog'
import { supabaseConfigured } from './supabase/config'
import { supabasePublic } from './supabase/server'
import { toCategory, toProduct, type ProductRow } from './supabase/mappers'
import type { Category, Product } from './types'

// Server-side catalog reads for route files (metadata, static params, 404s).
// Uses Supabase when configured, else the starter catalog.

export async function getCategories(): Promise<Category[]> {
  if (!supabaseConfigured) return seedCategories
  const { data } = await supabasePublic().from('categories').select('*').order('sort_order')
  return (data ?? []).map(toCategory)
}

export async function getCategory(slug: string) {
  return (await getCategories()).find((c) => c.slug === slug)
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  if (!supabaseConfigured) return seedProducts.find((p) => p.slug === slug)
  const { data } = await supabasePublic().from('products').select('*').eq('slug', slug).eq('is_active', true).maybeSingle()
  return data ? toProduct(data as ProductRow) : undefined
}

export async function getProductParams(): Promise<{ category: string; slug: string }[]> {
  if (!supabaseConfigured) return seedProducts.map((p) => ({ category: p.category, slug: p.slug }))
  const { data } = await supabasePublic().from('products').select('category, slug').eq('is_active', true)
  return data ?? []
}
