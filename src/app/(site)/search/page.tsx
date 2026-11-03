import { Suspense } from 'react'
import type { Metadata } from 'next'
import Category from '@/views/Category'

export const metadata: Metadata = { title: 'Search', robots: { index: false } }

export default function Page() {
  return (
    <Suspense>
      <Category search />
    </Suspense>
  )
}
