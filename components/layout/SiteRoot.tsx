import type { ReactNode } from 'react';
import Script from 'next/script';
import '@/styles/global.css';
import { withBase } from '@/lib/base';
import { inter } from '@/lib/font-inter';
import { jakarta, jetbrains } from '@/lib/fonts';
import type { Lang } from '@/lib/lang';
import { softwareApplicationJsonLd } from '@/lib/seo';
import { siteText } from '@/lib/site-i18n';

// Shared shell of the inner pages' root layouts: English at the current addresses, Portuguese
// under /pt/. Ported from src/layouts/Base.astro; only <html lang> and the skip link change.
export default function SiteRoot({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    <html lang={lang === 'pt' ? 'pt-BR' : 'en'} className={`dark ${jakarta.variable} ${inter.variable} ${jetbrains.variable}`}>
      {/* The rule targets the pages router; in an App Router root layout <head> is the documented way. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <link rel="alternate" type="application/rss+xml" title="EGC Releases" href={withBase('rss.xml')} />
      </head>
      <body className="antialiased bg-[#0A0D0C] text-[#F4F6F5]" style={{ WebkitTextSizeAdjust: '100%', textSizeAdjust: '100%' }}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-egc-600 focus:text-white focus:rounded-lg"
        >
          {siteText(lang).skip}
        </a>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd) }} />
        <Script data-goatcounter="https://egc.goatcounter.com/count" src="https://gc.zgo.at/count.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
