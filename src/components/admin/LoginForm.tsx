'use client'

import { useState, type FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react'
import { supabaseBrowser } from '@/lib/supabase/client'
import ProductArt from '../ProductArt'
import { Logo } from '../primitives'

export default function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    const { error } = await supabaseBrowser().auth.signInWithPassword({ email: email.trim(), password })
    if (error) {
      setError(
        error.message === 'Invalid login credentials'
          ? 'Wrong email or password.'
          : /fetch|network/i.test(error.message)
            ? 'Can’t reach the sign-in server. Check your internet connection and the Supabase URL.'
            : error.message,
      )
      setBusy(false)
      return
    }
    const next = params.get('next')
    router.replace(next?.startsWith('/admin') ? next : '/admin')
    router.refresh()
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink p-12 text-white lg:flex lg:flex-col">
        <div className="absolute inset-0 grid-dots opacity-[0.07]" />
        <div className="absolute -left-20 top-1/3 size-[28rem] rounded-full bg-brand/40 blur-3xl animate-blob" />
        <div className="absolute -right-10 bottom-0 size-80 rounded-full bg-amber/20 blur-3xl animate-blob [animation-delay:-6s]" />
        <div className="relative"><Logo light sub={false} /></div>
        <div className="relative my-auto">
          <div className="mb-10 flex gap-4">
            {(['tablet', 'capsule', 'injection', 'drops'] as const).map((f, i) => (
              <div key={f} className="glass !bg-white/10 !border-white/10 grid size-20 place-items-center rounded-2xl animate-float" style={{ animationDelay: `${-i * 1.2}s` }}>
                <ProductArt form={f} className="size-14" />
              </div>
            ))}
          </div>
          <h1 className="text-4xl font-extrabold leading-tight">Manage your catalog<br /><span className="text-gradient">in minutes.</span></h1>
          <p className="mt-4 max-w-md text-white/60">Add products, update prices and images, feature best-sellers and follow up on every buyer enquiry — all in one place.</p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-white p-6">
        <motion.form onSubmit={submit} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="lg:hidden"><Logo sub={false} /></div>
          <h2 className="mt-8 text-3xl font-bold lg:mt-0">Welcome back</h2>
          <p className="mt-2 text-muted">Sign in to the Nirmal LifeCare admin.</p>

          <label className="label mt-8" htmlFor="email">Email</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input id="email" type="email" required autoComplete="email" className="field !pl-10" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <label className="label mt-4" htmlFor="password">Password</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input id="password" type={show ? 'text' : 'password'} required autoComplete="current-password" className="field !px-10" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink" aria-label={show ? 'Hide password' : 'Show password'}>
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>

          {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          <button type="submit" disabled={busy} className="btn-primary btn-shine mt-6 w-full !py-3.5 text-base">
            {busy ? <Loader2 className="size-5 animate-spin" /> : 'Sign in'}
          </button>
          <p className="mt-6 text-center text-xs text-muted">Admin accounts are created in the Supabase dashboard. Forgot your password? Ask the account owner to send a reset link from Supabase → Authentication.</p>
        </motion.form>
      </div>
    </div>
  )
}
