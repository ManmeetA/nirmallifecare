import Link from 'next/link'

/** Notice shown at the point of collection under every form (DPDP Act notice-before-consent). */
export default function PrivacyNote({ light = false, className = '' }: { light?: boolean; className?: string }) {
  const link = `font-medium underline underline-offset-2 ${light ? 'text-white hover:text-amber' : 'text-brand hover:text-brand-600'}`
  return (
    <p className={`text-xs leading-relaxed ${light ? 'text-white/60' : 'text-muted'} ${className}`}>
      We use these details only to reply to your enquiry. By submitting, you agree to our{' '}
      <Link href="/privacy" target="_blank" className={link}>Privacy policy</Link> and{' '}
      <Link href="/terms" target="_blank" className={link}>Terms of use</Link>.
    </p>
  )
}
