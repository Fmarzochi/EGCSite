import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://fmarzochi.github.io',
  base: '/EGCSite',
  integrations: [tailwind()],
  output: 'static',
});
