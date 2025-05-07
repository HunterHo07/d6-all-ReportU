/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports
  // Set basePath to match GitHub Pages repository name
  // This ensures correct asset paths for GitHub Pages
  basePath: process.env.NODE_ENV === 'production' ? '/d6-fe-ReportU' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/d6-fe-ReportU/' : '',
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ensure trailing slashes are used
  trailingSlash: true,
};

module.exports = nextConfig;
