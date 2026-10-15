import type { ReactNode } from 'react';
import Link from 'next/link';
import '@/styles/docs.css';
import { Icon } from '@/components/brand/icons';
import DocsBehavior from '@/components/docs/DocsBehavior';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { integrations } from '@/data/integrations';

// Ported from src/layouts/DocsLayout.astro: sidebar, content column, "On this page" and pagination.
// Only the main nav and the pagination prefetch: the sidebar and the mobile strip would fetch
// every docs page on each visit and compete with the page itself on a slow connection.

export type DocId =
  | 'get-started'
  | 'features'
  | 'memory'
  | 'guardian'
  | 'mcp'
  | 'integrations'
  | 'architecture'
  | 'security'
  | 'cli'
  | 'faq'
  | 'privacy';

interface SidebarLink {
  href: string;
  label: string;
  id: string;
  external?: boolean;
}

const sections: { label: string; links: SidebarLink[] }[] = [
  {
    label: 'Getting Started',
    links: [
      { href: '/get-started/', label: 'Installation', id: 'get-started' },
      { href: '/features/', label: 'Features', id: 'features' },
    ],
  },
  {
    label: 'MCP Servers',
    links: [
      { href: '/docs/memory/', label: 'egc-memory', id: 'memory' },
      { href: '/docs/guardian/', label: 'egc-guardian', id: 'guardian' },
      { href: '/docs/mcp/', label: 'Overview', id: 'mcp' },
    ],
  },
  {
    label: 'Integrations',
    links: [{ href: '/integrations/', label: `All ${integrations.length} tools`, id: 'integrations' }],
  },
  {
    label: 'Reference',
    links: [
      { href: '/docs/architecture/', label: 'Architecture', id: 'architecture' },
      { href: '/docs/security/', label: 'Security', id: 'security' },
      { href: '/docs/cli/', label: 'CLI Reference', id: 'cli' },
      { href: '/docs/faq/', label: 'FAQ', id: 'faq' },
      { href: 'https://github.com/Fmarzochi/EGC/blob/main/docs/VISION.md', label: 'Vision', id: 'vision', external: true },
    ],
  },
  {
    label: 'Community',
    links: [
      { href: 'https://discord.gg/FmXbgUmdmM', label: 'Discord', id: 'discord', external: true },
      { href: 'https://github.com/Fmarzochi/EGC/blob/main/.github/CONTRIBUTING.md', label: 'Contributing', id: 'contributing', external: true },
      { href: 'https://github.com/Fmarzochi/EGC/releases', label: 'Releases', id: 'releases', external: true },
    ],
  },
  {
    label: 'Legal',
    links: [{ href: '/privacy/', label: 'Privacy Policy', id: 'privacy' }],
  },
];

const docOrder = [
  { id: 'get-started', label: 'Installation', href: '/get-started/' },
  { id: 'features', label: 'Features', href: '/features/' },
  { id: 'memory', label: 'egc-memory', href: '/docs/memory/' },
  { id: 'guardian', label: 'egc-guardian', href: '/docs/guardian/' },
  { id: 'mcp', label: 'MCP Servers', href: '/docs/mcp/' },
  { id: 'integrations', label: 'Integrations', href: '/integrations/' },
  { id: 'architecture', label: 'Architecture', href: '/docs/architecture/' },
  { id: 'security', label: 'Security', href: '/docs/security/' },
  { id: 'cli', label: 'CLI Reference', href: '/docs/cli/' },
  { id: 'faq', label: 'FAQ', href: '/docs/faq/' },
];

interface DocsShellProps {
  current?: DocId;
  toc?: { id: string; label: string }[];
  /** Section focus view: with JS, a TOC link shows only that section at the top. Without JS the page stays whole. */
  focusSections?: boolean;
  children: ReactNode;
}

