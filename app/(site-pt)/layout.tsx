import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import SiteRoot from '@/components/layout/SiteRoot';
import { DEFAULT_DESCRIPTION, pageMetadata, siteViewport } from '@/lib/seo';

// Root layout of the Portuguese inner pages, under /pt/. Only the pages listed in
// lib/site-i18n.ts (PT_ROUTES) exist here; the others still lead to the English version.

export const metadata: Metadata = pageMetadata({ title: 'EGC', description: DEFAULT_DESCRIPTION, route: '' });
export const viewport = siteViewport;

export default function SitePtLayout({ children }: { children: ReactNode }) {
  return <SiteRoot lang="pt">{children}</SiteRoot>;
}
