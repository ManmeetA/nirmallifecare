import { site } from '../data/site'
import type { Category, Product } from './types'

/**
 * Public URL of the live site, used for canonical links, sitemap.xml, robots.txt and
 * structured data. Set NEXT_PUBLIC_SITE_URL (e.g. https://www.nirmallifecare.com) in
 * the production environment — search engines need absolute, final URLs.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

export const absolute = (path = '/') => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`

/** Search phrases this site targets; reused in titles and descriptions. */
export const LOCATION = 'Ghaziabad'

/**
 * Full Open Graph block for a page. A page's `openGraph` replaces the layout's rather
 * than merging with it, so always include site name, locale and image here.
 */
export const pageOpenGraph = (path: string, image?: string) => ({
  siteName: site.name,
  type: 'website' as const,
  locale: 'en_IN',
  url: path,
  images: [image ?? '/opengraph-image'],
})

const ORG_ID = `${SITE_URL}/#organization`

/** Local business entity — powers Google's knowledge panel and map/local results. */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['WholesaleStore', 'Organization'],
    '@id': ORG_ID,
    name: site.name,
    description: site.blurb,
    url: SITE_URL,
    logo: absolute('/brand/nirmal-lifecare-logo.png'),
    image: absolute('/brand/nirmal-lifecare-logo.png'),
    telephone: site.phone.replace(/\s/g, ''),
    email: site.email,
    foundingDate: site.since,
    founder: { '@type': 'Person', name: site.proprietor },
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.addressLine,
      addressLocality: 'Ghaziabad',
      addressRegion: 'Uttar Pradesh',
      postalCode: '201001',
      addressCountry: 'IN',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 28.663554, longitude: 77.4342531 },
    hasMap: site.mapsHref,
    areaServed: [
      { '@type': 'City', name: 'Ghaziabad' },
      { '@type': 'AdministrativeArea', name: 'Delhi NCR' },
      { '@type': 'State', name: 'Uttar Pradesh' },
    ],
    knowsAbout: ['Pharmaceutical wholesale', 'Tablets', 'Capsules', 'Injections', 'Syrups', 'Eye and ear drops', 'Cardiac and diabetic medicines'],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: site.phone.replace(/\s/g, ''),
      email: site.email,
      areaServed: 'IN',
      availableLanguage: ['en', 'hi'],
    },
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: site.name,
    url: SITE_URL,
    inLanguage: 'en-IN',
    publisher: { '@id': ORG_ID },
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: absolute(it.path) })),
  }
}

export function productJsonLd(p: Product, c?: Category) {
  const url = absolute(`/products/${p.category}/${p.slug}`)
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: p.name,
    url,
    sku: p.slug,
    category: c?.name,
    description: p.description || `${p.name} (${p.composition}, ${p.strength}, ${p.pack}) — wholesale supply from ${site.name}, ${LOCATION}.`,
    image: p.images?.length ? p.images : [absolute('/brand/nirmal-lifecare-logo.png')],
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Composition', value: p.composition },
      { '@type': 'PropertyValue', name: 'Strength', value: p.strength },
      { '@type': 'PropertyValue', name: 'Pack size', value: p.pack },
    ],
    // Only real prices become an Offer; "price on request" products are listed without one.
    ...(p.price != null && {
      offers: {
        '@type': 'Offer',
        price: p.price,
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        url,
        seller: { '@id': ORG_ID },
      },
    }),
  }
}
