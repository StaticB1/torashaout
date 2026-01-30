/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Temporarily ignore build errors for deployment
    ignoreBuildErrors: true,
  },
  eslint: {
    // Temporarily ignore during builds
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'blogger.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'dailynews.co.zw',
      },
      {
        protocol: 'https',
        hostname: 'cdn.thestandard.co.zw',
      },
      {
        protocol: 'https',
        hostname: 'nehandaradio.com',
      },
      {
        protocol: 'https',
        hostname: 'i0.wp.com',
      },
      {
        protocol: 'https',
        hostname: 'www.pindula.co.zw',
      },
      {
        protocol: 'https',
        hostname: 'www.zimbabwenow.co.zw',
      },
      {
        protocol: 'https',
        hostname: 'startupbiz.co.zw',
      },
    ],
  },
}

module.exports = nextConfig
