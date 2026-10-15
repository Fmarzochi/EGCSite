import { integrations } from '@/data/integrations';
import { releases } from '@/data/releases';
import { canonicalUrl, PRODUCTION_BASE } from '@/lib/base';

// XML for /rss.xml, /sitemap-index.xml and /sitemap-0.xml, generated at build time.
// Same shape as the files @astrojs/rss and @astrojs/sitemap produced, so feed readers
// and the Search Console keep their URLs.

/** Every route the sitemap lists, relative to the site root. Grows with each phase of the port. */
export const SITEMAP_ROUTES = [
  '',
  'en/',
  'get-started/',
  'features/',
  'privacy/',
  'docs/architecture/',
  'docs/cli/',
  'docs/faq/',
  'docs/guardian/',
  'docs/mcp/',
  'docs/memory/',
  'docs/security/',
  'integrations/',
  ...integrations.map((integration) => `integrations/${integration.slug}/`),
];

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export function rssXml(): string {
  const items = releases
    .map((r) => {
      const link = r.link ? `<link>${escapeXml(r.link)}</link><guid isPermaLink="true">${escapeXml(r.link)}</guid>` : '';
      return `<item><title>${escapeXml(r.title)}</title>${link}<description>${escapeXml(r.description)}</description><pubDate>${r.pubDate.toUTCString()}</pubDate></item>`;
    })
    .join('');
  return (
    '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel>' +
    '<title>EGC Releases</title>' +
    '<description>New releases of EGC - Extended Global Context. Your AI agents never start from zero again.</description>' +
    `<link>${PRODUCTION_BASE}</link><language>en-us</language>${items}</channel></rss>`
  );
}

export function sitemapIndexXml(): string {
  return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${canonicalUrl('sitemap-0.xml')}</loc></sitemap></sitemapindex>`;
}

export function sitemapXml(): string {
  const homeAlternates =
    `<xhtml:link rel="alternate" hreflang="pt-BR" href="${canonicalUrl('')}"/>` +
    `<xhtml:link rel="alternate" hreflang="en" href="${canonicalUrl('en/')}"/>` +
    `<xhtml:link rel="alternate" hreflang="x-default" href="${canonicalUrl('')}"/>`;
  const urls = SITEMAP_ROUTES.map((route) => canonicalUrl(route))
    .sort()
    .map((loc) => {
      const isHome = loc === canonicalUrl('') || loc === canonicalUrl('en/');
      return `<url><loc>${loc}</loc>${isHome ? homeAlternates : ''}</url>`;
    })
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`;
}

export function xmlResponse(body: string, type = 'application/xml'): Response {
  return new Response(body, { headers: { 'Content-Type': `${type}; charset=utf-8` } });
}
