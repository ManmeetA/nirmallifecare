import type { Metadata } from 'next'
import { LegalPage } from '@/views/Legal'

export const metadata: Metadata = { title: 'Terms of use' }

export default function Page() {
  return <LegalPage kind="terms" />
}
