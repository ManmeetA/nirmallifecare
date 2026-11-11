import type { Metadata } from 'next'
import { pageOpenGraph } from '@/lib/seo'
import Contact from '@/views/Contact'

export const metadata: Metadata = {
  title: 'Contact Us — Pharma Wholesaler, Navyug Market, Ghaziabad',
  description:
    'Visit or call Nirmal Lifecare, Shop No. 34, Suchitra Complex, Dr Ambedkar Marg, Navyug Market, Ghaziabad 201001. Call or WhatsApp +91 99712 22355 for wholesale medicine rates.',
  alternates: { canonical: '/contact' },
  openGraph: pageOpenGraph('/contact'),
}

export default function Page() {
  return <Contact />
}
