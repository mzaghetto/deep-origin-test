/** @type {import('next').NextConfig} */
module.exports = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    API_URL: process.env.API_URL,
  },
  typescript: {
    // Allow production builds even if type errors exist
    ignoreBuildErrors: true,
  },
  eslint: {
    // Do not run ESLint during production builds
    ignoreDuringBuilds: true,
  },
};