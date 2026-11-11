import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import Providers from '@/components/Providers'
import { SITE_URL } from '@/lib/seo'
import './globals.css'

const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800'], variable: '--font-poppins', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Pharma Wholesaler & Distributor in Ghaziabad | Nirmal Lifecare',
    template: '%s | Nirmal Lifecare',
  },
  description:
    'Nirmal Lifecare is a licensed pharmaceutical wholesaler and distributor on Dr Ambedkar Marg, Ghaziabad (Drug licence 20B & 21B, GST registered). Tablets, capsules, injections and speciality medicines at bulk rates for pharmacies, hospitals and distributors.',
  applicationName: 'Nirmal Lifecare',
  openGraph: { siteName: 'Nirmal Lifecare', type: 'website', locale: 'en_IN' },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  // Paste the code from Google Search Console → Settings → Ownership verification → HTML tag.
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } : undefined,
  formatDetection: { telephone: false },
}

export const viewport: Viewport = { themeColor: '#0f2a2a' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={poppins.variable}>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
