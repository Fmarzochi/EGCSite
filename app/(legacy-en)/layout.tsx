import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { canonicalUrl, withBase } from '@/lib/base';

// /en/ was the English home until the home moved to the same scheme as the inner pages
// (English at /, Portuguese at /pt/). The address stays alive for old links and leads to /.
// GitHub Pages serves static files only, so the redirect is a meta refresh plus a script that
// keeps the query and the hash.

export const metadata: Metadata = {
  title: 'EGC',
  alternates: { canonical: canonicalUrl('') },
  robots: { index: false, follow: true },
};

const target = withBase('');

export default function LegacyEnLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="refresh" content={`0; url=${target}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `location.replace(${JSON.stringify(target)}+location.search+location.hash);`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
