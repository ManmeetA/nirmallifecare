import SiteShell from '@/components/Layout'
import JsonLd from '@/components/JsonLd'
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Business + website entity on every public page (local search, knowledge panel). */}
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      <SiteShell>{children}</SiteShell>
    </>
  )
}
