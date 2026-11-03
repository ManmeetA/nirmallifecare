'use client'

import Link from 'next/link'
import { api } from '../lib/api'
import { useAsync } from '../lib/hooks'
import { Breadcrumbs, PageHero } from '../components/primitives'

const COPY = {
  privacy: {
    title: 'Privacy policy',
    body: ['[Privacy policy content — what enquiry data is collected (name, mobile, email, requirement), how it is used to respond to quotes, how long it is kept, and how buyers can ask for it to be deleted.]'],
  },
  terms: {
    title: 'Terms of use',
    body: ['[Terms of use content — supply only to licensed buyers, pricing validity, payment and dispatch terms, returns policy and jurisdiction.]'],
  },
}

export function LegalPage({ kind }: { kind: keyof typeof COPY }) {
  const c = COPY[kind]
  return (
    <>
      <PageHero>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: c.title }]} />
        <h1 className="mt-4 break-words text-3xl font-extrabold min-[380px]:text-4xl">{c.title}</h1>
      </PageHero>
      <section className="container-x max-w-3xl space-y-4 py-10 leading-relaxed text-ink/80">
        {c.body.map((p) => <p key={p}>{p}</p>)}
      </section>
    </>
  )
}

export function Sitemap() {
  const cats = useAsync(() => api.categories(), [])
  const all = useAsync(() => api.products({ pageSize: 500 }), [])
  return (
    <>
      <PageHero>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Sitemap' }]} />
        <h1 className="mt-4 break-words text-3xl font-extrabold min-[380px]:text-4xl">Sitemap</h1>
      </PageHero>
      <section className="container-x grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h2 className="mb-3 font-bold">Pages</h2>
          <ul className="space-y-2 text-sm">
            {[['/', 'Home'], ['/products', 'Products & Services'], ['/about', 'About Us'], ['/testimonials', 'Testimonials'], ['/contact', 'Contact Us'], ['/privacy', 'Privacy policy'], ['/terms', 'Terms of use']].map(([to, l]) => (
              <li key={to}><Link href={to} className="text-brand hover:underline">{l}</Link></li>
            ))}
          </ul>
        </div>
        {(cats.data ?? []).map((c) => (
          <div key={c.slug}>
            <h2 className="mb-3 font-bold"><Link href={`/products/${c.slug}`} className="hover:text-brand">{c.name}</Link></h2>
            <ul className="space-y-2 text-sm">
              {(all.data?.items ?? []).filter((p) => p.category === c.slug).map((p) => (
                <li key={p.slug}><Link href={`/products/${c.slug}/${p.slug}`} className="text-muted hover:text-brand">{p.name}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </>
  )
}
