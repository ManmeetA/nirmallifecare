/**
 * Admin data access (browser, signed-in admin). Every write is authorised by
 * Supabase RLS via public.is_admin(), so these calls fail for anyone else.
 */
import { supabaseBrowser } from './supabase/client'
import { IMAGE_BUCKET } from './supabase/config'
import { toEnquiry, toProduct, toProductRow, type EnquiryRow, type ProductInput, type ProductRow } from './supabase/mappers'
import type { EnquiryRecord, EnquiryStatus, Product } from './types'

const db = () => supabaseBrowser()

function fail(error: { message: string; code?: string }): never {
  if (error.code === '23505') throw new Error('Another product already uses this URL slug. Change the name or slug.')
  if (error.code === '42501') throw new Error('Your account is not allowed to do this. Ask an owner to add you to admin_users.')
  throw new Error(error.message)
}

export const adminApi = {
  async products(): Promise<Product[]> {
    const { data, error } = await db().from('products').select('*').order('updated_at', { ascending: false })
    if (error) fail(error)
    return (data as ProductRow[]).map(toProduct)
  },

  async product(id: string): Promise<Product | null> {
    const { data, error } = await db().from('products').select('*').eq('id', id).maybeSingle()
    if (error) fail(error)
    return data ? toProduct(data as ProductRow) : null
  },

  async create(input: ProductInput): Promise<Product> {
    const { data, error } = await db().from('products').insert(toProductRow(input)).select('*').single()
    if (error) fail(error)
    return toProduct(data as ProductRow)
  },

  async update(id: string, input: ProductInput): Promise<Product> {
    const { data, error } = await db().from('products').update(toProductRow(input)).eq('id', id).select('*').single()
    if (error) fail(error)
    return toProduct(data as ProductRow)
  },

  async setFlags(id: string, flags: { featured?: boolean; isActive?: boolean }) {
    const patch: Record<string, boolean> = {}
    if (flags.featured !== undefined) patch.featured = flags.featured
    if (flags.isActive !== undefined) patch.is_active = flags.isActive
    const { error } = await db().from('products').update(patch).eq('id', id)
    if (error) fail(error)
  },

  async remove(p: Product) {
    const { error } = await db().from('products').delete().eq('id', p.id!)
    if (error) fail(error)
    await adminApi.removeImages(p.images ?? [])
  },

  /** Uploads to the public product-images bucket and returns the public URL. */
  async uploadImage(file: File): Promise<string> {
    if (!file.type.startsWith('image/')) throw new Error('Only image files can be uploaded.')
    if (file.size > 5 * 1024 * 1024) throw new Error('Images must be 5 MB or smaller.')
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
    const path = `products/${crypto.randomUUID()}.${ext}`
    const { error } = await db().storage.from(IMAGE_BUCKET).upload(path, file, { cacheControl: '31536000', contentType: file.type })
    if (error) throw new Error(error.message)
    return db().storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl
  },

  /** Deletes images that live in our bucket; external URLs are left alone. */
  async removeImages(urls: string[]) {
    const marker = `/storage/v1/object/public/${IMAGE_BUCKET}/`
    const paths = urls.filter((u) => u.includes(marker)).map((u) => decodeURIComponent(u.split(marker)[1]))
    if (paths.length) await db().storage.from(IMAGE_BUCKET).remove(paths)
  },

  async enquiries(): Promise<EnquiryRecord[]> {
    const { data, error } = await db().from('enquiries').select('*').order('created_at', { ascending: false }).limit(500)
    if (error) fail(error)
    return (data as EnquiryRow[]).map(toEnquiry)
  },

  async updateEnquiry(id: string, patch: { status?: EnquiryStatus; notes?: string | null }) {
    const { error } = await db().from('enquiries').update(patch).eq('id', id)
    if (error) fail(error)
  },

  async deleteEnquiry(id: string) {
    const { error } = await db().from('enquiries').delete().eq('id', id)
    if (error) fail(error)
  },

  async newEnquiryCount(): Promise<number> {
    const { count } = await db().from('enquiries').select('id', { count: 'exact', head: true }).eq('status', 'new')
    return count ?? 0
  },

  async signOut() {
    await db().auth.signOut()
  },
}
