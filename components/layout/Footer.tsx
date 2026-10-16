import Link from 'next/link';
import { CloverMark, Icon } from '@/components/brand/icons';
import { withBase } from '@/lib/base';
import type { Lang } from '@/lib/lang';
import { localePath, siteText } from '@/lib/site-i18n';

const linkClass = 'inline-flex items-center min-h-[36px] py-1 text-sm text-[#8E9E96] hover:text-[#3DF69B] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3DF69B] rounded-sm';
const headingClass = 'font-mono text-xs font-semibold uppercase tracking-wider text-[#3DF69B] mb-4';

// Accessible names of the security links, per language (the visible labels are product names).
const SECURITY_NAMES: Record<Lang, string[]> = {
  en: ['OpenSSF Scorecard', 'OpenSSF Best Practices', 'SonarCloud quality gate', 'CodeQL analysis', 'Dependency Review workflow', 'Security Advisories'],
  pt: ['OpenSSF Scorecard', 'OpenSSF Best Practices', 'Quality gate do SonarCloud', 'Análise do CodeQL', 'Workflow de Dependency Review', 'Security Advisories'],
};

/** Internal links go to the page in `lang` when it exists, the English one otherwise. */
export default function Footer({ lang = 'en' }: { lang?: Lang }) {
  const t = siteText(lang).footer;
  const newTab = siteText(lang).nav.newTab;

  const docsLinks = [
    { href: '/get-started/', label: t.getStarted },
    { href: '/features/', label: t.features },
    { href: '/docs/memory/', label: t.memory },
    { href: '/docs/guardian/', label: 'Guardian' },
    { href: '/docs/mcp/', label: t.mcp },
    { href: '/docs/architecture/', label: t.architecture },
    { href: '/integrations/', label: t.integrations },
  ];

  const projectLinks = [
    { href: 'https://github.com/Fmarzochi/EGC', label: 'GitHub', ariaLabel: `GitHub ${newTab}`, external: true },
    { href: 'https://discord.gg/FmXbgUmdmM', label: 'Discord', ariaLabel: `Discord ${newTab}`, external: true },
    { href: 'https://huggingface.co/spaces/fmarzochi/EGC', label: 'Hugging Face', ariaLabel: `${t.hfLabel} ${newTab}`, external: true },
    { href: 'https://github.com/Fmarzochi/EGC/releases', label: 'Releases', ariaLabel: `Releases ${newTab}`, external: true },
    { href: 'https://github.com/Fmarzochi/EGC/issues', label: 'Issues', ariaLabel: `Issues ${newTab}`, external: true },
    { href: 'https://github.com/Fmarzochi/EGC/blob/main/.github/CONTRIBUTING.md', label: t.contributing, ariaLabel: `${t.contributing} ${newTab}`, external: true },
    { href: 'https://github.com/Fmarzochi/EGC/blob/main/docs/VISION.md', label: t.vision, ariaLabel: `${t.vision} ${newTab}`, external: true },
    { href: 'https://github.com/Fmarzochi/EGC/blob/main/.github/SECURITY.md', label: t.securityPolicy, ariaLabel: `${t.securityPolicyLabel} ${newTab}`, external: true },
    { href: withBase('rss.xml'), label: t.rss, ariaLabel: t.rssLabel, external: false },
  ];

  const securityLinks = [
    { href: 'https://securityscorecards.dev/viewer/?uri=github.com/Fmarzochi/EGC', label: 'OpenSSF Scorecard' },
    { href: 'https://www.bestpractices.dev/projects/13099', label: 'OpenSSF Best Practices' },
    { href: 'https://sonarcloud.io/project/overview?id=Fmarzochi_EGC', label: 'SonarCloud' },
    { href: 'https://github.com/Fmarzochi/EGC/actions/workflows/codeql.yml', label: 'CodeQL' },
    { href: 'https://github.com/Fmarzochi/EGC/actions/workflows/dependency-review.yml', label: 'Dependency Review' },
    { href: 'https://github.com/Fmarzochi/EGC/security', label: 'Security Advisories' },
  ].map((link, i) => ({ ...link, ariaLabel: `${SECURITY_NAMES[lang][i]} ${newTab}` }));

  return (
    <footer className="border-t border-[rgba(226,240,233,0.09)] bg-[#0A0D0C] mt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-12">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link prefetch={false} href={localePath(lang, '/')} className="inline-flex items-center gap-2.5 mb-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3DF69B] rounded-md">
              <CloverMark id="m-ft" size={24} />
              <span className="font-bold text-base tracking-tight text-[#F4F6F5]">EGC</span>
            </Link>
            <p className="text-xs text-[#8E9E96] leading-relaxed max-w-xs mb-4">
              Extended Global Context.
              <br />
              {t.tagline}
            </p>
            <div className="flex items-center gap-3">
              <a href="https://github.com/Fmarzochi/EGC" target="_blank" rel="noopener noreferrer" aria-label={t.githubRepo} className="inline-flex p-1.5 -m-1.5 text-[#8E9E96] hover:text-[#3DF69B] transition-colors">
                <Icon name="github" size={18} />
              </a>
              <a href="https://discord.gg/FmXbgUmdmM" target="_blank" rel="noopener noreferrer" aria-label={t.discordServer} className="inline-flex p-1.5 -m-1.5 text-[#8E9E96] hover:text-[#3DF69B] transition-colors">
                <Icon name="discord" size={18} />
              </a>
            </div>
          </div>

          {/* Docs column */}
          <div>
            <h3 className={headingClass}>{t.docs}</h3>
            <ul className="space-y-1">
              {docsLinks.map((link) => (
                <li key={link.href}>
                  <Link prefetch={false} href={localePath(lang, link.href)} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Project column */}
          <div>
            <h3 className={headingClass}>{t.project}</h3>
            <ul className="space-y-1">
              {projectLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    aria-label={link.ariaLabel}
                    className={linkClass}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Security column */}
          <div>
            <h3 className={headingClass}>{t.security}</h3>
            <ul className="space-y-1">
              {securityLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.ariaLabel} className={linkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom sub-footer bar */}
        <div className="pt-8 border-t border-[rgba(226,240,233,0.09)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8E9E96]">
          <div>&copy; {new Date().getFullYear()} {t.license}</div>
          <div className="flex items-center gap-6">
            <Link prefetch={false} href={localePath(lang, '/privacy/')} className="inline-flex py-1 -my-1 text-[#8E9E96] hover:text-[#3DF69B] transition-colors">
              {t.privacy}
            </Link>
            <span>•</span>
            <a href="https://github.com/Fmarzochi/EGC" target="_blank" rel="noopener noreferrer" className="inline-flex py-1 -my-1 text-[#8E9E96] hover:text-[#3DF69B] transition-colors">
              {t.openSource}
            </a>
            <span>•</span>
            <span>Local-first</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
