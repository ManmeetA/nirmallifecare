'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import ProductArt from '../components/ProductArt'

export default function NotFound() {
  return (
    <section className="container-x flex flex-col items-center py-14 text-center">
      <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
        <ProductArt form="capsule" className="size-40" />
      </motion.div>
      <h1 className="mt-6 text-6xl font-extrabold text-gradient">404</h1>
      <p className="mt-3 text-lg text-muted">We couldn’t find that page — it may have moved.</p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="btn-primary">Go home</Link>
        <Link href="/products" className="btn-ghost">Browse products</Link>
      </div>
    </section>
  )
}
