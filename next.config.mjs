/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: './dist', // Changes the build output directory to `./dist/`.
    experimental: {
      serverActions: {
        bodySizeLimit: '20mb',
      },
    }
  }


export default nextConfig
