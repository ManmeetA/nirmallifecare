import type { Metadata } from 'next'
import { pageOpenGraph } from '@/lib/seo'
import Home from '@/views/Home'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: pageOpenGraph('/'),
}

export default function Page() {
  return <Home />
}
