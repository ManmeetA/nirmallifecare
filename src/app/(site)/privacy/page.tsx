import type { Metadata } from 'next'
import { LegalPage } from '@/views/Legal'

export const metadata: Metadata = { title: 'Privacy policy' }

export default function Page() {
  return <LegalPage kind="privacy" />
}
