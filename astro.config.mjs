import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const onVercel = process.env.VERCEL === '1';
const deploymentHost = process.env.VERCEL_URL;
if (onVercel && !deploymentHost) {
  throw new Error('VERCEL_URL is required when building for Vercel');
}

export default defineConfig({
  site: onVercel ? `https://${deploymentHost}` : 'https://fmarzochi.github.io',
  base: onVercel ? '/' : '/EGCSite',
  integrations: [sitemap()],
  output: 'static',
  // Astro 7 defaults to 'jsx' whitespace rules; true keeps Astro 5's lossless compression, which preserves how the pages render.
  compressHTML: true,
});
