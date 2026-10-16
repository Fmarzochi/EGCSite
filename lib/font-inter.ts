import localFont from 'next/font/local';

// Inter is the docs text font. It lives apart from lib/fonts.ts because next/font preloads every
// font of an imported module, and the home, which only uses Jakarta and JetBrains Mono, must not.
export const inter = localFont({
  src: '../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
  weight: '100 900',
  variable: '--font-inter',
  display: 'swap',
});
