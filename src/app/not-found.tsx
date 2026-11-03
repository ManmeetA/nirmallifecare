import type { Metadata } from 'next'
import SiteShell from '@/components/Layout'
import NotFound from '@/views/NotFound'

export const metadata: Metadata = { title: 'Page not found' }

// Unmatched URLs render outside the (site) group, so wrap them in the site chrome here.
export default function RootNotFound() {
  return (
    <SiteShell>
      <NotFound />
    </SiteShell>
  )
}
