import Link from 'next/link';
import DocsShell from '@/components/docs/DocsShell';
import { integrations, SUPPORT_LEVEL_LABEL } from '@/data/integrations';
import { withBase } from '@/lib/base';
import { docsMetadata } from '@/lib/seo';

// Ported from src/pages/integrations/index.astro.

export const metadata = docsMetadata({
  title: 'Integrations: EGC in 28 AI coding tools',
  description:
    'One shared memory across Claude Code, Cursor, Codex, OpenCode, Antigravity and 23 other AI coding tools. Pick your tool to see what EGC installs, where, and what it guarantees.',
  route: 'integrations/',
});

const core = integrations.filter((entry) => entry.level === 'core');
const community = integrations.filter((entry) => entry.level === 'community');
const groups = [
  {
    label: SUPPORT_LEVEL_LABEL.core,
    entries: core,
    note: 'The maintainer or an area steward runs these daily; a regression caused by a vendor change is fixed before the next release.',
  },
  {
    label: SUPPORT_LEVEL_LABEL.community,
    entries: community,
    note: 'Installed, registered and tested in CI like the core tools; a vendor change that breaks one waits for a report or a pull request.',
  },
];

export default function IntegrationsPage() {
  return (
    <DocsShell current="integrations">
      <div className="pb-2 mb-8 border-b border-gray-200 dark:border-gray-800">
        <p className="text-xs font-semibold uppercase tracking-widest text-egc-600 dark:text-egc-400 mb-2">
          Integrations
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          One brain, {integrations.length} AI coding tools
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Every tool gets the memory protocol and the session bus; the two local MCP servers are
          registered in the ten tools EGC writes MCP config for today. Pick yours to see what EGC
          installs, where it goes, and how native hooks decide what Guardian and the Token Crusher
          can do inside it.
        </p>
      </div>

      {groups.map((group) => (
        <section key={group.label} className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{group.label}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{group.note}</p>
          <div className="integrations-list">
            {group.entries.map((entry) => (
              <Link
                key={entry.slug}
                href={`/integrations/${entry.slug}/`}
                className="flex items-center gap-3 px-2 py-3 transition-colors"
              >
                <div className="w-9 h-9 rounded-md bg-white flex items-center justify-center shrink-0">
                  <img
                    src={withBase(`tools/${entry.icon}`)}
                    alt=""
                    aria-hidden="true"
                    className="w-6 h-6 object-contain"
                    loading="lazy"
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-tight">
                  {entry.name}
                  <span className="sr-only">, {group.label}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <p className="text-xs text-gray-500 dark:text-gray-400">
        Support levels are defined in{' '}
        <a
          href="https://github.com/Fmarzochi/EGC/blob/main/docs/governance/support-levels.md"
          className="underline hover:text-egc-600 dark:hover:text-egc-400"
        >
          the governance docs
        </a>
        ; the integration mechanics per tool are in the{' '}
        <a
          href="https://github.com/Fmarzochi/EGC/blob/main/docs/spec/integration-tiers.md"
          className="underline hover:text-egc-600 dark:hover:text-egc-400"
        >
          integration tiers spec
        </a>
        .
      </p>
    </DocsShell>
  );
}
