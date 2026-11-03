import type { Metadata } from 'next'
import About from '@/views/About'

export const metadata: Metadata = { title: 'About Us', description: 'Nirmal Lifecare supplies quality medicines to pharmacies, hospitals and distributors across India and export markets.' }

export default function Page() {
  return <About />
}
