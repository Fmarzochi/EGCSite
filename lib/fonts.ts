import localFont from 'next/font/local';

// The fonts ship with the site, so visitors never contact Google Fonts. The files come from
// the Fontsource npm packages (same Google Fonts files, versioned) rather than next/font/google,
// whose build-time fetch breaks when Google answers with extension-less /l/font?kit= URLs.
export const jakarta = localFont({
  src: '../node_modules/@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2',
  weight: '200 800',
  variable: '--font-jakarta',
  display: 'swap',
});

export const jetbrains = localFont({
  src: '../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2',
  weight: '100 800',
  variable: '--font-jetbrains',
  display: 'swap',
});
