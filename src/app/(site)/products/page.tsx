import type { Metadata } from 'next'
import { pageOpenGraph } from '@/lib/seo'
import Products from '@/views/Products'

export const metadata: Metadata = {
  title: 'Medicines & Pharma Products — Wholesale Supply in Ghaziabad',
  description:
    'Wholesale tablets, capsules, injections, syrups, creams, eye & ear drops, cardiac & diabetic and oncology medicines from a licensed distributor in Ghaziabad. Send an enquiry for bulk rates.',
  alternates: { canonical: '/products' },
  openGraph: pageOpenGraph('/products'),
}

export default function Page() {
  return <Products />
}
