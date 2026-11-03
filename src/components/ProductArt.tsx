import type { Form } from '../lib/types'

/**
 * Illustrated stand-in for product photography, one per dosage form.
 * When a product has real images, render those instead (see ProductMedia).
 */
export default function ProductArt({ form, className = '' }: { form: Form; className?: string }) {
  const id = `g-${form}`
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-a`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#dcebe6" />
        </linearGradient>
        <linearGradient id={`${id}-b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2f9c8f" />
          <stop offset="1" stopColor="#0e6b62" />
        </linearGradient>
        <linearGradient id={`${id}-c`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7c46f" />
          <stop offset="1" stopColor="#e0941f" />
        </linearGradient>
      </defs>
      {art(form, id)}
    </svg>
  )
}

function art(form: Form, id: string) {
  const a = `url(#${id}-a)`, b = `url(#${id}-b)`, c = `url(#${id}-c)`
  switch (form) {
    case 'tablet':
      return (
        <g>
          <rect x="18" y="32" width="84" height="56" rx="12" fill={a} stroke="#8fc0b6" strokeWidth="2.5" />
          {[0, 1, 2].map((i) =>
            [0, 1].map((j) => (
              <g key={`${i}${j}`}>
                <circle cx={38 + i * 22} cy={50 + j * 20} r="8" fill="#e5f1ee" stroke="#6fae9f" strokeWidth="2.5" />
                <path d={`M${32 + i * 22} ${47 + j * 20} q4 -4 9 -3`} stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
              </g>
            )),
          )}
        </g>
      )
    case 'capsule':
      return (
        <g>
          <g transform="rotate(-35 60 60)">
            <rect x="26" y="48" width="68" height="24" rx="12" fill="#fff" stroke="#6fae9f" strokeWidth="2.5" />
            <path d="M60 48 h22 a12 12 0 0 1 0 24 h-22 z" fill={b} />
            <rect x="32" y="52" width="20" height="4" rx="2" fill="#fff" opacity=".9" />
          </g>
          <g transform="rotate(25 80 86) translate(8 8)">
            <rect x="58" y="78" width="44" height="16" rx="8" fill="#fff" stroke="#e0941f" strokeWidth="2" />
            <path d="M80 78 h14 a8 8 0 0 1 0 16 h-14 z" fill={c} />
          </g>
        </g>
      )
    case 'injection':
    case 'oncology':
      return (
        <g>
          <rect x="44" y="18" width="32" height="14" rx="4" fill={form === 'oncology' ? c : b} />
          <rect x="48" y="30" width="24" height="8" fill="#b7d3cc" />
          <path d="M40 40 q0 -4 4 -4 h32 q4 0 4 4 v58 q0 8 -8 8 h-24 q-8 0 -8 -8 z" fill={a} stroke="#6fae9f" strokeWidth="2.5" />
          <rect x="44" y="58" width="32" height="26" rx="3" fill="#fff" stroke="#cfe2dd" />
          <rect x="49" y="64" width="22" height="3" rx="1.5" fill={form === 'oncology' ? '#e0941f' : '#0e6b62'} />
          <rect x="49" y="71" width="15" height="3" rx="1.5" fill="#9cc5bb" />
          <path d="M44 88 h32 v10 q0 4 -4 4 h-24 q-4 0 -4 -4 z" fill="#2f9c8f" opacity=".25" />
          <rect x="45" y="42" width="5" height="40" rx="2.5" fill="#fff" opacity=".8" />
        </g>
      )
    case 'syrup':
      return (
        <g>
          <rect x="47" y="14" width="26" height="14" rx="3" fill={b} />
          <path d="M50 28 h20 v8 q14 4 14 18 v44 q0 8 -8 8 h-32 q-8 0 -8 -8 v-44 q0 -14 14 -18 z" fill={c} opacity=".92" />
          <rect x="40" y="58" width="40" height="30" rx="4" fill="#fff" />
          <rect x="46" y="65" width="28" height="4" rx="2" fill="#0e6b62" />
          <rect x="46" y="74" width="18" height="3" rx="1.5" fill="#9cc5bb" />
          <rect x="41" y="42" width="5" height="12" rx="2.5" fill="#fff" opacity=".6" />
        </g>
      )
    case 'cream':
      return (
        <g transform="rotate(-20 60 60)">
          <path d="M28 44 h56 l8 32 h-72 z" fill={a} stroke="#6fae9f" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M20 76 h72 v8 h-72 z" fill="#b7d3cc" />
          <rect x="84" y="50" width="14" height="20" rx="3" fill={b} />
          <rect x="38" y="54" width="34" height="5" rx="2.5" fill="#0e6b62" />
          <rect x="38" y="63" width="22" height="4" rx="2" fill="#9cc5bb" />
        </g>
      )
    case 'drops':
      return (
        <g>
          <path d="M60 8 l7 20 h-14 z" fill="#fff" stroke="#6fae9f" strokeWidth="2" strokeLinejoin="round" />
          <rect x="48" y="28" width="24" height="16" rx="4" fill={b} />
          <path d="M42 48 q0 -4 4 -4 h28 q4 0 4 4 v50 q0 8 -8 8 h-20 q-8 0 -8 -8 z" fill={a} stroke="#6fae9f" strokeWidth="2.5" />
          <rect x="46" y="64" width="28" height="22" rx="3" fill="#fff" stroke="#cfe2dd" />
          <rect x="50" y="70" width="20" height="3" rx="1.5" fill="#0e6b62" />
          <path d="M92 70 q-6 9 0 14 q6 -5 0 -14z" fill="#2f9c8f" opacity=".6" />
          <path d="M28 52 q-5 7 0 11 q5 -4 0 -11z" fill="#2f9c8f" opacity=".4" />
        </g>
      )
    case 'cardiac':
      return (
        <g>
          <path d="M60 98 C 20 72 14 50 26 36 c10 -12 28 -10 34 4 c6 -14 24 -16 34 -4 c12 14 6 36 -34 62z" fill={a} stroke="#6fae9f" strokeWidth="2.5" />
          <path d="M28 62 h16 l6 -12 l8 24 l7 -16 l5 4 h22" stroke="#0e6b62" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="94" cy="28" r="9" fill={c} />
          <path d="M89 28 h10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )
  }
}
