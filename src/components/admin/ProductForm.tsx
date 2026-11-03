'use client'

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion, Reorder } from 'framer-motion'
import { ArrowLeft, ImagePlus, Loader2, Plus, Star, UploadCloud, X } from 'lucide-react'
import { adminApi } from '@/lib/admin-api'
import { api } from '@/lib/api'
import { slugify } from '@/data/catalog'
import { useAsync } from '@/lib/hooks'
import type { Product, Unit } from '@/lib/types'
import type { ProductInput } from '@/lib/supabase/mappers'
import { useUI } from '@/context/ui'
import { revalidateCatalog } from '@/app/admin/actions'
import { ProductCard } from '../ProductCard'
import { Panel, Toggle } from './ui'

const UNITS: Unit[] = ['Box', 'Strip', 'Vial', 'Bottle', 'Piece', 'Tube']
const PACKAGING: Product['packaging'][] = ['Strip', 'Box', 'Bottle', 'Vial', 'Tube']
const THERAPY = ['Cardiac', 'Diabetic', 'Thyroid', 'Gastro', 'Anti-infective', 'Neuro', 'Ophthalmic', 'Otic', 'Dermatology', 'Analgesic', 'Anti-allergic', 'Oncology']

type Errors = Partial<Record<'name' | 'slug' | 'category' | 'strength' | 'pack' | 'composition' | 'price' | 'moq' | 'form', string>>

const empty: ProductInput = {
  slug: '', name: '', category: '', strength: '', pack: '', unit: 'Strip', composition: '',
  therapy: [], packaging: 'Strip', price: null, moq: undefined, featured: false, isActive: true, description: '', images: [],
}

function Field({ label, hint, error, children, htmlFor }: { label: string; hint?: string; error?: string; children: ReactNode; htmlFor?: string }) {
  return (
    <div>
      <label className="label" htmlFor={htmlFor}>{label}</label>
      {children}
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  )
}

