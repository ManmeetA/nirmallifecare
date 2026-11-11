'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { animate, motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ChevronRight, Star } from 'lucide-react'

export function Logo({ light = false, sub = true }: { light?: boolean; sub?: boolean }) {
  return (
    <Link href="/" className="group flex shrink-0 items-center gap-2.5 leading-none" aria-label="Nirmal Lifecare — home">
      {/* "NRL" device from the trade-mark application (No. 6715198) */}
      <span className={`grid shrink-0 place-items-center transition-transform duration-500 group-hover:scale-105 ${light ? 'rounded-xl bg-white px-1.5 py-1' : ''}`}>
        <Image src="/brand/nrl-mark.png" alt="" width={211} height={104} priority className="h-8 w-auto sm:h-9" />
      </span>
      <span>
        <span className="block whitespace-nowrap text-[1.2rem] font-extrabold tracking-tight sm:text-[1.4rem]">
          <span className={light ? 'text-white' : 'text-ink'}>Nirmal</span>{' '}
          <span className={`bg-clip-text text-transparent transition-[background-position] duration-700 [background-size:200%_auto] group-hover:[background-position:100%_0] ${light ? 'bg-gradient-to-r from-amber via-[#f7c46f] to-amber' : 'bg-gradient-to-r from-brand via-brand-400 to-amber'}`}>Lifecare</span>
          <sup className={`ml-0.5 text-[9px] font-semibold ${light ? 'text-white/50' : 'text-muted'}`}>™</sup>
        </span>
        {sub && <span className={`mt-1 block text-[9px] max-[359px]:hidden font-semibold uppercase tracking-[0.12em] sm:text-[10px] ${light ? 'text-white/50' : 'text-muted'}`}>Pharma wholesaler & distributor</span>}
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
