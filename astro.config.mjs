import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://fmarzochi.github.io',
  base: '/EGCSite',
  integrations: [sitemap()],
  output: 'static',
  // Astro 7 defaults to JSX whitespace rules; HTML rules keep the spacing the pages were written with.
  compressHTML: true,
});
