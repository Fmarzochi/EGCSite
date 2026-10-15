import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import Script from 'next/script';
import en from '@/dictionaries/en.json';
import pt from '@/dictionaries/pt.json';
import { canonicalUrl, withBase } from '@/lib/base';
import { jakarta, jetbrains } from '@/lib/fonts';
import { type Lang, langRedirectScript } from '@/lib/lang';
import { pageMetadata, softwareApplicationJsonLd } from '@/lib/seo';

// Shared shell of the two home root layouts, / (pt-BR) and /en/ (en). The home has its own
// header, footer and styles (src/pages/index.astro), so it does not use the site layout.

// Texts come from dictionaries/*.json, copied from the Astro home by scripts/extract-i18n.mjs.
const META: Record<Lang, { title: string; description: string; route: string }> = {
  pt: { title: pt['meta.title'], description: pt['meta.desc'], route: '' },
  en: { title: en['meta.title'], description: en['meta.desc'], route: 'en/' },
};

export function homeMetadata(lang: Lang): Metadata {
  const base = pageMetadata(META[lang]);
  return {
    ...base,
    alternates: {
      canonical: canonicalUrl(META[lang].route),
      languages: { 'pt-BR': canonicalUrl(''), en: canonicalUrl('en/'), 'x-default': canonicalUrl('') },
    },
  };
}

export const homeViewport: Viewport = { themeColor: '#06221A', viewportFit: 'cover' };

export default function HomeRoot({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    // The inline script adds .js to <html> before hydration, hence suppressHydrationWarning.
    <html lang={lang === 'pt' ? 'pt-BR' : 'en'} className={`${jakarta.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      {/* The rule targets the pages router; in an App Router root layout <head> is the documented way. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: langRedirectScript(lang) }} />
        <link rel="alternate" type="application/rss+xml" title="EGC Releases" href={withBase('rss.xml')} />
      </head>
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd) }} />
        <Script data-goatcounter="https://egc.goatcounter.com/count" src="https://gc.zgo.at/count.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
