import type { Metadata } from 'next'
import Contact from '@/views/Contact'

export const metadata: Metadata = { title: 'Contact Us', description: 'Call, WhatsApp or send an enquiry — Nirmal LifeCare replies with rates and availability.' }

export default function Page() {
  return <Contact />
}
