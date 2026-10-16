import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import Script from 'next/script';
import '@/styles/home.css';
import { canonicalUrl, withBase } from '@/lib/base';
import { jakarta, jetbrains } from '@/lib/fonts';
import { homeTranslator } from '@/lib/home-i18n';
import { homeBootScript, type Lang } from '@/lib/lang';
import { pageMetadata, softwareApplicationJsonLd } from '@/lib/seo';

// Shared shell of the two home root layouts, / (en) and /pt/ (pt-BR). The home has its own
// header, footer and styles (src/pages/index.astro), so it does not use the site layout.

const metaFor = (lang: Lang, route: string) => {
  const tx = homeTranslator(lang);
  return { title: tx('meta.title'), description: tx('meta.desc'), route };
};
const META: Record<Lang, { title: string; description: string; route: string }> = {
  pt: metaFor('pt', ''),
  en: metaFor('en', 'en/'),
};

export function homeMetadata(lang: Lang): Metadata {
  const base = pageMetadata(META[lang]);
  return {
    ...base,
    // The Astro home used the short form of the title on Twitter: the part before " · ".
    twitter: { ...base.twitter, title: META[lang].title.split(' · ')[0] },
    alternates: {
      canonical: canonicalUrl(META[lang].route),
      languages: { en: canonicalUrl(''), 'pt-BR': canonicalUrl('pt/'), 'x-default': canonicalUrl('') },
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
        <script dangerouslySetInnerHTML={{ __html: homeBootScript() }} />
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
