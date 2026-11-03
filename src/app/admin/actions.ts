'use server'

import { revalidatePath } from 'next/cache'
import { getAdmin } from '@/lib/supabase/server'

/** Called after product edits so the public pages pick up changes immediately. */
export async function revalidateCatalog() {
  const { isAdmin } = await getAdmin()
  if (!isAdmin) throw new Error('Not authorised')
  revalidatePath('/', 'layout')
}
