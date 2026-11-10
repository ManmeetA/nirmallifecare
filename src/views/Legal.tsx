'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, ChevronDown } from 'lucide-react'
import { api } from '../lib/api'
import { useAsync } from '../lib/hooks'
import { privacy, terms, type LegalDoc } from '../content/legal'
import { Breadcrumbs, PageHero, Reveal } from '../components/primitives'

const DOCS = { privacy, terms }

/** Highlights the section currently in view in the table of contents. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    // Active = last section whose heading has scrolled past the top band; at the very
    // bottom of the page the last section wins (short final sections never reach the top).
    const update = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      if (atBottom) return setActive(ids[ids.length - 1])
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 140) current = id
      }
      setActive(current)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [ids])
  return active
}

function Contents({ doc, active, onPick }: { doc: LegalDoc; active: string; onPick?: () => void }) {
  return (
    <ol className="space-y-0.5 text-sm">
      {doc.sections.map((s, i) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            onClick={onPick}
            aria-current={active === s.id ? 'location' : undefined}
            className={`flex gap-2 rounded-lg border-l-2 px-3 py-1.5 transition ${active === s.id ? 'border-brand bg-mist font-semibold text-brand' : 'border-transparent text-muted hover:text-ink'}`}
          >
            <span className="w-5 shrink-0 tabular-nums opacity-60">{i + 1}.</span>
            {s.title}
          </a>
        </li>
      ))}
    </ol>
  )
}

export function LegalPage({ kind }: { kind: keyof typeof DOCS }) {
  const doc = DOCS[kind]
  const other = kind === 'privacy' ? { href: '/terms', label: 'Terms of use' } : { href: '/privacy', label: 'Privacy policy' }
  const [ids] = useState(() => doc.sections.map((s) => s.id))
  const active = useActiveSection(ids)
  const [tocOpen, setTocOpen] = useState(false)

  return (
    <>
      <PageHero>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: doc.title }]} />
        <h1 className="mt-4 break-words text-3xl font-extrabold min-[380px]:text-4xl sm:text-5xl">{doc.title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted">{doc.intro}</p>
      </PageHero>

      {doc.highlights && (
        <section className="container-x pt-10">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {doc.highlights.map((h, i) => (
              <Reveal key={h.title} delay={i * 0.06}>
                <div className="card h-full p-5">
                  <BadgeCheck className="size-6 text-brand" />
                  <p className="mt-3 font-semibold">{h.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{h.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="container-x grid gap-10 py-10 lg:grid-cols-[260px_1fr]">
        {/* Desktop: sticky table of contents */}
        <aside className="hidden lg:block print:hidden">
          <div className="sticky top-24">
            <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-muted">On this page</p>
            <Contents doc={doc} active={active} />
          </div>
        </aside>

        <div className="min-w-0">
          {/* Mobile: collapsible table of contents */}
          <div className="card mb-8 lg:hidden print:hidden">
            <button onClick={() => setTocOpen((o) => !o)} aria-expanded={tocOpen} className="flex w-full items-center justify-between px-5 py-4 text-sm font-semibold">
              On this page
              <ChevronDown className={`size-4 transition ${tocOpen ? 'rotate-180' : ''}`} />
            </button>
            {tocOpen && <div className="border-t border-line p-2"><Contents doc={doc} active={active} onPick={() => setTocOpen(false)} /></div>}
          </div>

          <article className="max-w-3xl space-y-10">
            {doc.sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-28">
                <h2 className="flex items-baseline gap-3 text-xl font-bold sm:text-2xl">
                  <span className="text-base font-bold text-brand/60 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  {s.title}
                </h2>
                <div className="mt-4 space-y-3 leading-relaxed text-ink/80">{s.body}</div>
              </section>
            ))}
          </article>

          <div className="mt-12 flex max-w-3xl flex-col items-start justify-between gap-4 rounded-2xl bg-mist p-6 sm:flex-row sm:items-center print:hidden">
            <p className="text-sm text-muted">Also read our {other.label.toLowerCase()}.</p>
            <Link href={other.href} className="btn-primary !py-2.5">{other.label} <ArrowRight className="size-4" /></Link>
          </div>
        </div>
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
