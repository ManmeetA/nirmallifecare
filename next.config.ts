import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // No ESLint setup in this project yet; type errors still fail the build.
  eslint: { ignoreDuringBuilds: true },
}

export default nextConfig
