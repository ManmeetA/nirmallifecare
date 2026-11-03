import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabaseServer } from '@/lib/supabase/server'
import { toProduct, type ProductRow } from '@/lib/supabase/mappers'
import ProductForm from '@/components/admin/ProductForm'

export const metadata: Metadata = { title: 'Edit product' }

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound()
  // Loaded with the admin's session, so hidden products are visible too (RLS).
  const { data } = await (await supabaseServer()).from('products').select('*').eq('id', id).maybeSingle()
  if (!data) notFound()
  return <ProductForm product={toProduct(data as ProductRow)} />
}
