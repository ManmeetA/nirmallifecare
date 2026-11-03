import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCategory, getProduct, getProductParams } from '@/lib/catalog-server'
import ProductDetail from '@/views/ProductDetail'

// New products added in the admin render on first visit; the admin also
// revalidates these paths right after saving, and this is a 60s safety net.
export const revalidate = 60

export async function generateStaticParams() {
  return getProductParams()
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await getProduct((await params).slug)
  if (!p) return { title: 'Product' }
  return {
    title: p.name,
    description: `${p.name} — ${p.composition}, ${p.strength}, ${p.pack}. Bulk supply from Nirmal LifeCare; send an enquiry for the best price.`,
    openGraph: p.images?.[0] ? { images: [p.images[0]] } : undefined,
  }
}

export default async function Page({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params
  const p = await getProduct(slug)
  if (!p || p.category !== category) notFound()
  return <ProductDetail initialProduct={p} initialCategory={await getCategory(category)} />
}
