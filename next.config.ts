import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  // A short refresh so the page's prerendered entry goes stale within seconds.
  cacheLife: { short: { stale: 300, revalidate: 5, expire: 86400 } },
}

export default nextConfig
