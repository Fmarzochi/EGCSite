import { integrations } from '@/data/integrations';
import type { Lang } from '@/lib/lang';
import { siteText } from '@/lib/site-i18n';

// The docs navigation as data, in the sidebar order. DocsShell reads everything from here: the
// sidebar (groups that open and close, plus top-level links), the mobile quick strip, the
// previous/next pagination and the href of the current page.

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

export interface DocsNavLink {
  id: string;
  /** Site path ('/docs/cli/') for pages, full URL for external links. */
  href: string;
  label: string;
  external?: boolean;
  /** Name in the pagination and the mobile strip, when the sidebar label leans on its group. */
  pageLabel?: string;
  /** A quiet number after the label, with the words a screen reader says instead. */
  count?: { value: number; spoken: string };
  /** Left out of the reading order (pagination and mobile strip). */
  unordered?: boolean;
}

export type DocsNavEntry =
  | { kind: 'group'; label: string; links: DocsNavLink[] }
  | { kind: 'link'; link: DocsNavLink };

export interface DocsPage {
  id: string;
  href: string;
  label: string;
}

export function docsNav(lang: Lang) {
  const t = siteText(lang).docs;
  const entries: DocsNavEntry[] = [
    {
      kind: 'group',
      label: t.gettingStarted,
      links: [
        { id: 'get-started', href: '/get-started/', label: t.installation },
        { id: 'features', href: '/features/', label: t.features },
      ],
    },
    {
      kind: 'group',
      label: t.mcpServers,
      links: [
        { id: 'memory', href: '/docs/memory/', label: 'egc-memory' },
        { id: 'guardian', href: '/docs/guardian/', label: 'egc-guardian' },
        { id: 'mcp', href: '/docs/mcp/', label: t.overview, pageLabel: t.mcpServers },
      ],
    },
    {
      kind: 'link',
      link: {
        id: 'integrations',
        href: '/integrations/',
        label: t.integrations,
        count: { value: integrations.length, spoken: t.allTools(integrations.length) },
      },
    },
    {
      kind: 'group',
      label: t.reference,
      links: [
        { id: 'architecture', href: '/docs/architecture/', label: t.architecture },
        { id: 'security', href: '/docs/security/', label: t.security },
        { id: 'cli', href: '/docs/cli/', label: t.cli },
        { id: 'faq', href: '/docs/faq/', label: t.faq },
        { id: 'vision', href: 'https://github.com/Fmarzochi/EGC/blob/main/docs/VISION.md', label: t.vision, external: true },
      ],
    },
    {
      kind: 'group',
      label: t.community,
      links: [
        { id: 'discord', href: 'https://discord.gg/FmXbgUmdmM', label: 'Discord', external: true },
        {
          id: 'contributing',
          href: 'https://github.com/Fmarzochi/EGC/blob/main/.github/CONTRIBUTING.md',
          label: t.contributing,
          external: true,
        },
        { id: 'releases', href: 'https://github.com/Fmarzochi/EGC/releases', label: t.releases, external: true },
      ],
    },
    { kind: 'link', link: { id: 'privacy', href: '/privacy/', label: t.privacy, unordered: true } },
  ];

  const links = entries.flatMap((entry) => (entry.kind === 'group' ? entry.links : [entry.link]));
  /** Every page of the site in the navigation, in order. */
  const pages: DocsPage[] = links
    .filter((link) => !link.external)
    .map((link) => ({ id: link.id, href: link.href, label: link.pageLabel ?? link.label }));
  /** The reading order: the pagination and the mobile strip follow it. */
  const docOrder = pages.filter((page) => !links.find((link) => link.id === page.id)?.unordered);

  return { entries, pages, docOrder };
}
