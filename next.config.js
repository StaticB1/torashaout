/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ],
  },
}

module.exports = nextConfig
