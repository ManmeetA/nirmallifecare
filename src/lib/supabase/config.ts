// Accepts either the legacy anon key or the newer publishable key (sb_publishable_…).
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

/** False until the env vars are set — the public site then falls back to the starter catalog. */
export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

export const IMAGE_BUCKET = 'product-images'
