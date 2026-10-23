/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/projects',
        permanent: true, // Sends a 308 Permanent Redirect status code
      },
    ]
  },
  // Dev only: proxy /api to the backend, so the browser sees it as the same site as the
  // frontend and keeps its cookies (WebKit drops cookies from api.localhost)
  async rewrites() {
    const target = process.env.BACKEND_PROXY_TARGET?.replace(/\/+$/, '')
    if (!target) return []
    return [
      {
        source: '/api/:path*',
        destination: `${target}/:path*`,
      },
    ]
  },
})