export default function DocsShell({ current, toc, focusSections = false, children }: DocsShellProps) {
  const sectionPicker = focusSections && toc?.length ? toc : undefined;
  const currentIndex = docOrder.findIndex((page) => page.id === current);
  const previous = currentIndex > 0 ? docOrder[currentIndex - 1] : null;
  const next = currentIndex >= 0 ? docOrder[currentIndex + 1] : null;
  const currentHref = [...docOrder, { id: 'privacy', href: '/privacy/' }].find((page) => page.id === current)?.href;

  return (
    <div className="bg-[#0A0D0C] text-[#F4F6F5] min-h-screen">
      <Navbar current={currentHref} />

      {/* Mobile Sidebar Backdrop */}
      <div
        id="docs-sidebar-backdrop"
        className="md:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm opacity-0 pointer-events-none invisible transition-all duration-300"
        aria-hidden="true"
      ></div>

      <div className="docs-shell mx-auto px-4 sm:px-6 lg:px-8">
        <div className="docs-mobile-bar md:hidden">
          <button id="docs-sidebar-toggle" type="button" aria-label="Open docs menu" aria-expanded="false" aria-controls="docs-sidebar" className="docs-mobile-toggle">
            <svg id="docs-sidebar-icon-open" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg id="docs-sidebar-icon-close" className="w-4 h-4 hidden" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Topics</span>
          </button>
          <nav className="docs-mobile-links" aria-label="Documentation quick navigation">
            {docOrder.map((page) => (
              <Link prefetch={false} key={page.id} href={page.href} aria-current={current === page.id ? 'page' : undefined}>
                {page.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="docs-grid pt-6 pb-6 md:pt-10 min-h-[calc(100vh-4rem)]">
          {/* Sidebar */}
          <aside
            id="docs-sidebar"
            tabIndex={-1}
            className="fixed md:relative inset-y-0 left-0 z-40 w-72 md:w-full shrink-0 bg-[#0D100F] md:bg-transparent border-r border-[rgba(226,240,233,0.09)] transform -translate-x-full md:translate-x-0 invisible md:visible pointer-events-none md:pointer-events-auto transition-transform duration-300 ease-in-out overflow-y-auto md:overflow-visible"
          >
            <div className="sticky top-0 md:top-24 pt-16 md:pt-0 pb-8 px-5 md:px-0 md:pr-4">
              {/* Mobile sidebar header */}
              <div className="md:hidden flex items-center justify-between mb-6 pb-3 border-b border-[rgba(226,240,233,0.09)]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#3DF69B]"></span>
                  <span className="text-sm font-bold text-[#F4F6F5]">Documentation</span>
                </div>
                <button
                  id="docs-sidebar-close"
                  type="button"
                  aria-label="Close docs menu"
                  className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-[#8E9E96] hover:text-[#F4F6F5] hover:bg-white/[0.05] active:scale-95 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {sections.map((section) => (
                <div key={section.label} className="mb-6">
                  <p className="mb-2 px-3 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8E9E96]">{section.label}</p>
                  <ul className="space-y-1">
                    {section.links.map((link) => {
                      const className = `flex items-center justify-between px-3 py-2 min-h-[40px] rounded-lg text-sm transition-colors duration-150 ${
                        current === link.id
                          ? 'text-[#3DF69B] bg-[#18B669]/10 border border-transparent font-semibold'
                          : 'text-[#8E9E96] border border-transparent hover:text-[#F4F6F5] hover:bg-white/[0.04]'
                      }`;
                      return (
                        <li key={link.id}>
                          {link.external ? (
                            <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`${link.label} (opens in new tab)`} className={className}>
                              <span>{link.label}</span>
                              <Icon name="external" size={14} className="w-3.5 h-3.5 opacity-50" />
                            </a>
                          ) : (
                            <Link prefetch={false} href={link.href} aria-current={current === link.id ? 'page' : undefined} className={className}>
                              <span>{link.label}</span>
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <main id="main-content" className="min-w-0 w-full docs-content py-2" data-focus-sections={focusSections ? 'true' : undefined}>
            {sectionPicker && (
              <details className="docs-section-picker xl:hidden">
                <summary>
                  <span className="docs-section-picker__label">On this page</span>
                  <span className="docs-section-picker__current" data-section-current></span>
                </summary>
                <nav aria-label="On this page">
                  {sectionPicker.map((item) => (
                    <a key={item.id} href={`#${item.id}`}>
                      {item.label}
                    </a>
                  ))}
                </nav>
              </details>
            )}
            {children}
            {(previous || next) && (
              <nav className="docs-pagination" aria-label="Documentation pages">
                {previous && (
                  <Link href={previous.href} rel="prev">
                    <span>← Previous</span>
                    <strong>{previous.label}</strong>
                  </Link>
                )}
                {next && (
                  <Link href={next.href} rel="next">
                    <span>Next →</span>
                    <strong>{next.label}</strong>
                  </Link>
                )}
              </nav>
            )}
          </main>

          {/* On This Page (Table of Contents) */}
          <aside className="docs-toc hidden xl:block pl-5 border-l border-[rgba(226,240,233,0.08)]">
            <div className="sticky top-24 pt-2">
              <h4 className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8E9E96] mb-3">On this page</h4>
              <nav className="space-y-1" aria-label="On this page" data-generated={toc?.length ? undefined : 'true'}>
                {toc?.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block py-2 pl-3 border-l border-[rgba(226,240,233,0.12)] text-sm text-[#AABBB0] hover:text-[#3DF69B] hover:border-[#3DF69B] transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              {current === 'memory' && (
                <div className="mt-8 p-3.5 rounded-xl bg-[#102018] border border-[#23402d]">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[#3DF69B]">QUICK TIP</span>
                  <p className="text-xs text-[#aac7b5] mt-1.5 leading-relaxed">
                    State is encrypted per project branch at <code>~/.egc</code>.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      <Footer />
      <DocsBehavior />
    </div>
  );
}
