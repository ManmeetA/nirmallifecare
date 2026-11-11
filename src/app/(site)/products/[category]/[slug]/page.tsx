import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCategory, getProduct, getProductParams } from '@/lib/catalog-server'
import { breadcrumbJsonLd, pageOpenGraph, productJsonLd } from '@/lib/seo'
import JsonLd from '@/components/JsonLd'
import ProductDetail from '@/views/ProductDetail'

// New products added in the admin render on first visit; the admin also
// revalidates these paths right after saving, and this is a 60s safety net.
export const revalidate = 60

export async function generateStaticParams() {
  return getProductParams()
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }): Promise<Metadata> {
  const { category, slug } = await params
  const p = await getProduct(slug)
  if (!p) return { title: 'Product' }
  const path = `/products/${category}/${slug}`
  return {
    title: `${p.name} — Wholesale Supplier in Ghaziabad`,
    description: `Buy ${p.name} (${p.composition}, ${p.strength}, ${p.pack}) in bulk from Nirmal Lifecare, a licensed pharmaceutical wholesaler in Ghaziabad. Send an enquiry for the best wholesale price.`,
    alternates: { canonical: path },
    openGraph: pageOpenGraph(path, p.images?.[0]),
  }
}

export default async function Page({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params
  const p = await getProduct(slug)
  if (!p || p.category !== category) notFound()
  const c = await getCategory(category)
  return (
    <>
      <JsonLd
        data={[
          productJsonLd(p, c),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Products', path: '/products' },
            { name: c?.name ?? category, path: `/products/${category}` },
            { name: p.name, path: `/products/${category}/${slug}` },
          ]),
        ]}
      />
      <ProductDetail initialProduct={p} initialCategory={c} />
    </>
  )
}
