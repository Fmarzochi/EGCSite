import Link from 'next/link';
import { CloverMark, Icon } from '@/components/brand/icons';
import NavbarBehavior from '@/components/layout/NavbarBehavior';
import type { Lang } from '@/lib/lang';
import { localePath, siteText } from '@/lib/site-i18n';

const GITHUB = 'https://github.com/Fmarzochi/EGC';

const arrow = (
  <span className="w-7 h-7 rounded-full bg-[#18B669] inline-flex items-center justify-center shrink-0">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6"></path>
    </svg>
  </span>
);

/**
 * `current` is the route of the page being shown, without the language prefix ('/features/');
 * its link gets aria-current="page". Internal links go to the page in `lang` when it exists.
 */
export default function Navbar({ current, lang = 'en' }: { current?: string; lang?: Lang }) {
  const t = siteText(lang).nav;
  const navLinks = [
    { href: '/', label: t.home },
    { href: '/features/', label: t.features },
    { href: '/integrations/', label: t.integrations },
    { href: '/docs/memory/', label: t.docs },
    { href: '/contributors/', label: t.hof },
    { href: GITHUB, label: 'GitHub', external: true },
  ];
  const getStarted = localePath(lang, '/get-started/');

  return (
    <>
      <header id="site-header" className="sticky top-0 z-50 w-full border-b border-[rgba(226,240,233,0.09)] bg-[#0A0D0C]/90 backdrop-blur-md transition-transform duration-300 transform translate-y-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo + brand */}
            <div className="flex items-center gap-3 shrink-0">
              <Link prefetch={false} href={localePath(lang, '/')} className="flex items-center gap-2.5 min-h-[44px] group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3DF69B] rounded-md">
                <CloverMark id="m-nav" size={28} />
                <span className="font-extrabold text-xl tracking-tight text-[#F4F6F5] whitespace-nowrap">EGC</span>
              </Link>
            </div>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-2" aria-label={t.main}>
              {navLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${link.label} ${t.newTab}`}
                    className="px-3.5 py-1.5 rounded-full text-sm font-medium text-[#8E9E96] hover:text-[#3DF69B] hover:bg-white/[0.04] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3DF69B]"
                  >
                    {link.label}
                    <Icon name="external" size={12} className="inline-block ml-1 opacity-60" />
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={localePath(lang, link.href)}
                    aria-current={current === link.href ? 'page' : undefined}
                    className="px-3.5 py-1.5 rounded-full text-sm font-medium text-[#8E9E96] hover:text-[#3DF69B] hover:bg-white/[0.04] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3DF69B]"
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </nav>

            {/* Right side: CTA button + mobile hamburger */}
            <div className="flex items-center gap-3">
              <a
                href="https://discord.gg/FmXbgUmdmM"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Discord ${t.newTab}`}
                className="hidden lg:inline-flex items-center justify-center w-8 h-8 rounded-full border border-white/[0.08] bg-white/[0.02] text-[#8E9E96] hover:text-[#F4F6F5] hover:border-white/20 hover:bg-white/[0.06] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3DF69B]"
              >
                <Icon name="discord" size={15} />
              </a>

              <Link
                href={getStarted}
                className="hidden sm:inline-flex items-center gap-2.5 min-h-[40px] pl-4 pr-1 rounded-full bg-[#FFFFFF] hover:bg-[#F4F6F5] text-[#06210F] font-bold text-xs transition-transform active:scale-[0.98] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3DF69B]"
              >
                <span>{t.getEgc}</span>
                {arrow}
              </Link>

              <button
                id="mobile-menu-btn"
                type="button"
                aria-label={t.openMenu}
                aria-expanded="false"
                aria-controls="mobile-menu"
                className="lg:hidden p-2.5 min-w-[44px] min-h-[44px] flex flex-col items-center justify-center gap-[5px] rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3DF69B] active:scale-95 transition-all duration-150"
              >
                <span className="block w-6 h-[2px] bg-[#F4F6F5] rounded-full transition-all duration-300 origin-center line-1"></span>
                <span className="block w-6 h-[2px] bg-[#F4F6F5] rounded-full transition-all duration-300 line-2"></span>
                <span className="block w-6 h-[2px] bg-[#F4F6F5] rounded-full transition-all duration-300 origin-center line-3"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Backdrop overlay */}
      <div
        id="mobile-backdrop"
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[-1] opacity-0 pointer-events-none invisible transition-opacity duration-300 lg:hidden"
        aria-hidden="true"
      ></div>

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label={t.site}
        tabIndex={-1}
        aria-hidden="true"
        inert
        className="lg:hidden fixed inset-0 top-[64px] border-t border-[rgba(226,240,233,0.09)] bg-[#0A0D0C] overflow-y-auto transition-[opacity,transform] duration-300 ease-in-out opacity-0 pointer-events-none invisible z-40"
      >
        <nav className="flex flex-col gap-2 px-6 py-8" aria-label={t.mobile}>
          {navLinks.map((link, i) => {
            const className = `mobile-nav-link flex items-center justify-between min-h-[48px] px-4 py-3 rounded-lg text-base font-medium text-[#F4F6F5] hover:text-[#3DF69B] hover:bg-white/[0.04] active:scale-[0.98] transition-[color,background-color,transform] duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3DF69B] mobile-nav-link-${i}`;
            return link.external ? (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`${link.label} ${t.newTab}`} className={className}>
                <span>{link.label}</span>
                <Icon name="external" size={16} className="opacity-50" />
              </a>
            ) : (
              <Link prefetch={false} key={link.href} href={localePath(lang, link.href)} aria-current={current === link.href ? 'page' : undefined} className={className}>
                <span>{link.label}</span>
              </Link>
            );
          })}

          {/* Get EGC CTA in mobile menu */}
          <div className="mt-6 pt-6 border-t border-[rgba(226,240,233,0.09)] flex flex-col gap-3">
            <Link
              href={getStarted}
              className="mobile-nav-link flex items-center justify-between min-h-[48px] px-6 py-2.5 rounded-full bg-[#FFFFFF] text-[#06210F] text-sm font-bold active:scale-[0.98] transition-[color,background-color,transform] duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3DF69B]"
            >
              <span>{t.getEgc}</span>
              {arrow}
            </Link>

            <a
              href={GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.star}
              className="mobile-nav-link flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-full border border-white/20 bg-white/[0.04] text-[#F4F6F5] text-sm font-semibold hover:bg-white/10 active:scale-[0.98] transition-[color,background-color,transform] duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3DF69B]"
            >
              <Icon name="github" size={16} />
              GitHub
            </a>
          </div>
        </nav>
      </div>

      <NavbarBehavior />
    </>
  );
}
