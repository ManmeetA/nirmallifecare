import { Suspense } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCategories, getCategory } from '@/lib/catalog-server'
import Category, { CategoryHero } from '@/views/Category'

export const revalidate = 60

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ category: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const c = await getCategory((await params).category)
  return c ? { title: `Pharmaceutical ${c.name}`, description: c.description } : { title: 'Products' }
}

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const c = await getCategory((await params).category)
  if (!c) notFound()
  return (
    <Suspense fallback={<CategoryHero cat={c} />}>
      <Category initialCategory={c} />
    </Suspense>
  )
}
