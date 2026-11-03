import type { Metadata } from 'next'
import Testimonials from '@/views/Testimonials'

export const metadata: Metadata = { title: 'Testimonials', description: 'Feedback from pharmacies, hospitals and distributors supplied by Nirmal Lifecare.' }

export default function Page() {
  return <Testimonials />
}
