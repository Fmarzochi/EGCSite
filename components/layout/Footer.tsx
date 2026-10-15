import Link from 'next/link';
import { CloverMark, Icon } from '@/components/brand/icons';
import { withBase } from '@/lib/base';

const docsLinks = [
  { href: '/get-started/', label: 'Get Started' },
  { href: '/features/', label: 'Features' },
  { href: '/docs/memory/', label: 'Memory' },
  { href: '/docs/guardian/', label: 'Guardian' },
  { href: '/docs/mcp/', label: 'MCP Servers' },
  { href: '/docs/architecture/', label: 'Architecture' },
  { href: '/integrations/', label: 'Integrations' },
];

const projectLinks = [
  { href: 'https://github.com/Fmarzochi/EGC', label: 'GitHub', ariaLabel: 'GitHub (opens in new tab)', external: true },
  { href: 'https://discord.gg/FmXbgUmdmM', label: 'Discord', ariaLabel: 'Discord (opens in new tab)', external: true },
  { href: 'https://huggingface.co/spaces/fmarzochi/EGC', label: 'Hugging Face', ariaLabel: 'Hugging Face Space (opens in new tab)', external: true },
  { href: 'https://github.com/Fmarzochi/EGC/releases', label: 'Releases', ariaLabel: 'Releases (opens in new tab)', external: true },
  { href: 'https://github.com/Fmarzochi/EGC/issues', label: 'Issues', ariaLabel: 'Issues (opens in new tab)', external: true },
  { href: 'https://github.com/Fmarzochi/EGC/blob/main/.github/CONTRIBUTING.md', label: 'Contributing', ariaLabel: 'Contributing (opens in new tab)', external: true },
  { href: 'https://github.com/Fmarzochi/EGC/blob/main/docs/VISION.md', label: 'Vision', ariaLabel: 'Vision (opens in new tab)', external: true },
  { href: 'https://github.com/Fmarzochi/EGC/blob/main/.github/SECURITY.md', label: 'Security', ariaLabel: 'Security policy (opens in new tab)', external: true },
  { href: withBase('rss.xml'), label: 'RSS Feed', ariaLabel: 'RSS feed for EGC releases', external: false },
];

const securityLinks = [
  { href: 'https://securityscorecards.dev/viewer/?uri=github.com/Fmarzochi/EGC', label: 'OpenSSF Scorecard', ariaLabel: 'OpenSSF Scorecard (opens in new tab)' },
  { href: 'https://www.bestpractices.dev/projects/13099', label: 'OpenSSF Best Practices', ariaLabel: 'OpenSSF Best Practices (opens in new tab)' },
  { href: 'https://sonarcloud.io/project/overview?id=Fmarzochi_EGC', label: 'SonarCloud', ariaLabel: 'SonarCloud quality gate (opens in new tab)' },
  { href: 'https://github.com/Fmarzochi/EGC/actions/workflows/codeql.yml', label: 'CodeQL', ariaLabel: 'CodeQL analysis (opens in new tab)' },
  { href: 'https://github.com/Fmarzochi/EGC/actions/workflows/dependency-review.yml', label: 'Dependency Review', ariaLabel: 'Dependency Review workflow (opens in new tab)' },
  { href: 'https://github.com/Fmarzochi/EGC/security', label: 'Security Advisories', ariaLabel: 'Security Advisories (opens in new tab)' },
];

const linkClass = 'inline-flex items-center min-h-[36px] py-1 text-sm text-[#8E9E96] hover:text-[#3DF69B] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3DF69B] rounded-sm';
const headingClass = 'font-mono text-xs font-semibold uppercase tracking-wider text-[#3DF69B] mb-4';

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(226,240,233,0.09)] bg-[#0A0D0C] mt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-12">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3DF69B] rounded-md">
              <CloverMark id="m-ft" size={24} />
              <span className="font-bold text-base tracking-tight text-[#F4F6F5]">EGC</span>
            </Link>
            <p className="text-xs text-[#8E9E96] leading-relaxed max-w-xs mb-4">
              Extended Global Context.
              <br />
              Your project remembers across sessions, branches and tools.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://github.com/Fmarzochi/EGC" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository" className="inline-flex p-1.5 -m-1.5 text-[#8E9E96] hover:text-[#3DF69B] transition-colors">
                <Icon name="github" size={18} />
              </a>
              <a href="https://discord.gg/FmXbgUmdmM" target="_blank" rel="noopener noreferrer" aria-label="Discord server" className="inline-flex p-1.5 -m-1.5 text-[#8E9E96] hover:text-[#3DF69B] transition-colors">
                <Icon name="discord" size={18} />
              </a>
            </div>
          </div>

          {/* Docs column */}
          <div>
            <h3 className={headingClass}>Documentation</h3>
            <ul className="space-y-1">
              {docsLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Project column */}
          <div>
            <h3 className={headingClass}>Project</h3>
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
            <h3 className={headingClass}>Security</h3>
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
          <div>&copy; {new Date().getFullYear()} EGC Contributors. Apache 2.0 Licensed.</div>
          <div className="flex items-center gap-6">
            <Link href="/privacy/" className="inline-flex py-1 -my-1 text-[#8E9E96] hover:text-[#3DF69B] transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <a href="https://github.com/Fmarzochi/EGC" target="_blank" rel="noopener noreferrer" className="inline-flex py-1 -my-1 text-[#8E9E96] hover:text-[#3DF69B] transition-colors">
              Open Source
            </a>
            <span>•</span>
            <span>Local-first</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
