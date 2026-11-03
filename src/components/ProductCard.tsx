'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, Phone } from 'lucide-react'
import type { Form, Product } from '../lib/types'
import { formatPrice } from '../lib/hooks'
import { useUI } from '../context/ui'
import { site } from '../data/site'
import ProductArt from './ProductArt'

const FORM_BY_CATEGORY: Record<string, Form> = {
  tablets: 'tablet',
  capsules: 'capsule',
  injections: 'injection',
  syrups: 'syrup',
  creams: 'cream',
  drops: 'drops',
  'cardiac-diabetic': 'cardiac',
  oncology: 'oncology',
}
export const formOf = (p: Product): Form => FORM_BY_CATEGORY[p.category] ?? 'tablet'

const LABEL: Record<Form, string> = {
  tablet: 'Tablets', capsule: 'Capsules', injection: 'Injections', syrup: 'Syrups',
  cream: 'Creams', drops: 'Drops', cardiac: 'Cardiac & Diabetic', oncology: 'Oncology',
}
export const formLabel = (p: Product) => LABEL[formOf(p)]

export function ProductMedia({ product, className = '', artClass = 'size-24' }: { product: Product; className?: string; artClass?: string }) {
  const img = product.images?.[0]
  return (
    <div className={`relative grid place-items-center overflow-hidden bg-gradient-to-br from-mist to-mint/60 ${className}`}>
      <div className="absolute inset-0 grid-dots opacity-60" />
      {img ? (
        <img src={img} alt={product.name} className="relative size-full object-cover" loading="lazy" />
      ) : (
        <ProductArt form={formOf(product)} className={`relative drop-shadow-lg transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 ${artClass}`} />
      )}
    </div>
  )
}

/** Grid card used on Home and in Related products. */
export function ProductCard({ product, index = 0, compact = false }: { product: Product; index?: number; compact?: boolean }) {
  const { openQuote } = useUI()
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.07 }}
      className="group card relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-2xl hover:shadow-brand/10"
    >
      <Link href={`/products/${product.category}/${product.slug}`} className="flex flex-1 flex-col">
        <ProductMedia product={product} className={compact ? 'h-36' : 'h-44'} />
        <div className="flex flex-1 flex-col p-5">
          <p className="eyebrow !text-[10px]">{formLabel(product)}</p>
          <h3 className="mt-1.5 font-semibold leading-snug group-hover:text-brand">{product.name}</h3>
          {!compact && (
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
              <dt className="text-muted">Strength</dt>
              <dd>{product.strength}</dd>
              <dt className="text-muted">Pack</dt>
              <dd>{product.pack}</dd>
            </dl>
          )}
          {compact && <p className="mt-1 text-sm text-muted">{formatPrice(product)} / {product.unit}</p>}
        </div>
      </Link>
      {!compact && (
        <div className="flex items-center justify-between gap-2 border-t border-line px-5 py-4">
          <p className="text-sm">
            <span className="font-bold">{formatPrice(product)}</span>
            {product.price != null && <span className="text-muted"> /{product.unit}</span>}
          </p>
          <button onClick={() => openQuote({ product })} className="btn-primary !px-4 !py-2 text-xs">
            Get quote
          </button>
        </div>
      )}
      <ArrowUpRight className="absolute right-4 top-4 size-5 -translate-x-2 translate-y-2 text-brand opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
    </motion.article>
  )
}

/** Wide row used on the category listing page. */
export function ProductRow({ product, index = 0 }: { product: Product; index?: number }) {
  const { openQuote } = useUI()
  const href = `/products/${product.category}/${product.slug}`
  return (
    <motion.article
      layout
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="group card grid gap-5 p-4 transition-all duration-300 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/5 sm:grid-cols-[160px_1fr_auto] sm:p-5"
    >
      <Link href={href} aria-label={product.name}>
        <ProductMedia product={product} className="h-36 rounded-xl sm:h-full sm:min-h-32" artClass="size-20" />
      </Link>
      <div className="min-w-0">
        <Link href={href} className="text-lg font-semibold hover:text-brand">
          {product.name}
        </Link>
        <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 text-sm md:grid-cols-3">
          <div>
            <dt className="text-muted">Strength</dt>
            <dd className="font-medium">{product.strength}</dd>
          </div>
          <div>
            <dt className="text-muted">Pack size</dt>
            <dd className="font-medium">{product.pack}</dd>
          </div>
          <div className="col-span-2 md:col-span-1">
            <dt className="text-muted">Composition</dt>
            <dd className="font-medium">{product.composition}</dd>
          </div>
        </dl>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.therapy.map((t) => (
            <span key={t} className="rounded-full bg-mist px-2.5 py-0.5 text-xs font-medium text-brand">
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:w-48">
        <p className="text-xl font-bold">
          {formatPrice(product)}
          {product.price != null && <span className="text-sm font-normal text-muted"> /{product.unit}</span>}
        </p>
        <button onClick={() => openQuote({ product })} className="btn-primary btn-shine w-full">
          Get best price
        </button>
        <a href={site.phoneHref} className="btn-ghost w-full">
          <Phone className="size-4" /> Call now
        </a>
      </div>
    </motion.article>
  )
}