function Section({ title, desc, children }: { title: string; desc?: string; children: ReactNode }) {
  return (
    <Panel className="p-5 sm:p-6">
      <h2 className="font-semibold">{title}</h2>
      {desc && <p className="mt-0.5 text-sm text-muted">{desc}</p>}
      <div className="mt-5 space-y-4">{children}</div>
    </Panel>
  )
}

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter()
  const { toast } = useUI()
  const cats = useAsync(() => api.categories(), [])
  const editing = !!product?.id
  const [f, setF] = useState<ProductInput>(() => (product ? { ...empty, ...product, description: product.description ?? '' } : empty))
  const [slugTouched, setSlugTouched] = useState(editing)
  const [onRequest, setOnRequest] = useState(product ? product.price == null : true)
  const [errors, setErrors] = useState<Errors>({})
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(0)
  const [drag, setDrag] = useState(false)
  const [customTherapy, setCustomTherapy] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const uploadedThisSession = useRef<string[]>([])

  const set = <K extends keyof ProductInput>(k: K, v: ProductInput[K]) => setF((x) => ({ ...x, [k]: v }))

  useEffect(() => {
    if (!slugTouched) setF((x) => ({ ...x, slug: slugify(x.name) }))
  }, [f.name, slugTouched])

  // Default the category once categories load (new products only).
  useEffect(() => {
    if (!editing && !f.category && cats.data?.length) set('category', cats.data[0].slug)
  }, [cats.data, editing, f.category])

  const preview: Product = useMemo(() => ({ ...f, name: f.name || 'Product name', strength: f.strength || '—', pack: f.pack || '—', price: onRequest ? null : f.price }), [f, onRequest])

  async function upload(files: FileList | File[]) {
    const list = Array.from(files).filter((x) => x.type.startsWith('image/'))
    if (!list.length) return
    setUploading((n) => n + list.length)
    for (const file of list) {
      try {
        const url = await adminApi.uploadImage(file)
        uploadedThisSession.current.push(url)
        setF((x) => ({ ...x, images: [...(x.images ?? []), url] }))
      } catch (e) {
        toast({ kind: 'error', title: `Couldn’t upload ${file.name}`, body: (e as Error).message })
      } finally {
        setUploading((n) => n - 1)
      }
    }
  }

  const removeImage = (url: string) => {
    set('images', (f.images ?? []).filter((u) => u !== url))
    // Only delete from storage straight away if it was uploaded in this session (not yet saved anywhere).
    if (uploadedThisSession.current.includes(url)) adminApi.removeImages([url]).catch(() => {})
  }

  const toggleTherapy = (t: string) => set('therapy', f.therapy.includes(t) ? f.therapy.filter((x) => x !== t) : [...f.therapy, t])

  function validate(): Errors {
    const e: Errors = {}
    if (f.name.trim().length < 3) e.name = 'Enter the product name (at least 3 characters).'
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(f.slug)) e.slug = 'Use lowercase letters, numbers and dashes only.'
    if (!f.category) e.category = 'Choose a category.'
    if (!f.strength.trim()) e.strength = 'Enter the strength, e.g. 10 mg.'
    if (!f.pack.trim()) e.pack = 'Enter the pack size, e.g. 10 × 10 tablets.'
    if (!f.composition.trim()) e.composition = 'Enter the composition / molecule.'
    if (!onRequest && (f.price == null || !(f.price >= 0))) e.price = 'Enter a valid price, or tick “Price on request”.'
    if (f.moq != null && !(Number.isInteger(f.moq) && f.moq > 0)) e.moq = 'Minimum order must be a whole number above 0.'
    return e
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length) {
      toast({ kind: 'error', title: 'Please fix the highlighted fields' })
      return
    }
    setSaving(true)
    const input: ProductInput = { ...f, price: onRequest ? null : f.price }
    try {
      const saved = editing ? await adminApi.update(product!.id!, input) : await adminApi.create(input)
      // Images removed from an existing product are deleted from storage only after a successful save.
      if (editing) await adminApi.removeImages((product!.images ?? []).filter((u) => !input.images?.includes(u))).catch(() => {})
      uploadedThisSession.current = []
      await revalidateCatalog().catch(() => {})
      toast({ kind: 'success', title: editing ? 'Product updated' : 'Product added', body: `${saved.name} is ${saved.isActive ? 'live on the website' : 'saved as hidden'}.` })
      router.push('/admin/products')
      router.refresh()
    } catch (err) {
      setErrors({ form: (err as Error).message })
      toast({ kind: 'error', title: 'Couldn’t save product', body: (err as Error).message })
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/products" className="inline-flex items-center gap-1 text-sm text-muted hover:text-brand"><ArrowLeft className="size-4" /> All products</Link>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{editing ? 'Edit product' : 'Add a new product'}</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/products" className="btn-ghost !py-2.5">Cancel</Link>
          <button type="submit" disabled={saving || uploading > 0} className="btn-primary !py-2.5">
            {saving && <Loader2 className="size-4 animate-spin" />} {editing ? 'Save changes' : 'Add product'}
          </button>
        </div>
      </div>

      {errors.form && <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errors.form}</p>}

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Section title="Basic details" desc="What buyers see first on the listing and product page.">
            <Field label="Product name" htmlFor="p-name" error={errors.name}>
              <input id="p-name" className="field" placeholder="e.g. Atorvastatin 10 mg Tablets" value={f.name} onChange={(e) => set('name', e.target.value)} />
            </Field>
            <Field label="URL slug" htmlFor="p-slug" error={errors.slug} hint={`Page address: /products/${f.category || 'category'}/${f.slug || 'slug'}${editing ? ' — changing this breaks old links.' : ''}`}>
              <input id="p-slug" className="field font-mono !text-[13px]" value={f.slug} onChange={(e) => { setSlugTouched(true); set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/-{2,}/g, '-')) }} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category" htmlFor="p-cat" error={errors.category}>
                <select id="p-cat" className="field" value={f.category} onChange={(e) => set('category', e.target.value)}>
                  {!cats.data && <option>Loading…</option>}
                  {cats.data?.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="Composition / molecule" htmlFor="p-comp" error={errors.composition}>
                <input id="p-comp" className="field" placeholder="e.g. Atorvastatin calcium" value={f.composition} onChange={(e) => set('composition', e.target.value)} />
              </Field>
            </div>
            <Field label="Description" htmlFor="p-desc" hint="Therapeutic use, manufacturer, storage and prescription requirement. 3–5 short sentences.">
              <textarea id="p-desc" rows={4} className="field resize-y" value={f.description ?? ''} onChange={(e) => set('description', e.target.value)} />
            </Field>
          </Section>

          <Section title="Pack & strength">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Strength" htmlFor="p-str" error={errors.strength}>
                <input id="p-str" className="field" placeholder="e.g. 10 mg" value={f.strength} onChange={(e) => set('strength', e.target.value)} />
              </Field>
              <Field label="Pack size" htmlFor="p-pack" error={errors.pack}>
                <input id="p-pack" className="field" placeholder="e.g. 10 × 10 tablets" value={f.pack} onChange={(e) => set('pack', e.target.value)} />
              </Field>
              <Field label="Selling unit" htmlFor="p-unit" hint="Price is shown per this unit.">
                <select id="p-unit" className="field" value={f.unit} onChange={(e) => set('unit', e.target.value as Unit)}>
                  {UNITS.map((u) => <option key={u}>{u}</option>)}
                </select>
              </Field>
              <Field label="Packaging" htmlFor="p-pkg" hint="Used by the Packaging filter.">
                <select id="p-pkg" className="field" value={f.packaging} onChange={(e) => set('packaging', e.target.value as Product['packaging'])}>
                  {PACKAGING.map((u) => <option key={u}>{u}</option>)}
                </select>
              </Field>
            </div>
            <div>
              <p className="label">Therapy areas</p>
              <div className="flex flex-wrap gap-2">
                {[...new Set([...THERAPY, ...f.therapy])].map((t) => {
                  const on = f.therapy.includes(t)
                  return (
                    <button key={t} type="button" onClick={() => toggleTherapy(t)} aria-pressed={on} className={`rounded-full border px-3 py-1.5 text-sm transition ${on ? 'border-brand bg-brand text-white' : 'border-line hover:border-brand/50'}`}>
                      {t}
                    </button>
                  )
                })}
                <span className="flex items-center rounded-full border border-dashed border-line pl-3">
                  <input
                    className="w-28 bg-transparent py-1.5 text-sm outline-none"
                    placeholder="Add other…"
                    value={customTherapy}
                    onChange={(e) => setCustomTherapy(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        const t = customTherapy.trim()
                        if (t && !f.therapy.includes(t)) set('therapy', [...f.therapy, t])
                        setCustomTherapy('')
                      }
                    }}
                    aria-label="Add another therapy area"
                  />
                  <Plus className="mr-2 size-4 text-muted" />
                </span>
              </div>
            </div>
          </Section>

          <Section title="Pricing">
            <label className="flex cursor-pointer items-center gap-3 text-sm">
              <input type="checkbox" className="size-4 accent-[var(--color-brand)]" checked={onRequest} onChange={(e) => setOnRequest(e.target.checked)} />
              Price on request <span className="text-muted">(hides the price; buyers send an enquiry)</span>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={`Price per ${f.unit.toLowerCase()} (₹)`} htmlFor="p-price" error={errors.price}>
                <div className="flex">
                  <span className="grid place-items-center rounded-l-xl border border-r-0 border-line bg-mist px-3 text-sm text-muted">₹</span>
                  <input id="p-price" type="number" min={0} step="0.01" disabled={onRequest} className="field !rounded-l-none disabled:bg-mist/60 disabled:text-muted" value={onRequest || f.price == null ? '' : f.price} onChange={(e) => set('price', e.target.value === '' ? null : Number(e.target.value))} />
                </div>
              </Field>
              <Field label="Minimum order quantity" htmlFor="p-moq" error={errors.moq} hint="Optional.">
                <input id="p-moq" type="number" min={1} step={1} className="field" value={f.moq ?? ''} onChange={(e) => set('moq', e.target.value === '' ? undefined : Number(e.target.value))} />
              </Field>
            </div>
          </Section>

          <Section title="Images" desc="JPG, PNG or WebP up to 5 MB. Drag to reorder — the first image is the cover. Without images, an illustration is shown.">
            <div
              onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); upload(e.dataTransfer.files) }}
              onClick={() => fileRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition ${drag ? 'border-brand bg-mist' : 'border-line hover:border-brand/50 hover:bg-mist/40'}`}
            >
              <span className="grid size-12 place-items-center rounded-xl bg-mist text-brand">{uploading ? <Loader2 className="size-6 animate-spin" /> : <UploadCloud className="size-6" />}</span>
              <p className="mt-3 text-sm font-medium">{uploading ? `Uploading ${uploading} image${uploading > 1 ? 's' : ''}…` : 'Drop images here or click to browse'}</p>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple className="hidden" onChange={(e) => { if (e.target.files) upload(e.target.files); e.target.value = '' }} />
            </div>
            {!!f.images?.length && (
              <Reorder.Group axis="x" values={f.images} onReorder={(v) => set('images', v)} className="flex flex-wrap gap-3">
                <AnimatePresence>
                  {f.images.map((url, i) => (
                    <Reorder.Item key={url} value={url} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="group relative size-28 cursor-grab overflow-hidden rounded-xl border border-line bg-mist active:cursor-grabbing">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="size-full object-cover" draggable={false} />
                      {i === 0 && <span className="absolute left-1.5 top-1.5 rounded-md bg-ink/80 px-1.5 py-0.5 text-[10px] font-semibold text-white">Cover</span>}
                      <button type="button" onClick={() => removeImage(url)} className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-full bg-white/90 text-red-600 opacity-0 shadow transition group-hover:opacity-100 focus:opacity-100" aria-label="Remove image">
                        <X className="size-4" />
                      </button>
                    </Reorder.Item>
                  ))}
                </AnimatePresence>
                <button type="button" onClick={() => fileRef.current?.click()} className="grid size-28 place-items-center rounded-xl border-2 border-dashed border-line text-muted transition hover:border-brand hover:text-brand" aria-label="Add more images">
                  <ImagePlus className="size-6" />
                </button>
              </Reorder.Group>
            )}
          </Section>
        </div>

        <div className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <Panel className="p-5">
            <h2 className="font-semibold">Visibility</h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">Show on website</p>
                  <p className="text-xs text-muted">Hidden products stay in the admin only.</p>
                </div>
                <Toggle label="Show on website" checked={f.isActive ?? true} onChange={(v) => set('isActive', v)} />
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="flex items-center gap-1 text-sm font-medium"><Star className="size-3.5 fill-amber text-amber" /> Featured</p>
                  <p className="text-xs text-muted">Appears under “Popular products” on the home page.</p>
                </div>
                <Toggle label="Featured" checked={!!f.featured} onChange={(v) => set('featured', v)} />
              </div>
            </div>
          </Panel>

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">Live preview</p>
            <div className="pointer-events-none">
              <motion.div layout>
                <ProductCard product={preview} />
              </motion.div>
            </div>
          </div>

          {editing && (
            <a href={`/products/${product!.category}/${product!.slug}`} target="_blank" rel="noreferrer" className="btn-ghost w-full !py-2.5">View on website</a>
          )}
        </div>
      </div>

      {/* Sticky save bar on small screens */}
      <div className="sticky bottom-0 -mx-4 mt-6 flex gap-2 border-t border-line bg-white/90 p-3 backdrop-blur sm:hidden">
        <Link href="/admin/products" className="btn-ghost flex-1 !py-2.5">Cancel</Link>
        <button type="submit" disabled={saving || uploading > 0} className="btn-primary flex-1 !py-2.5">{saving && <Loader2 className="size-4 animate-spin" />} Save</button>
      </div>
    </form>
  )
}
