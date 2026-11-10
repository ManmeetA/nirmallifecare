import type { Metadata } from 'next'
import { LegalPage } from '@/views/Legal'

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'How Nirmal Lifecare collects, uses, shares and protects personal data from its website enquiry forms, and your rights under India’s DPDP Act, 2023.',
}

export default function Page() {
  return <LegalPage kind="privacy" />
}
