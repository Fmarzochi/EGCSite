import type { NextConfig } from 'next';

// GitHub Pages serves the site under /EGCSite; Vercel previews serve it from the root.
const isVercel = process.env.VERCEL === '1';
const basePath = isVercel ? '' : '/EGCSite';

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true, // GitHub Pages serves /route/index.html
  images: { unoptimized: true },
  // Read by withBase() for raw <img> and href values that next/link does not prefix.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  reactStrictMode: true,
};

export default nextConfig;
