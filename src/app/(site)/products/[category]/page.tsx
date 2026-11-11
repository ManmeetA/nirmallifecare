import { Suspense } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCategories, getCategory } from '@/lib/catalog-server'
import { breadcrumbJsonLd, pageOpenGraph } from '@/lib/seo'
import JsonLd from '@/components/JsonLd'
import Category, { CategoryHero } from '@/views/Category'

export const revalidate = 60

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ category: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const c = await getCategory((await params).category)
  if (!c) return { title: 'Products' }
  const path = `/products/${c.slug}`
  return {
    title: `${c.name} Wholesaler in Ghaziabad`,
    description: `${c.description} Bulk supply of pharmaceutical ${c.name.toLowerCase()} from Nirmal Lifecare, a licensed wholesaler in Navyug Market, Ghaziabad. Enquire for rates.`,
    alternates: { canonical: path },
    openGraph: pageOpenGraph(path),
  }
}

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const c = await getCategory((await params).category)
  if (!c) notFound()
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Products', path: '/products' },
          { name: c.name, path: `/products/${c.slug}` },
        ])}
      />
      <Suspense fallback={<CategoryHero cat={c} />}>
        <Category initialCategory={c} />
      </Suspense>
    </>
  )
}
