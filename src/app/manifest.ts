import type { MetadataRoute } from 'next'
import { site } from '@/data/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — Pharmaceutical Wholesaler, Ghaziabad`,
    short_name: site.name,
    description: site.blurb,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0f2a2a',
    icons: [{ src: '/icon.png', sizes: '256x256', type: 'image/png' }],
  }
}
