import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import SiteRoot from '@/components/layout/SiteRoot';
import { DEFAULT_DESCRIPTION, pageMetadata, siteViewport } from '@/lib/seo';

// Root layout of the English inner pages (every page but the home), at their current addresses.

export const metadata: Metadata = pageMetadata({ title: 'EGC', description: DEFAULT_DESCRIPTION, route: '' });
export const viewport = siteViewport;

export default function SiteLayout({ children }: { children: ReactNode }) {
  return <SiteRoot lang="en">{children}</SiteRoot>;
}
