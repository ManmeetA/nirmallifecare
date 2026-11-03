import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import Providers from '@/components/Providers'
import './globals.css'

const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800'], variable: '--font-poppins', display: 'swap' })

export const metadata: Metadata = {
  title: { default: 'Nirmal Lifecare — Pharmaceutical Trader & Exporter', template: '%s · Nirmal Lifecare' },
  description: 'Nirmal Lifecare — pharmaceutical trader & exporter. Tablets, capsules, injections and speciality medicines with bulk pricing across India and overseas.',
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
