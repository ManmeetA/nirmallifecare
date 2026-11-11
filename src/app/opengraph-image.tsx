import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ImageResponse } from 'next/og'

// Default share image (WhatsApp, LinkedIn, Facebook, X) for every page.
export const alt = 'Nirmal Lifecare — Licensed Pharmaceutical Wholesaler & Distributor, Ghaziabad'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  const mark = await readFile(path.join(process.cwd(), 'public/brand/nrl-mark.png'))
  const markSrc = `data:image/png;base64,${mark.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'linear-gradient(135deg, #0f2a2a 0%, #0e6b62 65%, #2f9c8f 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ display: 'flex', background: 'white', borderRadius: 20, padding: '12px 16px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={markSrc} width={150} height={74} alt="" />
          </div>
          <div style={{ display: 'flex', fontSize: 54, fontWeight: 800 }}>
            Nirmal <span style={{ color: '#f2a93b', marginLeft: 14 }}>Lifecare</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 62, fontWeight: 800, lineHeight: 1.1 }}>Licensed Pharmaceutical Wholesaler &amp; Distributor</div>
          <div style={{ fontSize: 34, marginTop: 18, color: 'rgba(255,255,255,0.8)' }}>
            Tablets · Capsules · Injections · Speciality medicines at bulk rates
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, fontSize: 26, color: 'rgba(255,255,255,0.75)' }}>
          <span style={{ whiteSpace: 'nowrap' }}>Dr Ambedkar Marg, Ghaziabad</span>
          <span style={{ width: 8, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.4)' }} />
          <span style={{ color: '#f2a93b', whiteSpace: 'nowrap' }}>Drug licence 20B &amp; 21B · GST registered</span>
        </div>
      </div>
    ),
    size,
  )
}
