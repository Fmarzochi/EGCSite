import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Script from 'next/script';
import '@/styles/global.css';
import { withBase } from '@/lib/base';
import { inter } from '@/lib/font-inter';
import { jakarta, jetbrains } from '@/lib/fonts';
import { DEFAULT_DESCRIPTION, pageMetadata, siteViewport, softwareApplicationJsonLd } from '@/lib/seo';

// Root layout of every page but the home: ported from src/layouts/Base.astro.

export const metadata: Metadata = pageMetadata({ title: 'EGC', description: DEFAULT_DESCRIPTION, route: '' });
export const viewport = siteViewport;

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`dark ${jakarta.variable} ${inter.variable} ${jetbrains.variable}`}>
      <head>
        <link rel="alternate" type="application/rss+xml" title="EGC Releases" href={withBase('rss.xml')} />
      </head>
      <body className="antialiased bg-[#0A0D0C] text-[#F4F6F5]" style={{ WebkitTextSizeAdjust: '100%', textSizeAdjust: '100%' }}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-egc-600 focus:text-white focus:rounded-lg"
        >
          Skip to content
        </a>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd) }} />
        <Script data-goatcounter="https://egc.goatcounter.com/count" src="https://gc.zgo.at/count.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
