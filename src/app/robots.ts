import type { MetadataRoute } from 'next'
import { SITE_URL, absolute } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/search'] }],
    sitemap: absolute('/sitemap.xml'),
    host: SITE_URL,
  }
}
