import type { MetadataRoute } from 'next'
import { getCategories, getProductParams } from '@/lib/catalog-server'
import { absolute } from '@/lib/seo'

// Rebuilt hourly so products added in the admin are picked up.
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']) => ({
    url: absolute(path),
    lastModified: now,
    changeFrequency,
    priority,
  })

  const [categories, products] = await Promise.all([getCategories(), getProductParams()])

  return [
    page('/', 1, 'weekly'),
    page('/products', 0.9, 'weekly'),
    ...categories.map((c) => page(`/products/${c.slug}`, 0.8, 'weekly')),
    ...products.map((p) => page(`/products/${p.category}/${p.slug}`, 0.7, 'monthly')),
    page('/about', 0.6, 'monthly'),
    page('/contact', 0.7, 'monthly'),
    page('/privacy', 0.2, 'yearly'),
    page('/terms', 0.2, 'yearly'),
  ]
}
