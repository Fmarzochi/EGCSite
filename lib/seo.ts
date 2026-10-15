import type { Metadata, Viewport } from 'next';
import { integrations } from '@/data/integrations';
import { canonicalUrl, PRODUCTION_BASE, withBase } from '@/lib/base';

export const DEFAULT_DESCRIPTION =
  'EGC - Extended Global Context. Your AI remembers your project across sessions and tools.';

const OG_IMAGE = new URL('og.png', PRODUCTION_BASE).href;

interface PageMeta {
  title: string;
  description?: string;
  /** Route relative to the site root, with a trailing slash: 'docs/faq/'; '' for the home. */
  route: string;
}

export function pageMetadata({ title, description = DEFAULT_DESCRIPTION, route }: PageMeta): Metadata {
  const url = canonicalUrl(route);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      images: [{ url: OG_IMAGE, width: 1729, height: 910, alt: title, type: 'image/png' }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@MarzochiFelipe',
      title,
      description,
      images: [OG_IMAGE],
    },
    icons: { icon: [{ url: withBase('favicon.svg'), type: 'image/svg+xml' }] },
    formatDetection: { telephone: false },
    other: {
      'apple-mobile-web-app-capable': 'yes',
      'pincushion-project': 'pc_proj_mquj6ktjdy5',
    },
  };
}

/** Docs pages follow the "{title} - EGC Docs" pattern. */
export function docsMetadata(meta: PageMeta): Metadata {
  return pageMetadata({ ...meta, title: `${meta.title} - EGC Docs` });
}

export const siteViewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#06221A' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
};

export const softwareApplicationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'EGC - Extended Global Context',
  description: `Local-first MCP runtime that gives every AI coding tool the same persistent memory, security guardrails and token savings, across ${integrations.length} tools.`,
  operatingSystem: 'macOS, Windows, Linux',
  applicationCategory: 'DeveloperApplication',
  license: 'https://www.apache.org/licenses/LICENSE-2.0',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  downloadUrl: 'https://www.npmjs.com/package/@egchq/egc',
  sameAs: ['https://github.com/Fmarzochi/EGC', 'https://www.npmjs.com/package/@egchq/egc'],
  url: PRODUCTION_BASE,
};
