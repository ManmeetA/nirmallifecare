import type { Metadata } from 'next'
import Testimonials from '@/views/Testimonials'

export const metadata: Metadata = {
  title: 'Buyer Reviews',
  description: 'Feedback from pharmacies, hospitals and distributors supplied by Nirmal Lifecare, Ghaziabad.',
  alternates: { canonical: '/testimonials' },
  // Kept out of search results while the reviews are still placeholders — placeholder
  // content counts as thin content. Remove this line once real reviews are added.
  robots: { index: false, follow: true },
}

export default function Page() {
  return <Testimonials />
}
