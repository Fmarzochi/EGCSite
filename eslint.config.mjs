import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // Static export with images.unoptimized: next/image would add nothing but extra markup,
  // so pages keep the plain <img> tags of the Astro source.
  { rules: { '@next/next/no-img-element': 'off' } },
  globalIgnores(['.next/**', 'out/**', 'lhci-site/**', 'next-env.d.ts']),
]);
