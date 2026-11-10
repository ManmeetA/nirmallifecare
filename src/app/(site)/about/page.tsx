import type { Metadata } from 'next'
import About from '@/views/About'

export const metadata: Metadata = { title: 'About Us', description: 'Nirmal Lifecare is a licensed pharmaceutical wholesaler in Ghaziabad, Uttar Pradesh, holding Form 20B and 21B drug licences. GST and MSME (Udyam) registered.' }

export default function Page() {
  return <About />
}
