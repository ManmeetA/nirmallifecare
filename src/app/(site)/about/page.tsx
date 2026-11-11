import type { Metadata } from 'next'
import { pageOpenGraph } from '@/lib/seo'
import About from '@/views/About'

export const metadata: Metadata = {
  title: 'About Us — Licensed Pharma Wholesaler in Ghaziabad',
  description:
    'Nirmal Lifecare is a licensed pharmaceutical wholesaler at Suchitra Complex, Navyug Market, Ghaziabad, holding Form 20B and 21B drug licences. GST and MSME (Udyam) registered since 2024.',
  alternates: { canonical: '/about' },
  openGraph: pageOpenGraph('/about'),
}

export default function Page() {
  return <About />
}
