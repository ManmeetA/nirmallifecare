'use client'

import { Quote } from 'lucide-react'
import type { Testimonial } from '../lib/types'
import { Stars } from './primitives'

export default function TestimonialCard({ t, showMeta = false }: { t: Testimonial; showMeta?: boolean }) {
  return (
    <figure className="group card relative flex h-full flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand/10">
      <Quote className="absolute right-5 top-5 size-10 text-mint transition group-hover:scale-110 group-hover:text-amber/40" />
      <div className="flex items-center gap-3">
        <Stars value={t.rating} />
        {showMeta && <span className="text-xs text-muted">{t.date}</span>}
      </div>
      <blockquote className="mt-4 flex-1 leading-relaxed text-ink/80">{t.text}</blockquote>
      {showMeta && <span className="mt-4 w-fit rounded-full bg-mist px-3 py-1 text-xs font-medium text-brand">{t.topic}</span>}
      <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-5">
        <span className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-mint to-mist text-sm font-bold text-brand ring-2 ring-white">{t.initials}</span>
        <span>
          <span className="block text-sm font-semibold">{t.name}</span>
          <span className="block text-xs text-muted">{t.role}</span>
        </span>
      </figcaption>
    </figure>
  )
}
