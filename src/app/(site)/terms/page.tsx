import type { Metadata } from 'next'
import { LegalPage } from '@/views/Legal'

export const metadata: Metadata = {
  title: 'Terms of use',
  description: 'Terms for using the Nirmal Lifecare website and buying from us: supply only to licensed buyers, quotes, orders, returns and governing law.',
  alternates: { canonical: '/terms' },
}

export default function Page() {
  return <LegalPage kind="terms" />
}
