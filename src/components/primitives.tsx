'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { animate, motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ChevronRight, Star } from 'lucide-react'

export function Logo({ light = false, sub = true }: { light?: boolean; sub?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="Nirmal LifeCare — home">
      <span className="relative grid size-10 place-items-center rounded-xl bg-brand shadow-lg shadow-brand/30 transition-transform duration-500 group-hover:rotate-[360deg]">
        <svg viewBox="0 0 24 24" className="size-6" fill="white" aria-hidden="true">
          <path d="M9.5 4h5v5.5H20v5h-5.5V20h-5v-5.5H4v-5h5.5z" />
        </svg>
        <span className="absolute -right-0.5 -top-0.5 size-3 rounded-full bg-amber ring-2 ring-white" />
      </span>
      <span className="leading-tight">
        <span className={`block text-lg font-bold ${light ? 'text-white' : 'text-ink'}`}>Nirmal LifeCare</span>
        {sub && <span className={`block text-[11px] font-medium ${light ? 'text-white/60' : 'text-muted'}`}>Pharma trader & exporter</span>}
      </span>
    </Link>
  )
}

/** Fades and lifts children in as they scroll into view. */
export function Reveal({ children, delay = 0, y = 28, className = '' }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 2, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [inView, to])
  return (
    <span ref={ref}>
      {n.toLocaleString('en-IN')}
      {suffix}
    </span>
  )
}

export function Stars({ value = 5, className = 'size-4' }: { value?: number; className?: string }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`${className} ${i <= value ? 'fill-amber text-amber' : 'fill-line text-line'}`} />
      ))}
    </span>
  )
}

export function Breadcrumbs({ items, light = false }: { items: { label: string; to?: string }[]; light?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className={`flex flex-wrap items-center gap-1 text-sm ${light ? 'text-white/60' : 'text-muted'}`}>
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="size-3.5 opacity-60" />}
          {it.to ? (
            <Link href={it.to} className={`${light ? 'hover:text-white' : 'text-brand hover:underline'}`}>
              {it.label}
            </Link>
          ) : (
            <span className={light ? 'text-white/90' : 'text-ink'}>{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

export function SectionHeading({ eyebrow, title, action, center = false, light = false }: { eyebrow?: string; title: ReactNode; action?: ReactNode; center?: boolean; light?: boolean }) {
  return (
    <Reveal className={`mb-8 flex gap-4 ${center ? 'flex-col items-center text-center' : 'flex-wrap items-end justify-between'}`}>
      <div>
        {eyebrow && <p className={`eyebrow mb-3 ${light ? '!text-amber' : ''}`}>{eyebrow}</p>}
        <h2 className={`text-3xl font-bold sm:text-4xl ${light ? 'text-white' : ''}`}>{title}</h2>
      </div>
      {action}
    </Reveal>
  )
}

/** Card that tilts toward the cursor. */
export function Tilt({ children, className = '', max = 8 }: { children: ReactNode; className?: string; max?: number }) {
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)
  const rx = useSpring(useTransform(y, [0, 1], [max, -max]), { stiffness: 200, damping: 20 })
  const ry = useSpring(useTransform(x, [0, 1], [-max, max]), { stiffness: 200, damping: 20 })
  return (
    <motion.div
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - r.left) / r.width)
        y.set((e.clientY - r.top) / r.height)
      }}
      onMouseLeave={() => {
        x.set(0.5)
        y.set(0.5)
      }}
    >
      {children}
    </motion.div>
  )
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-mist ${className}`} />
}

export function PageHero({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <section className={`relative overflow-hidden ${dark ? 'bg-ink text-white' : 'bg-mist'}`}>
      <div className={`absolute inset-0 ${dark ? 'opacity-[0.07]' : ''} grid-dots`} />
      <div className={`absolute -right-24 -top-24 size-96 rounded-full blur-3xl animate-blob ${dark ? 'bg-brand/50' : 'bg-brand/10'}`} />
      <div className={`absolute -bottom-32 left-1/3 size-80 rounded-full blur-3xl animate-blob [animation-delay:-5s] ${dark ? 'bg-amber/20' : 'bg-amber/15'}`} />
      <div className="container-x relative py-8 sm:py-10">{children}</div>
    </section>
  )
}
