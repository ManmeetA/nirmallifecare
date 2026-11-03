'use client'

import type { ReactNode } from 'react'
import { MotionConfig } from 'framer-motion'
import { UIProvider } from '../context/ui'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <UIProvider>{children}</UIProvider>
    </MotionConfig>
  )
}
