import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import Providers from '@/components/Providers'
import './globals.css'

const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800'], variable: '--font-poppins', display: 'swap' })

export const metadata: Metadata = {
  title: { default: 'Nirmal Lifecare — Licensed Pharmaceutical Wholesaler, Ghaziabad', template: '%s · Nirmal Lifecare' },
  description: 'Nirmal Lifecare — licensed pharmaceutical wholesaler in Ghaziabad, Uttar Pradesh (Drug licence 20B & 21B, GST registered). Tablets, capsules, injections and speciality medicines at bulk rates for pharmacies, hospitals and distributors.',
  openGraph: { siteName: 'Nirmal Lifecare', type: 'website', locale: 'en_IN' },
}

export const viewport: Viewport = { themeColor: '#0f2a2a' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
