import type { Metadata } from 'next'
import { Sitemap } from '@/views/Legal'

export const metadata: Metadata = { title: 'Sitemap', description: 'All pages and products on the Nirmal Lifecare website.' }

export default function Page() {
  return <Sitemap />
}
