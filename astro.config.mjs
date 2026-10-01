import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://fmarzochi.github.io',
  base: '/EGCSite',
  integrations: [sitemap()],
  output: 'static',
  // Astro 7 defaults to 'jsx' whitespace rules; true keeps Astro 5's lossless compression, which preserves how the pages render.
  compressHTML: true,
});
