import type { Metadata } from 'next'
import Products from '@/views/Products'

export const metadata: Metadata = {
  title: 'Products & Services',
  description: 'Browse tablets, capsules, injections, syrups, creams, drops, cardiac & diabetic and oncology medicines. Send an enquiry for bulk pricing.',
}

export default function Page() {
  return <Products />
}
