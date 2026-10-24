import type { CSSProperties } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/brand/icons';
import DemoVideo from '@/components/home/DemoVideo';
import HomeBehavior from '@/components/home/HomeBehavior';
import { integrations } from '@/data/integrations';
import { withBase } from '@/lib/base';
import { homeDictionary, homeTranslator } from '@/lib/home-i18n';
import { localePath } from '@/lib/site-i18n';
import type { Lang } from '@/lib/lang';

// Links to the other root layouts (inner pages, here) always reload the page, so none of them
// prefetch: the payload could never be used.
// The home, ported from src/pages/index.astro (header, sections 01 to 08, closing and footer).
// The markup is the Astro source converted mechanically; every data-i18n text and
// data-i18n-attr value is filled from the dictionary of the page language.

const featuredSlugs = [
  'claude-code',
  'cursor',
  'codex-cli',
  'antigravity',
  'opencode',
  'vs-code-copilot',
  'windsurf',
  'zed',
];
const featuredIntegrations = featuredSlugs.map((slug) => {
  const entry = integrations.find((item) => item.slug === slug);
  if (!entry)
    throw new Error(`Featured integration "${slug}" is missing from data/integrations.ts`);
  return entry;
});

// Texts the behaviour script swaps in after load: copy feedback, menu label, feature name.
const RUNTIME_KEYS = /^(ui\.|a\.menu|f\d\.name$)/;

// The home menu lists the same pages, in the same order, as the Navbar of the inner pages,
// so the menu reads the same everywhere; only the labels follow the page language.
const NAV_PAGES = [
  { href: '/', key: 'nav.home' },
  { href: '/features/', key: 'nav.features' },
  { href: '/integrations/', key: 'nav.integrations' },
  { href: '/docs/memory/', key: 'nav.docs' },
  { href: '/contributors/', key: 'ft.hof' },
];
const GITHUB = 'https://github.com/Fmarzochi/EGC';
const DISCORD = 'https://discord.gg/FmXbgUmdmM';

export default function HomePage({ lang }: { lang: Lang }) {
  const tx = homeTranslator(lang);
  const homeHref = withBase(lang === 'pt' ? 'pt/' : '');
  const runtimeTexts = Object.fromEntries(
    Object.entries(homeDictionary(lang)).filter(([key]) => RUNTIME_KEYS.test(key)),
  );
  return (
    <>
      <a className="skip-link" href="#conteudo" data-i18n="a.skip">
        {tx('a.skip')}
      </a>

      {/* ============================ HEADER ============================ */}
      <header className="hdr" data-scrolled="false">
        <div className="wrap hdr__bar">
          <a
            className="brand"
            href="#topo"
            data-i18n-attr="aria-label:a.home"
            aria-label={tx('a.home')}
          >
            <svg className="egc-mark" viewBox="0 0 480 480" aria-hidden="true" focusable="false">
              <defs>
                <linearGradient id="m-hdr-p" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#B4F8D6" />
                  <stop offset=".46" stopColor="#4FF3A3" />
                  <stop offset="1" stopColor="#17A862" />
                </linearGradient>
                <filter id="m-hdr-e" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow
                    dx="0"
                    dy="0"
                    stdDeviation="7"
                    flood-color="#04361F"
                    flood-opacity=".42"
                  />
                </filter>
                <clipPath id="m-hdr-q">
                  <rect x="0" y="0" width="240" height="240" />
                </clipPath>
              </defs>
              <g className="egc-mark__body" filter="url(#m-hdr-e)">
                <g className="egc-mark__petal egc-mark__petal--1">
                  <circle cx="240" cy="130" r="100" fill="url(#m-hdr-p)" />
                </g>
                <g className="egc-mark__petal egc-mark__petal--2">
                  <circle cx="350" cy="240" r="100" fill="url(#m-hdr-p)" />
                </g>
                <g className="egc-mark__petal egc-mark__petal--3">
                  <circle cx="240" cy="350" r="100" fill="url(#m-hdr-p)" />
                </g>
                <g className="egc-mark__petal egc-mark__petal--4">
                  <circle cx="130" cy="240" r="100" fill="url(#m-hdr-p)" />
                </g>
                <g clipPath="url(#m-hdr-q)">
                  <g className="egc-mark__petal egc-mark__petal--1">
                    <circle cx="240" cy="130" r="100" fill="url(#m-hdr-p)" />
                  </g>
                </g>
              </g>
              <circle className="egc-mark__core" cx="240" cy="240" r="29" fill="#05231A" />
            </svg>
            <span>EGC</span>
          </a>
          <nav className="nav" data-i18n-attr="aria-label:a.navMain" aria-label={tx('a.navMain')}>
            {NAV_PAGES.map((item) =>
              item.href === '/' ? (
                <a key={item.key} href={homeHref} aria-current="page" data-i18n={item.key}>
                  {tx(item.key)}
                </a>
              ) : (
                <Link
                  key={item.key}
                  prefetch={false}
                  href={localePath(lang, item.href)}
                  data-i18n={item.key}
                >
                  {tx(item.key)}
                </Link>
              ),
            )}
            <a
              href={GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              data-i18n-attr="aria-label:a.gh"
              aria-label={tx('a.gh')}
            >
              GitHub
            </a>
          </nav>
          <div className="hdr__actions">
            <a
              className="hdr__gh"
              href={DISCORD}
              target="_blank"
              rel="noopener noreferrer"
              data-i18n-attr="aria-label:a.discord"
              aria-label={tx('a.discord')}
            >
              <Icon name="discord" size={20} />
            </a>{' '}
            <a className="btn btn--sm hdr__cta" href="#instalar">
              <span data-i18n="nav.cta">{tx('nav.cta')}</span>
              <span className="btn__icon" aria-hidden="true">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </a>{' '}
            <button
              className="burger"
              type="button"
              aria-expanded="false"
              aria-controls="mnav"
              data-i18n-attr="aria-label:a.menuOpen"
              aria-label={tx('a.menuOpen')}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>
      <div className="mnav" id="mnav" data-open="false" hidden>
        <nav data-i18n-attr="aria-label:a.navMobile" aria-label={tx('a.navMobile')}>
          <ul>
            {NAV_PAGES.map((item, index) => {
              const label = (
                <>
                  <b data-i18n={item.key}>{tx(item.key)}</b>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </>
              );
              return (
                <li key={item.key}>
                  {item.href === '/' ? (
                    <a href={homeHref} aria-current="page">
                      {label}
                    </a>
                  ) : (
                    <Link prefetch={false} href={localePath(lang, item.href)}>
                      {label}
                    </Link>
                  )}
                </li>
              );
            })}
            <li>
              <a href={GITHUB} target="_blank" rel="noopener noreferrer">
                <b>GitHub</b>
                <span>↗</span>
              </a>
            </li>
          </ul>
        </nav>
        <a className="btn" href="#instalar">
          <span data-i18n="hero.ctaInstall">{tx('hero.ctaInstall')}</span>
          <span className="btn__icon" aria-hidden="true">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </a>
      </div>

      <main id="conteudo">
        {/* ============================ HERO ============================ */}
        <section className="hero grain" id="topo" aria-labelledby="hero-title" data-hero="">
          <div className="hero__glow" aria-hidden="true" />
          <div className="wrap hero__main" data-hero-main="">
            <p className="eyebrow hero__eyebrow i-eyebrow">
              <span data-i18n="hero.eyebrow">{tx('hero.eyebrow')}</span> <b>&gt; egc restore ✓</b>
            </p>

            <div className="hero__stage" aria-hidden="true">
              <div className="hero__stage-inner">
                <svg className="hero__orbits" viewBox="0 0 600 600">
                  <circle cx="300" cy="300" r="246" style={{ '--len': '1546' } as CSSProperties} />
                  <g className="o-spin">
                    <circle
                      className="o-dash"
                      cx="300"
                      cy="300"
                      r="296"
                      style={{ '--len': '1860' } as CSSProperties}
                    />
                  </g>
                </svg>
                <div className="hero__mark">
                  <svg
                    className="egc-mark"
                    viewBox="0 0 480 480"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <defs>
                      <linearGradient id="m-hero-p" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#B4F8D6" />
                        <stop offset=".46" stopColor="#4FF3A3" />
                        <stop offset="1" stopColor="#17A862" />
                      </linearGradient>
                      <filter id="m-hero-e" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow
                          dx="0"
                          dy="0"
                          stdDeviation="7"
                          flood-color="#04361F"
                          flood-opacity=".42"
                        />
                      </filter>
                      <clipPath id="m-hero-q">
                        <rect x="0" y="0" width="240" height="240" />
                      </clipPath>
                    </defs>
                    <g className="egc-mark__body" filter="url(#m-hero-e)">
                      <g className="egc-mark__petal egc-mark__petal--1">
                        <circle cx="240" cy="130" r="100" fill="url(#m-hero-p)" />
                      </g>
                      <g className="egc-mark__petal egc-mark__petal--2">
                        <circle cx="350" cy="240" r="100" fill="url(#m-hero-p)" />
                      </g>
                      <g className="egc-mark__petal egc-mark__petal--3">
                        <circle cx="240" cy="350" r="100" fill="url(#m-hero-p)" />
                      </g>
                      <g className="egc-mark__petal egc-mark__petal--4">
                        <circle cx="130" cy="240" r="100" fill="url(#m-hero-p)" />
                      </g>
                      <g clipPath="url(#m-hero-q)">
                        <g className="egc-mark__petal egc-mark__petal--1">
                          <circle cx="240" cy="130" r="100" fill="url(#m-hero-p)" />
                        </g>
                      </g>
                    </g>
                    <circle className="egc-mark__core" cx="240" cy="240" r="29" fill="#05231A" />
                  </svg>
                </div>
                <p className="hero__cap">
                  <b>◦</b> <span data-i18n="hero.markCap">{tx('hero.markCap')}</span>
                </p>
              </div>
            </div>

            <h1 className="hero__title" id="hero-title">
              <span className="hero__l1 i-l1" data-i18n="hero.l1" data-l1="">
                {tx('hero.l1')}
              </span>{' '}
              <span
                className="hero__l2 i-l2"
                data-i18n="hero.l2"
                dangerouslySetInnerHTML={{ __html: tx('hero.l2') }}
              />
            </h1>

            <div className="hero__foot i-ui">
              <p
                className="hero__copy"
                data-i18n="hero.copy"
                dangerouslySetInnerHTML={{ __html: tx('hero.copy') }}
              />
              <div className="hero__actions">
                <a className="btn" href="#instalar">
                  <span data-i18n="hero.ctaInstall">{tx('hero.ctaInstall')}</span>
                  <span className="btn__icon" aria-hidden="true">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </a>{' '}
                <a className="btn btn--ghost" href="#demo">
                  <span data-i18n="hero.ctaDemo">{tx('hero.ctaDemo')}</span>
                  <span className="btn__icon" aria-hidden="true">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 5v14M6 13l6 6 6-6" />
                    </svg>
                  </span>
                </a>
              </div>
              <div className="hero__sub">
                <div className="cmd">
                  <span className="cmd__prompt" aria-hidden="true">
                    $
                  </span>
                  <span className="cmd__text">npm install -g @egchq/egc</span>
                  <button
                    className="copy-btn"
                    type="button"
                    data-copy="npm install -g @egchq/egc && egc install"
                    data-label-key="ui.copy"
                    data-i18n-attr="aria-label:a.copyInstall"
                    aria-label={tx('a.copyInstall')}
                  >
                    <svg
                      className="i-copy"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <rect x="9" y="9" width="12" height="12" rx="2" />
                      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                    </svg>
                    <svg
                      className="i-done"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.6"
                      aria-hidden="true"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span data-copy-label="" data-i18n="ui.copy">
                      {tx('ui.copy')}
                    </span>
                  </button>
                </div>
                <ul
                  className="hero__meta"
                  data-i18n-attr="aria-label:hero.meta"
                  aria-label={tx('hero.meta')}
                >
                  <li>
                    <a
                      href="https://github.com/Fmarzochi/EGC/releases"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      v1.1.23
                    </a>
                  </li>
                  <li>Apache-2.0</li>
                  <li data-i18n="hero.m.tools">{tx('hero.m.tools')}</li>
                  <li data-i18n="hero.m.local">{tx('hero.m.local')}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ============================ BENEFIT ============================ */}
        <section className="sec ben" aria-labelledby="ben-title">
          <div className="wrap ben__grid">
            <div>
              <p className="eyebrow rv">
                <b>01</b> <span data-i18n="ben.eyebrow">{tx('ben.eyebrow')}</span>
              </p>
              <h2
                className="h-section rv"
                id="ben-title"
                data-i18n="ben.title"
                dangerouslySetInnerHTML={{ __html: tx('ben.title') }}
              />
              <p className="lede rv" style={{ marginTop: '24px' }} data-i18n="ben.lede">
                {tx('ben.lede')}
              </p>
              <ul
                className="ben__voices rv"
                data-i18n-attr="aria-label:ben.voicesLabel"
                aria-label={tx('ben.voicesLabel')}
              >
                <li>
                  <span data-i18n="ben.you">{tx('ben.you')}</span>
                  <s data-i18n="ben.v1">{tx('ben.v1')}</s>
                </li>
                <li>
                  <span data-i18n="ben.you">{tx('ben.you')}</span>
                  <s data-i18n="ben.v2">{tx('ben.v2')}</s>
                </li>
                <li>
                  <span data-i18n="ben.you">{tx('ben.you')}</span>
                  <s data-i18n="ben.v3">{tx('ben.v3')}</s>
                </li>
              </ul>
            </div>
            <div>
              <figure className="lanes rv" data-lanes="">
                <figcaption className="sr-only" data-i18n="ben.figcap">
                  {tx('ben.figcap')}
                </figcaption>
                <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
                  <defs>
                    <linearGradient id="gradWithout" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="rgba(244,246,245,.16)" />
                      <stop offset="1" stopColor="rgba(244,246,245,0)" />
                    </linearGradient>
                    <linearGradient id="gradWith" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="rgba(61,246,155,.32)" />
                      <stop offset="1" stopColor="rgba(61,246,155,0)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="lanes__cols" aria-hidden="true">
                  <span data-i18n="ben.col0">{tx('ben.col0')}</span>
                  <span data-i18n="ben.col1">{tx('ben.col1')}</span>
                  <span data-i18n="ben.col2">{tx('ben.col2')}</span>
                  <span data-i18n="ben.col3">{tx('ben.col3')}</span>
                </div>
                <div className="lane lane--without" aria-hidden="true">
                  <div className="lane__name">
                    <b data-i18n="ben.without">{tx('ben.without')}</b>
                    <small data-i18n="ben.withoutSub">{tx('ben.withoutSub')}</small>
                  </div>
                  <div className="lane__plot">
                    <svg viewBox="0 0 300 100" preserveAspectRatio="none">
                      <defs>
                        <clipPath id="clipWithout">
                          <rect className="lane-clip" x="0" y="-10" width="300" height="120" />
                        </clipPath>
                      </defs>
                      <line className="gridline" x1="100" y1="0" x2="100" y2="100" />
                      <line className="gridline" x1="200" y1="0" x2="200" y2="100" />
                      <g clipPath="url(#clipWithout)">
                        <path
                          className="area"
                          d="M0 98 Q55 96 97 34 L100 98 Q155 96 197 34 L200 98 Q255 96 297 34 L300 98 L300 100 L0 100 Z"
                        />
                        <path
                          className="path"
                          d="M0 98 Q55 96 97 34 L100 98 Q155 96 197 34 L200 98 Q255 96 297 34 L300 98"
                        />
                      </g>
                    </svg>{' '}
                    <span className="lane__tag" data-i18n="ben.tagReexplain">
                      {tx('ben.tagReexplain')}
                    </span>
                  </div>
                </div>
                <div className="lane lane--with" aria-hidden="true">
                  <div className="lane__name">
                    <b data-i18n="ben.with">{tx('ben.with')}</b>
                    <small data-i18n="ben.withSub">{tx('ben.withSub')}</small>
                  </div>
                  <div className="lane__plot">
                    <svg viewBox="0 0 300 100" preserveAspectRatio="none">
                      <defs>
                        <clipPath id="clipWith">
                          <rect className="lane-clip" x="0" y="-10" width="300" height="120" />
                        </clipPath>
                      </defs>
                      <line className="gridline" x1="100" y1="0" x2="100" y2="100" />
                      <line className="gridline" x1="200" y1="0" x2="200" y2="100" />
                      <g clipPath="url(#clipWith)">
                        <path
                          className="area"
                          d="M0 98 Q55 96 97 44 L103 44 Q155 42 197 24 L203 24 Q255 22 300 8 L300 100 L0 100 Z"
                        />
                        <path
                          className="path"
                          d="M0 98 Q55 96 97 44 L103 44 Q155 42 197 24 L203 24 Q255 22 300 8"
                        />
                      </g>
                    </svg>{' '}
                    <span className="lane__tag">✓ egc restore</span>
                  </div>
                </div>
                <div className="lanes__foot" aria-hidden="true">
                  <span data-i18n="ben.chartNote">{tx('ben.chartNote')}</span>
                  <span
                    className="ok"
                    data-i18n="ben.chartOk"
                    dangerouslySetInnerHTML={{ __html: tx('ben.chartOk') }}
                  />
                </div>
              </figure>
              <div className="compare">
                <div className="compare__col compare__col--without rv">
                  <h3 data-i18n="ben.without">{tx('ben.without')}</h3>
                  <ul>
                    <li data-i18n="ben.w1">{tx('ben.w1')}</li>
                    <li data-i18n="ben.w2">{tx('ben.w2')}</li>
                    <li data-i18n="ben.w3">{tx('ben.w3')}</li>
                  </ul>
                </div>
                <div
                  className="compare__col compare__col--with rv"
                  style={{ '--rd': '.08s' } as CSSProperties}
                >
                  <h3 data-i18n="ben.with">{tx('ben.with')}</h3>
                  <ul>
                    <li data-i18n="ben.c1">{tx('ben.c1')}</li>
                    <li data-i18n="ben.c2">{tx('ben.c2')}</li>
                    <li data-i18n="ben.c3">{tx('ben.c3')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================ DEMO ============================ */}
        <section className="sec demo-sec" id="demo" aria-labelledby="demo-title">
          <div className="wrap">
            <div className="sec__head sec__head--split">
              <div>
                <p className="eyebrow rv">
                  <b>02</b> <span data-i18n="demo.eyebrow">{tx('demo.eyebrow')}</span>
                </p>
                <h2
                  className="h-section rv"
                  id="demo-title"
                  data-i18n="demo.title"
                  dangerouslySetInnerHTML={{ __html: tx('demo.title') }}
                />
              </div>
              <p className="lede rv" data-i18n="demo.lede">
                {tx('demo.lede')}
              </p>
            </div>

            <div className="demo rv" data-demo="">
              <div className="demo__top">
                <p className="demo__badge">
                  <b data-i18n="demo.badge">{tx('demo.badge')}</b>
                  <small data-i18n="demo.badgeNote">{tx('demo.badgeNote')}</small>
                </p>
              </div>
              <div
                className="demo__tabs"
                data-i18n-attr="aria-label:demo.stepsLabel"
                hidden
                aria-label={tx('demo.stepsLabel')}
              >
                <button
                  className="step"
                  id="demo-tab-1"
                  type="button"
                  data-step="1"
                  aria-controls="demo-panel-1"
                >
                  <span className="step__n">01</span>
                  <span className="step__t" data-i18n="demo.s1">
                    {tx('demo.s1')}
                  </span>
                </button>{' '}
                <button
                  className="step"
                  id="demo-tab-2"
                  type="button"
                  data-step="2"
                  aria-controls="demo-panel-2"
                >
                  <span className="step__n">02</span>
                  <span className="step__t" data-i18n="demo.s2">
                    {tx('demo.s2')}
                  </span>
                </button>{' '}
                <button
                  className="step"
                  id="demo-tab-3"
                  type="button"
                  data-step="3"
                  aria-controls="demo-panel-3"
                >
                  <span className="step__n">03</span>
                  <span className="step__t" data-i18n="demo.s3">
                    {tx('demo.s3')}
                  </span>
                </button>{' '}
                <button
                  className="step"
                  id="demo-tab-4"
                  type="button"
                  data-step="4"
                  aria-controls="demo-panel-4"
                >
                  <span className="step__n">04</span>
                  <span className="step__t" data-i18n="demo.s4">
                    {tx('demo.s4')}
                  </span>
                </button>{' '}
                <button
                  className="step"
                  id="demo-tab-5"
                  type="button"
                  data-step="5"
                  aria-controls="demo-panel-5"
                >
                  <span className="step__n">05</span>
                  <span className="step__t" data-i18n="demo.s5">
                    {tx('demo.s5')}
                  </span>
                </button>
              </div>
              <div className="demo__panels">
                <section className="demo__panel" id="demo-panel-1" aria-labelledby="demo-heading-1">
                  <div className="demo__copy">
                    <p className="demo__position">
                      <span data-i18n="demo.liveStep">{tx('demo.liveStep')}</span> 1{' '}
                      <span data-i18n="demo.of">{tx('demo.of')}</span> 5
                    </p>
                    <h3 id="demo-heading-1" data-i18n="demo.s1">
                      {tx('demo.s1')}
                    </h3>
                    <p data-i18n="demo.d1" dangerouslySetInnerHTML={{ __html: tx('demo.d1') }} />
                  </div>
                  <div className="demo__visual" aria-hidden="true">
                    <div className="win">
                      <div className="win__bar">
                        <i />
                        <i />
                        <i />
                        <span data-i18n="demo.winA">{tx('demo.winA')}</span>
                      </div>
                      <div className="win__body">
                        <p className="msg msg--u" data-i18n="demo.uA1">
                          {tx('demo.uA1')}
                        </p>
                        <p className="sys">store_decision ✓</p>
                        <p className="msg msg--ai" data-i18n="demo.aiA1">
                          {tx('demo.aiA1')}
                        </p>
                        <div className="dcard">
                          <small data-i18n="demo.card">{tx('demo.card')}</small>
                          <b data-i18n="demo.cardBody">{tx('demo.cardBody')}</b>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                <section className="demo__panel" id="demo-panel-2" aria-labelledby="demo-heading-2">
                  <div className="demo__copy">
                    <p className="demo__position">
                      <span data-i18n="demo.liveStep">{tx('demo.liveStep')}</span> 2{' '}
                      <span data-i18n="demo.of">{tx('demo.of')}</span> 5
                    </p>
                    <h3 id="demo-heading-2" data-i18n="demo.s2">
                      {tx('demo.s2')}
                    </h3>
                    <p data-i18n="demo.d2" dangerouslySetInnerHTML={{ __html: tx('demo.d2') }} />
                  </div>
                  <div className="demo__visual" aria-hidden="true">
                    <div className="core">
                      <p className="sys--dim" data-i18n="demo.closed">
                        {tx('demo.closed')}
                      </p>{' '}
                      <div className="core__mark">
                        <svg
                          className="egc-mark"
                          viewBox="0 0 480 480"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <defs>
                            <linearGradient id="m-demo-p" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0" stopColor="#B4F8D6" />
                              <stop offset=".46" stopColor="#4FF3A3" />
                              <stop offset="1" stopColor="#17A862" />
                            </linearGradient>
                            <filter id="m-demo-e" x="-20%" y="-20%" width="140%" height="140%">
                              <feDropShadow
                                dx="0"
                                dy="0"
                                stdDeviation="7"
                                flood-color="#04361F"
                                flood-opacity=".42"
                              />
                            </filter>
                            <clipPath id="m-demo-q">
                              <rect x="0" y="0" width="240" height="240" />
                            </clipPath>
                          </defs>
                          <g className="egc-mark__body" filter="url(#m-demo-e)">
                            <g className="egc-mark__petal egc-mark__petal--1">
                              <circle cx="240" cy="130" r="100" fill="url(#m-demo-p)" />
                            </g>
                            <g className="egc-mark__petal egc-mark__petal--2">
                              <circle cx="350" cy="240" r="100" fill="url(#m-demo-p)" />
                            </g>
                            <g className="egc-mark__petal egc-mark__petal--3">
                              <circle cx="240" cy="350" r="100" fill="url(#m-demo-p)" />
                            </g>
                            <g className="egc-mark__petal egc-mark__petal--4">
                              <circle cx="130" cy="240" r="100" fill="url(#m-demo-p)" />
                            </g>
                            <g clipPath="url(#m-demo-q)">
                              <g className="egc-mark__petal egc-mark__petal--1">
                                <circle cx="240" cy="130" r="100" fill="url(#m-demo-p)" />
                              </g>
                            </g>
                          </g>
                          <circle
                            className="egc-mark__core"
                            cx="240"
                            cy="240"
                            r="29"
                            fill="#05231A"
                          />
                        </svg>
                      </div>
                      <p className="core__path">~/.egc</p>
                      <small data-i18n="demo.vaultNote">{tx('demo.vaultNote')}</small>
                      <div className="dcard">
                        <small data-i18n="demo.card">{tx('demo.card')}</small>
                        <b data-i18n="demo.cardBody">{tx('demo.cardBody')}</b>
                      </div>
                      <p className="win__wait" data-i18n="demo.waiting">
                        {tx('demo.waiting')}
                      </p>
                    </div>
                  </div>
                </section>
                <section className="demo__panel" id="demo-panel-3" aria-labelledby="demo-heading-3">
                  <div className="demo__copy">
                    <p className="demo__position">
                      <span data-i18n="demo.liveStep">{tx('demo.liveStep')}</span> 3{' '}
                      <span data-i18n="demo.of">{tx('demo.of')}</span> 5
                    </p>
                    <h3 id="demo-heading-3" data-i18n="demo.s3">
                      {tx('demo.s3')}
                    </h3>
                    <p data-i18n="demo.d3">{tx('demo.d3')}</p>
                  </div>
                  <div className="demo__visual" aria-hidden="true">
                    <div className="win">
                      <div className="win__bar">
                        <i />
                        <i />
                        <i />
                        <span data-i18n="demo.winB">{tx('demo.winB')}</span>
                      </div>
                      <div className="win__body">
                        <p className="msg msg--u" data-i18n="demo.uB1">
                          {tx('demo.uB1')}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
                <section className="demo__panel" id="demo-panel-4" aria-labelledby="demo-heading-4">
                  <div className="demo__copy">
                    <p className="demo__position">
                      <span data-i18n="demo.liveStep">{tx('demo.liveStep')}</span> 4{' '}
                      <span data-i18n="demo.of">{tx('demo.of')}</span> 5
                    </p>
                    <h3 id="demo-heading-4" data-i18n="demo.s4">
                      {tx('demo.s4')}
                    </h3>
                    <p data-i18n="demo.d4">{tx('demo.d4')}</p>
                  </div>
                  <div className="demo__visual" aria-hidden="true">
                    <div className="win">
                      <div className="win__bar">
                        <i />
                        <i />
                        <i />
                        <span data-i18n="demo.winB">{tx('demo.winB')}</span>
                      </div>
                      <div className="win__body">
                        <p className="sys">
                          &gt; egc restore ✓{' '}
                          <span className="sys--dim" data-i18n="demo.restored">
                            {tx('demo.restored')}
                          </span>
                        </p>
                        <div className="dcard">
                          <small data-i18n="demo.card">{tx('demo.card')}</small>
                          <b data-i18n="demo.cardBody">{tx('demo.cardBody')}</b>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                <section className="demo__panel" id="demo-panel-5" aria-labelledby="demo-heading-5">
                  <div className="demo__copy">
                    <p className="demo__position">
                      <span data-i18n="demo.liveStep">{tx('demo.liveStep')}</span> 5{' '}
                      <span data-i18n="demo.of">{tx('demo.of')}</span> 5
                    </p>
                    <h3 id="demo-heading-5" data-i18n="demo.s5">
                      {tx('demo.s5')}
                    </h3>
                    <p data-i18n="demo.d5">{tx('demo.d5')}</p>
                  </div>
                  <div className="demo__visual" aria-hidden="true">
                    <div className="win">
                      <div className="win__bar">
                        <i />
                        <i />
                        <i />
                        <span data-i18n="demo.winB">{tx('demo.winB')}</span>
                      </div>
                      <div className="win__body">
                        <p className="msg msg--ai" data-i18n="demo.aiB1">
                          {tx('demo.aiB1')}
                        </p>
                        <div className="progress">
                          <i />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* The recorded demo plays here; nothing loads from YouTube until play is pressed. */}
            <div className="rv">
              <DemoVideo
                lang={lang}
                texts={{
                  title: tx('demo.videoTitle'),
                  lede: tx('demo.videoLede'),
                  note: tx('demo.videoNote'),
                  play: tx('demo.videoPlay'),
                  frameTitle: tx('demo.videoFrame'),
                }}
              />
            </div>
          </div>
        </section>

        {/* ============================ FEATURES ============================ */}
        <section className="sec fx" id="funcoes" aria-labelledby="fx-title">
          <div className="wrap">
            <div className="sec__head sec__head--split">
              <div>
                <p className="eyebrow rv">
                  <b>03</b> <span data-i18n="fx.eyebrow">{tx('fx.eyebrow')}</span>
                </p>
                <h2
                  className="h-section rv"
                  id="fx-title"
                  data-i18n="fx.title"
                  dangerouslySetInnerHTML={{ __html: tx('fx.title') }}
                />
              </div>
              <p className="lede rv" data-i18n="fx.lede">
                {tx('fx.lede')}
              </p>
            </div>
            <div className="fx__layout">
              <div className="fx__visual" aria-hidden="true">
                <div className="fx__sticky">
                  <div className="fx__markwrap" data-fx-mark="">
                    <span className="fx__ring" />
                    <span className="fx__ring fx__ring--2" />
                    <svg
                      className="egc-mark"
                      viewBox="0 0 480 480"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <defs>
                        <linearGradient id="m-fx-p" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0" stopColor="#B4F8D6" />
                          <stop offset=".46" stopColor="#4FF3A3" />
                          <stop offset="1" stopColor="#17A862" />
                        </linearGradient>
                        <filter id="m-fx-e" x="-20%" y="-20%" width="140%" height="140%">
                          <feDropShadow
                            dx="0"
                            dy="0"
                            stdDeviation="7"
                            flood-color="#04361F"
                            flood-opacity=".42"
                          />
                        </filter>
                        <clipPath id="m-fx-q">
                          <rect x="0" y="0" width="240" height="240" />
                        </clipPath>
                      </defs>
                      <g className="egc-mark__body" filter="url(#m-fx-e)">
                        <g className="egc-mark__petal egc-mark__petal--1">
                          <circle cx="240" cy="130" r="100" fill="url(#m-fx-p)" />
                        </g>
                        <g className="egc-mark__petal egc-mark__petal--2">
                          <circle cx="350" cy="240" r="100" fill="url(#m-fx-p)" />
                        </g>
                        <g className="egc-mark__petal egc-mark__petal--3">
                          <circle cx="240" cy="350" r="100" fill="url(#m-fx-p)" />
                        </g>
                        <g className="egc-mark__petal egc-mark__petal--4">
                          <circle cx="130" cy="240" r="100" fill="url(#m-fx-p)" />
                        </g>
                        <g clipPath="url(#m-fx-q)">
                          <g className="egc-mark__petal egc-mark__petal--1">
                            <circle cx="240" cy="130" r="100" fill="url(#m-fx-p)" />
                          </g>
                        </g>
                      </g>
                      <circle className="egc-mark__core" cx="240" cy="240" r="29" fill="#05231A" />
                    </svg>
                  </div>
                  <p className="fx__counter">
                    <b data-fx-num="">01</b>
                    <span>/ 04</span>
                    <span className="fx__counter-name" data-fx-name="" data-i18n="f1.name">
                      {tx('f1.name')}
                    </span>
                  </p>
                </div>
              </div>
              <div className="fx__list" data-fx-list="">
                <article className="fitem rv" id="memoria" data-f="1" aria-labelledby="f1-t">
                  <div>
                    <p className="fitem__num">
                      <svg
                        className="egc-mark"
                        viewBox="0 0 480 480"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <defs>
                          <linearGradient id="m-f1-p" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0" stopColor="#B4F8D6" />
                            <stop offset=".46" stopColor="#4FF3A3" />
                            <stop offset="1" stopColor="#17A862" />
                          </linearGradient>
                          <filter id="m-f1-e" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow
                              dx="0"
                              dy="0"
                              stdDeviation="7"
                              flood-color="#04361F"
                              flood-opacity=".42"
                            />
                          </filter>
                          <clipPath id="m-f1-q">
                            <rect x="0" y="0" width="240" height="240" />
                          </clipPath>
                        </defs>
                        <g className="egc-mark__body" filter="url(#m-f1-e)">
                          <g className="egc-mark__petal egc-mark__petal--1">
                            <circle cx="240" cy="130" r="100" fill="url(#m-f1-p)" />
                          </g>
                          <g className="egc-mark__petal egc-mark__petal--2">
                            <circle cx="350" cy="240" r="100" fill="url(#m-f1-p)" />
                          </g>
                          <g className="egc-mark__petal egc-mark__petal--3">
                            <circle cx="240" cy="350" r="100" fill="url(#m-f1-p)" />
                          </g>
                          <g className="egc-mark__petal egc-mark__petal--4">
                            <circle cx="130" cy="240" r="100" fill="url(#m-f1-p)" />
                          </g>
                          <g clipPath="url(#m-f1-q)">
                            <g className="egc-mark__petal egc-mark__petal--1">
                              <circle cx="240" cy="130" r="100" fill="url(#m-f1-p)" />
                            </g>
                          </g>
                        </g>
                        <circle
                          className="egc-mark__core"
                          cx="240"
                          cy="240"
                          r="29"
                          fill="#05231A"
                        />
                      </svg>
                      #01 <span data-i18n="f1.name">{tx('f1.name')}</span>
                    </p>
                    <h3 id="f1-t" data-i18n="f1.title">
                      {tx('f1.title')}
                    </h3>
                    <p className="fitem__short" data-i18n="f1.short">
                      {tx('f1.short')}
                    </p>
                    <details>
                      <summary>
                        <span data-i18n="fx.details">{tx('fx.details')}</span>
                        <i aria-hidden="true" />
                      </summary>
                      <div className="fitem__more">
                        <p data-i18n="f1.body">{tx('f1.body')}</p>

                        <p
                          className="fitem__proof"
                          data-i18n="f1.proof"
                          dangerouslySetInnerHTML={{ __html: tx('f1.proof') }}
                        />
                        <Link
                          prefetch={false}
                          className="link-arrow"
                          href={localePath(lang, '/docs/memory/')}
                        >
                          <span data-i18n="f1.link">{tx('f1.link')}</span>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        </Link>
                      </div>
                    </details>
                  </div>
                  <div className="viz" aria-hidden="true">
                    <span className="viz__label" data-i18n="fx.example">
                      {tx('fx.example')}
                    </span>
                    <div className="v-mem">
                      <span className="chip">store_decision</span>
                      <span className="v-mem__track v-mem__track--a">
                        <i />
                      </span>{' '}
                      <span className="v-mem__vault">
                        <svg
                          className="egc-mark"
                          viewBox="0 0 480 480"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <defs>
                            <linearGradient id="m-v1-p" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0" stopColor="#B4F8D6" />
                              <stop offset=".46" stopColor="#4FF3A3" />
                              <stop offset="1" stopColor="#17A862" />
                            </linearGradient>
                            <filter id="m-v1-e" x="-20%" y="-20%" width="140%" height="140%">
                              <feDropShadow
                                dx="0"
                                dy="0"
                                stdDeviation="7"
                                flood-color="#04361F"
                                flood-opacity=".42"
                              />
                            </filter>
                            <clipPath id="m-v1-q">
                              <rect x="0" y="0" width="240" height="240" />
                            </clipPath>
                          </defs>
                          <g className="egc-mark__body" filter="url(#m-v1-e)">
                            <g className="egc-mark__petal egc-mark__petal--1">
                              <circle cx="240" cy="130" r="100" fill="url(#m-v1-p)" />
                            </g>
                            <g className="egc-mark__petal egc-mark__petal--2">
                              <circle cx="350" cy="240" r="100" fill="url(#m-v1-p)" />
                            </g>
                            <g className="egc-mark__petal egc-mark__petal--3">
                              <circle cx="240" cy="350" r="100" fill="url(#m-v1-p)" />
                            </g>
                            <g className="egc-mark__petal egc-mark__petal--4">
                              <circle cx="130" cy="240" r="100" fill="url(#m-v1-p)" />
                            </g>
                            <g clipPath="url(#m-v1-q)">
                              <g className="egc-mark__petal egc-mark__petal--1">
                                <circle cx="240" cy="130" r="100" fill="url(#m-v1-p)" />
                              </g>
                            </g>
                          </g>
                          <circle
                            className="egc-mark__core"
                            cx="240"
                            cy="240"
                            r="29"
                            fill="#05231A"
                          />
                        </svg>
                        <span>~/.egc</span>
                      </span>
                      <span className="v-mem__track v-mem__track--b">
                        <i />
                      </span>
                      <span className="chip chip--ok">get_state</span>
                    </div>
                    <div className="v-mem__lab">
                      <span data-i18n="f1.v.save">{tx('f1.v.save')}</span>
                      <span data-i18n="f1.v.restore">{tx('f1.v.restore')}</span>
                    </div>
                  </div>
                </article>
                <article className="fitem rv" id="session-mesh" data-f="2" aria-labelledby="f2-t">
                  <div>
                    <p className="fitem__num">
                      <svg
                        className="egc-mark"
                        viewBox="0 0 480 480"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <defs>
                          <linearGradient id="m-f2-p" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0" stopColor="#B4F8D6" />
                            <stop offset=".46" stopColor="#4FF3A3" />
                            <stop offset="1" stopColor="#17A862" />
                          </linearGradient>
                          <filter id="m-f2-e" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow
                              dx="0"
                              dy="0"
                              stdDeviation="7"
                              flood-color="#04361F"
                              flood-opacity=".42"
                            />
                          </filter>
                          <clipPath id="m-f2-q">
                            <rect x="0" y="0" width="240" height="240" />
                          </clipPath>
                        </defs>
                        <g className="egc-mark__body" filter="url(#m-f2-e)">
                          <g className="egc-mark__petal egc-mark__petal--1">
                            <circle cx="240" cy="130" r="100" fill="url(#m-f2-p)" />
                          </g>
                          <g className="egc-mark__petal egc-mark__petal--2">
                            <circle cx="350" cy="240" r="100" fill="url(#m-f2-p)" />
                          </g>
                          <g className="egc-mark__petal egc-mark__petal--3">
                            <circle cx="240" cy="350" r="100" fill="url(#m-f2-p)" />
                          </g>
                          <g className="egc-mark__petal egc-mark__petal--4">
                            <circle cx="130" cy="240" r="100" fill="url(#m-f2-p)" />
                          </g>
                          <g clipPath="url(#m-f2-q)">
                            <g className="egc-mark__petal egc-mark__petal--1">
                              <circle cx="240" cy="130" r="100" fill="url(#m-f2-p)" />
                            </g>
                          </g>
                        </g>
                        <circle
                          className="egc-mark__core"
                          cx="240"
                          cy="240"
                          r="29"
                          fill="#05231A"
                        />
                      </svg>
                      #02 <span data-i18n="f2.name">{tx('f2.name')}</span>
                    </p>
                    <h3 id="f2-t" data-i18n="f2.title">
                      {tx('f2.title')}
                    </h3>
                    <p className="fitem__short" data-i18n="f2.short">
                      {tx('f2.short')}
                    </p>
                    <details>
                      <summary>
                        <span data-i18n="fx.details">{tx('fx.details')}</span>
                        <i aria-hidden="true" />
                      </summary>
                      <div className="fitem__more">
                        <p data-i18n="f2.body">{tx('f2.body')}</p>

                        <p
                          className="fitem__proof"
                          data-i18n="f2.proof"
                          dangerouslySetInnerHTML={{ __html: tx('f2.proof') }}
                        />
                        <Link
                          prefetch={false}
                          className="link-arrow"
                          href={localePath(lang, '/docs/mcp/')}
                        >
                          <span data-i18n="f2.link">{tx('f2.link')}</span>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        </Link>
                      </div>
                    </details>
                  </div>
                  <div className="viz" aria-hidden="true">
                    <span className="viz__label" data-i18n="fx.example">
                      {tx('fx.example')}
                    </span>
                    <div className="v-mesh">
                      <span className="v-mesh__bus">
                        <i />
                        <i />
                      </span>
                      <div className="v-node">
                        <b>A</b>
                        <span>Cursor</span>
                        <span className="chip chip--ok">claim_path</span>
                      </div>
                      <div className="v-node">
                        <b>B</b>
                        <span>Claude Code</span>
                        <span className="chip">session_send →</span>
                      </div>
                      <div className="v-node">
                        <b>C</b>
                        <span>Antigravity</span>
                        <span className="chip">session_wait</span>
                      </div>
                    </div>
                  </div>
                </article>
                <article className="fitem rv" id="guardian" data-f="3" aria-labelledby="f3-t">
                  <div>
                    <p className="fitem__num">
                      <svg
                        className="egc-mark"
                        viewBox="0 0 480 480"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <defs>
                          <linearGradient id="m-f3-p" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0" stopColor="#B4F8D6" />
                            <stop offset=".46" stopColor="#4FF3A3" />
                            <stop offset="1" stopColor="#17A862" />
                          </linearGradient>
                          <filter id="m-f3-e" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow
                              dx="0"
                              dy="0"
                              stdDeviation="7"
                              flood-color="#04361F"
                              flood-opacity=".42"
                            />
                          </filter>
                          <clipPath id="m-f3-q">
                            <rect x="0" y="0" width="240" height="240" />
                          </clipPath>
                        </defs>
                        <g className="egc-mark__body" filter="url(#m-f3-e)">
                          <g className="egc-mark__petal egc-mark__petal--1">
                            <circle cx="240" cy="130" r="100" fill="url(#m-f3-p)" />
                          </g>
                          <g className="egc-mark__petal egc-mark__petal--2">
                            <circle cx="350" cy="240" r="100" fill="url(#m-f3-p)" />
                          </g>
                          <g className="egc-mark__petal egc-mark__petal--3">
                            <circle cx="240" cy="350" r="100" fill="url(#m-f3-p)" />
                          </g>
                          <g className="egc-mark__petal egc-mark__petal--4">
                            <circle cx="130" cy="240" r="100" fill="url(#m-f3-p)" />
                          </g>
                          <g clipPath="url(#m-f3-q)">
                            <g className="egc-mark__petal egc-mark__petal--1">
                              <circle cx="240" cy="130" r="100" fill="url(#m-f3-p)" />
                            </g>
                          </g>
                        </g>
                        <circle
                          className="egc-mark__core"
                          cx="240"
                          cy="240"
                          r="29"
                          fill="#05231A"
                        />
                      </svg>
                      #03 <span data-i18n="f3.name">{tx('f3.name')}</span>
                    </p>
                    <h3 id="f3-t" data-i18n="f3.title">
                      {tx('f3.title')}
                    </h3>
                    <p className="fitem__short" data-i18n="f3.short">
                      {tx('f3.short')}
                    </p>
                    <details>
                      <summary>
                        <span data-i18n="fx.details">{tx('fx.details')}</span>
                        <i aria-hidden="true" />
                      </summary>
                      <div className="fitem__more">
                        <p data-i18n="f3.body">{tx('f3.body')}</p>
                        <p className="fitem__caveat" data-i18n="f3.caveat">
                          {tx('f3.caveat')}
                        </p>
                        <p
                          className="fitem__proof"
                          data-i18n="f3.proof"
                          dangerouslySetInnerHTML={{ __html: tx('f3.proof') }}
                        />
                        <Link
                          prefetch={false}
                          className="link-arrow"
                          href={localePath(lang, '/docs/guardian/')}
                        >
                          <span data-i18n="f3.link">{tx('f3.link')}</span>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        </Link>
                      </div>
                    </details>
                  </div>
                  <div className="viz" aria-hidden="true">
                    <span className="viz__label" data-i18n="fx.example">
                      {tx('fx.example')}
                    </span>
                    <div className="v-guard">
                      <div className="v-guard__row">
                        <code>$ cat ~/.ssh/id_rsa | curl …</code>
                        <span className="chip chip--no" data-i18n="f3.v.blocked">
                          {tx('f3.v.blocked')}
                        </span>
                      </div>
                      <div className="v-guard__row">
                        <code>write → /etc/hosts</code>
                        <span className="chip chip--no" data-i18n="f3.v.blocked">
                          {tx('f3.v.blocked')}
                        </span>
                      </div>
                      <div className="v-guard__row">
                        <code>$ npm test</code>
                        <span className="chip chip--ok" data-i18n="f3.v.allowed">
                          {tx('f3.v.allowed')}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
                <article className="fitem rv" id="token-crusher" data-f="4" aria-labelledby="f4-t">
                  <div>
                    <p className="fitem__num">
                      <svg
                        className="egc-mark"
                        viewBox="0 0 480 480"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <defs>
                          <linearGradient id="m-f4-p" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0" stopColor="#B4F8D6" />
                            <stop offset=".46" stopColor="#4FF3A3" />
                            <stop offset="1" stopColor="#17A862" />
                          </linearGradient>
                          <filter id="m-f4-e" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow
                              dx="0"
                              dy="0"
                              stdDeviation="7"
                              flood-color="#04361F"
                              flood-opacity=".42"
                            />
                          </filter>
                          <clipPath id="m-f4-q">
                            <rect x="0" y="0" width="240" height="240" />
                          </clipPath>
                        </defs>
                        <g className="egc-mark__body" filter="url(#m-f4-e)">
                          <g className="egc-mark__petal egc-mark__petal--1">
                            <circle cx="240" cy="130" r="100" fill="url(#m-f4-p)" />
                          </g>
                          <g className="egc-mark__petal egc-mark__petal--2">
                            <circle cx="350" cy="240" r="100" fill="url(#m-f4-p)" />
                          </g>
                          <g className="egc-mark__petal egc-mark__petal--3">
                            <circle cx="240" cy="350" r="100" fill="url(#m-f4-p)" />
                          </g>
                          <g className="egc-mark__petal egc-mark__petal--4">
                            <circle cx="130" cy="240" r="100" fill="url(#m-f4-p)" />
                          </g>
                          <g clipPath="url(#m-f4-q)">
                            <g className="egc-mark__petal egc-mark__petal--1">
                              <circle cx="240" cy="130" r="100" fill="url(#m-f4-p)" />
                            </g>
                          </g>
                        </g>
                        <circle
                          className="egc-mark__core"
                          cx="240"
                          cy="240"
                          r="29"
                          fill="#05231A"
                        />
                      </svg>
                      #04 <span data-i18n="f4.name">{tx('f4.name')}</span>
                    </p>
                    <h3 id="f4-t" data-i18n="f4.title">
                      {tx('f4.title')}
                    </h3>
                    <p className="fitem__short" data-i18n="f4.short">
                      {tx('f4.short')}
                    </p>
                    <details>
                      <summary>
                        <span data-i18n="fx.details">{tx('fx.details')}</span>
                        <i aria-hidden="true" />
                      </summary>
                      <div className="fitem__more">
                        <p data-i18n="f4.body">{tx('f4.body')}</p>

                        <p
                          className="fitem__proof"
                          data-i18n="f4.proof"
                          dangerouslySetInnerHTML={{ __html: tx('f4.proof') }}
                        />
                        <a
                          className="link-arrow"
                          href="https://github.com/Fmarzochi/EGC/blob/main/docs/token-optimization.md"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span data-i18n="f4.link">{tx('f4.link')}</span>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        </a>
                      </div>
                    </details>
                  </div>
                  <div className="viz" aria-hidden="true">
                    <span className="viz__label" data-i18n="fx.example">
                      {tx('fx.example')}
                    </span>
                    <div className="v-crush">
                      <div className="v-crush__lines">
                        <i style={{ width: '96%' }} />
                        <i style={{ width: '82%' }} />
                        <i style={{ width: '90%' }} />
                        <i className="err" style={{ width: '64%' }} />
                        <i style={{ width: '88%' }} />
                        <i style={{ width: '76%' }} />
                        <i style={{ width: '93%' }} />
                      </div>
                      <span className="v-crush__keep">
                        ● <span data-i18n="f4.v.kept">{tx('f4.v.kept')}</span>
                      </span>
                      <div className="v-crush__row">
                        <span data-i18n="f4.v.before">{tx('f4.v.before')}</span>
                        <span className="v-crush__bar" />
                        <b>637 KB</b>
                      </div>
                      <div className="v-crush__row v-crush__row--after">
                        <span data-i18n="f4.v.after">{tx('f4.v.after')}</span>
                        <span className="v-crush__bar" />
                        <b>31 KB</b>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* ============================ INTEGRATIONS ============================ */}
        <section className="sec int" id="integracoes" aria-labelledby="int-title">
          <div className="wrap">
            <div className="sec__head sec__head--split">
              <div>
                <p className="eyebrow rv">
                  <b>04</b> <span data-i18n="int.eyebrow">{tx('int.eyebrow')}</span>
                </p>
                <h2
                  className="h-section rv"
                  id="int-title"
                  data-i18n="int.title"
                  dangerouslySetInnerHTML={{ __html: tx('int.title') }}
                />
              </div>
              <p
                className="lede rv"
                data-i18n="int.lede"
                dangerouslySetInnerHTML={{ __html: tx('int.lede') }}
              />
            </div>

            <div className="int__block rv">
              <div className="int__bhead">
                <h3>
                  <span data-i18n="int.devTitle">{tx('int.devTitle')}</span>
                  <span>{integrations.length}</span>
                </h3>
                <p className="mono int__hint" data-i18n="int.hint">
                  {tx('int.hint')}
                </p>
              </div>
              <ul className="tgrid tgrid--featured">
                {featuredIntegrations.map((entry) => (
                  <li key={entry.slug}>
                    <Link
                      prefetch={false}
                      className="tile"
                      href={localePath(lang, `/integrations/${entry.slug}/`)}
                    >
                      <img
                        src={withBase(`tools/${entry.icon}`)}
                        alt=""
                        width="22"
                        height="22"
                        loading="lazy"
                      />{' '}
                      <b>{entry.name}</b>{' '}
                      <small data-i18n={entry.level === 'core' ? 'int.core' : 'int.community'}>
                        {tx(entry.level === 'core' ? 'int.core' : 'int.community')}
                      </small>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="int__more">
                <Link
                  prefetch={false}
                  className="link-arrow"
                  href={localePath(lang, '/integrations/')}
                >
                  <span data-i18n="int.allSite">{tx('int.allSite')}</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="int__block rv">
              <div className="int__bhead">
                <h3>
                  <span data-i18n="int.provTitle">{tx('int.provTitle')}</span>
                  <span>10</span>
                </h3>
                <p
                  style={{ fontSize: '15px', color: 'var(--text-2)', maxWidth: '40em' }}
                  data-i18n="int.provLede"
                >
                  {tx('int.provLede')}
                </p>
              </div>
              <ul className="tgrid tgrid--prov">
                <li>
                  <div className="tile">
                    <img
                      src="data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjMTkxOTE5IiByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+QW50aHJvcGljPC90aXRsZT48cGF0aCBkPSJNMTcuMzA0MSAzLjU0MWgtMy42NzE4bDYuNjk2IDE2LjkxOEgyNFptLTEwLjYwODIgMEwwIDIwLjQ1OWgzLjc0NDJsMS4zNjkzLTMuNTUyN2g3LjAwNTJsMS4zNjkzIDMuNTUyOGgzLjc0NDJMMTAuNTM2MyAzLjU0MDlabS0uMzcxMiAxMC4yMjMyIDIuMjkxNC01Ljk0NTYgMi4yOTE0IDUuOTQ1NloiLz48L3N2Zz4="
                      alt=""
                      width="22"
                      height="22"
                    />
                    <b>Claude</b>
                    <small data-i18n="int.native">{tx('int.native')}</small>
                  </div>
                </li>
                <li>
                  <div className="tile">
                    <img
                      src="data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iY3VycmVudENvbG9yIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMjIuMjgyIDkuODIxYTUuOTg1IDUuOTg1IDAgMCAwLS41MTYtNC45MSA2LjA0NiA2LjA0NiAwIDAgMC02LjUxLTIuOUE2LjA2NSA2LjA2NSAwIDAgMCA0Ljk4MSA0LjE4YTUuOTg1IDUuOTg1IDAgMCAwLTMuOTk4IDIuOSA2LjA0NiA2LjA0NiAwIDAgMCAuNzQzIDcuMDk3IDUuOTggNS45OCAwIDAgMCAuNTEgNC45MTEgNi4wNTEgNi4wNTEgMCAwIDAgNi41MTUgMi45QTUuOTg1IDUuOTg1IDAgMCAwIDEzLjI2IDI0YTYuMDU2IDYuMDU2IDAgMCAwIDUuNzcyLTQuMjA2IDUuOTkgNS45OSAwIDAgMCAzLjk5Ny0yLjkgNi4wNTYgNi4wNTYgMCAwIDAtLjc0Ny03LjA3M3pNMTMuMjYgMjIuNDNhNC40NzYgNC40NzYgMCAwIDEtMi44NzYtMS4wNGwuMTQxLS4wODEgNC43NzktMi43NThhLjc5NS43OTUgMCAwIDAgLjM5Mi0uNjgxdi02LjczN2wyLjAyIDEuMTY4YS4wNzEuMDcxIDAgMCAxIC4wMzguMDUydjUuNTgzYTQuNTA0IDQuNTA0IDAgMCAxLTQuNDk0IDQuNDk0ek0zLjYgMTguMzA0YTQuNDcgNC40NyAwIDAgMS0uNTM1LTMuMDE0bC4xNDIuMDg1IDQuNzgzIDIuNzU5YS43NzEuNzcxIDAgMCAwIC43OCAwbDUuODQzLTMuMzY5djIuMzMyYS4wOC4wOCAwIDAgMS0uMDMzLjA2Mkw5Ljc0IDE5Ljk1YTQuNSA0LjUgMCAwIDEtNi4xNC0xLjY0NnpNMi4zNCA3Ljg5NmE0LjQ4NSA0LjQ4NSAwIDAgMSAyLjM2Ni0xLjk3M1YxMS42YS43NjYuNzY2IDAgMCAwIC4zODguNjc2bDUuODE1IDMuMzU1LTIuMDIgMS4xNjhhLjA3Ni4wNzYgMCAwIDEtLjA3MSAwbC00LjgzLTIuNzg2QTQuNTA0IDQuNTA0IDAgMCAxIDIuMzQgNy44NzJ6bTE2LjU5NyAzLjg1NWwtNS44MzMtMy4zODdMMTUuMTE5IDcuMmEuMDc2LjA3NiAwIDAgMSAuMDcxIDBsNC44MyAyLjc5MWE0LjQ5NCA0LjQ5NCAwIDAgMS0uNjc2IDguMTA1di01LjY3OGEuNzkuNzkgMCAwIDAtLjQwNy0uNjY3em0yLjAxLTMuMDIzbC0uMTQxLS4wODUtNC43NzQtMi43ODJhLjc3Ni43NzYgMCAwIDAtLjc4NSAwTDkuNDA5IDkuMjNWNi44OTdhLjA2Ni4wNjYgMCAwIDEgLjAyOC0uMDYxbDQuODMtMi43ODdhNC41IDQuNSAwIDAgMSA2LjY4IDQuNjZ6bS0xMi42NCA0LjEzNWwtMi4wMi0xLjE2NGEuMDguMDggMCAwIDEtLjAzOC0uMDU3VjYuMDc1YTQuNSA0LjUgMCAwIDEgNy4zNzUtMy40NTNsLS4xNDIuMDhMOC43MDQgNS40NmEuNzk1Ljc5NSAwIDAgMC0uMzkzLjY4MXptMS4wOTctMi4zNjVsMi42MDItMS41IDIuNjA3IDEuNXYyLjk5OWwtMi41OTcgMS41LTIuNjA3LTEuNXoiLz4KPC9zdmc+Cg=="
                      alt=""
                      width="22"
                      height="22"
                    />
                    <b>ChatGPT</b>
                    <small data-i18n="int.native">{tx('int.native')}</small>
                  </div>
                </li>
                <li>
                  <div className="tile">
                    <img
                      src="data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjOEU3NUIyIiByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+R29vZ2xlIEdlbWluaTwvdGl0bGU+PHBhdGggZD0iTTExLjA0IDE5LjMyUTEyIDIxLjUxIDEyIDI0cTAtMi40OS45My00LjY4Ljk2LTIuMTkgMi41OC0zLjgxdDMuODEtMi41NVEyMS41MSAxMiAyNCAxMnEtMi40OSAwLTQuNjgtLjkzYTEyLjMgMTIuMyAwIDAgMS0zLjgxLTIuNTggMTIuMyAxMi4zIDAgMCAxLTIuNTgtMy44MVExMiAyLjQ5IDEyIDBxMCAyLjQ5LS45NiA0LjY4LS45MyAyLjE5LTIuNTUgMy44MWExMi4zIDEyLjMgMCAwIDEtMy44MSAyLjU4UTIuNDkgMTIgMCAxMnEyLjQ5IDAgNC42OC45NiAyLjE5LjkzIDMuODEgMi41NXQyLjU1IDMuODEiLz48L3N2Zz4="
                      alt=""
                      width="22"
                      height="22"
                    />
                    <b>Gemini</b>
                    <small data-i18n="int.native">{tx('int.native')}</small>
                  </div>
                </li>
                <li>
                  <div className="tile">
                    <img
                      src="data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+RGVlcFNlZWs8L3RpdGxlPjxwYXRoIGQ9Ik0yMy43NDggNC42NTFjLS4yNTQtLjEyNC0uMzY0LjExMy0uNTEyLjIzMy0uMDUxLjA0LS4wOTQuMDktLjEzNy4xMzctLjM3Mi4zOTctLjgwNi42NTctMS4zNzMuNjI2LS44MjktLjA0Ni0xLjUzNy4yMTQtMi4xNjMuODQ4LS4xMzMtLjc4Mi0uNTc1LTEuMjQ4LTEuMjQ3LTEuNTQ4LS4zNTItLjE1NS0uNzA4LS4zMTEtLjk1NS0uNjUtLjE3Mi0uMjQtLjIxOS0uNTA5LS4zMDUtLjc3NC0uMDU1LS4xNi0uMTEtLjMyMy0uMjkzLS4zNS0uMi0uMDMxLS4yNzguMTM2LS4zNTYuMjc2LS4zMTMuNTcyLS40MzQgMS4yMDItLjQyMiAxLjg0LjAyNyAxLjQzNi42MzMgMi41OCAxLjgzOCAzLjM5My4xMzcuMDk0LjE3Mi4xODcuMTI5LjMyMy0uMDgyLjI4LS4xOC41NTMtLjI2Ni44MzMtLjA1NS4xNzktLjEzNy4yMTgtLjMyOC4xNGE1LjUgNS41IDAgMCAxLTEuNzM3LTEuMTc5Yy0uODU3LS44MjgtMS42MzEtMS43NDMtMi41OTctMi40NmExMiAxMiAwIDAgMC0uNjg5LS40N2MtLjk4NS0uOTU3LjEzLTEuNzQzLjM4Ny0xLjgzNi4yNy0uMDk4LjA5NC0uNDMzLS43NzgtLjQyOC0uODcyLjAwMy0xLjY3LjI5NS0yLjY4Ny42ODVhMyAzIDAgMCAxLS40NjUuMTM2IDkuNiA5LjYgMCAwIDAtMi44ODMtLjEwMWMtMS44ODUuMjEtMy4zOSAxLjEtNC40OTcgMi42MjJDLjA4MiA4Ljc3Ni0uMjMxIDEwLjg1NC4xNTIgMTMuMDJjLjQwMyAyLjI4NCAxLjU2OCA0LjE3NSAzLjM2IDUuNjUzIDEuODU3IDEuNTMzIDMuOTk3IDIuMjg0IDYuNDM4IDIuMTQgMS40ODItLjA4NSAzLjEzMi0uMjg0IDQuOTk0LTEuODYuNDcuMjM0Ljk2Mi4zMjggMS43OC4zOTguNjI5LjA1OCAxLjIzNS0uMDMxIDEuNzA1LS4xMjkuNzM1LS4xNTUuNjg0LS44MzYuNDE4LS45NjEtMi4xNTUtMS4wMDQtMS42ODItLjU5NS0yLjExMi0uOTI2IDEuMDk1LTEuMjk1IDIuNzY4LTMuNTk4IDMuMjg0LTYuNzMzLjA1LS4zNDYuMTE1LS44MzQuMTA4LTEuMTE0LS4wMDQtLjE3MS4wMzUtLjIzOC4yMy0uMjU3YTQuMiA0LjIgMCAwIDAgMS41NDUtLjQ3NWMxLjM5Ny0uNzYzIDEuOTYtMi4wMTYgMi4wOTMtMy41MTcuMDItLjIzLS4wMDQtLjQ2Ny0uMjQ3LS41ODhNMTEuNTggMTguMTY4Yy0yLjA4OC0xLjY0Mi0zLjEwMS0yLjE4My0zLjUyLTIuMTYtLjM5LjAyNC0uMzIuNDcyLS4yMzQuNzYzLjA5LjI4OC4yMDcuNDg3LjM3MS43NC4xMTQuMTY3LjE5Mi40MTYtLjExMy42MDMtLjY3My40MTYtMS44NDItLjE0LTEuODk3LS4xNjgtMS4zNjEtLjgwMS0yLjUtMS44Ni0zLjMwMS0zLjMwNi0uNzc1LTEuMzkzLTEuMjI1LTIuODg4LTEuMjk5LTQuNDgyLS4wMi0uMzg1LjA5NC0uNTIyLjQ3Ny0uNTkyYTQuNyA0LjcgMCAwIDEgMS41My0uMDM4YzIuMTMxLjMxMSAzLjk0NiAxLjI2NCA1LjQ2NyAyLjc3NC44NjguODYgMS41MjUgMS44ODcgMi4yMDIgMi44OS43MiAxLjA2NiAxLjQ5NCAyLjA4MiAyLjQ4IDIuOTE1LjM0OC4yOTEuNjI2LjUxMy44OTIuNjc3LS44MDIuMDktMi4xNC4xMDktMy4wNTUtLjYxNXptMS4wMDEtNi40NGEuMzA2LjMwNiAwIDAgMSAuNDE1LS4yODcuMy4zIDAgMCAxIC4xMTMuMDc0LjMuMyAwIDAgMSAuMDg2LjIxNGMwIC4xNy0uMTM2LjMwNy0uMzA4LjMwN2EuMzAzLjMwMyAwIDAgMS0uMzA2LS4zMDdtMy4xMSAxLjU5NmMtLjIuMDgxLS40LjE1MS0uNTkxLjE2YTEuMjUgMS4yNSAwIDAgMS0uNzk4LS4yNTRjLS4yNzQtLjIzLS40Ny0uMzU4LS41NTEtLjc1OGExLjcgMS43IDAgMCAxIC4wMTUtLjU4OGMuMDctLjMyNy0uMDA3LS41MzctLjIzOC0uNzI3LS4xODgtLjE1Ni0uNDI2LS4xOTktLjY4OS0uMTk5YS42LjYgMCAwIDEtLjI1NC0uMDc4LjI1My4yNTMgMCAwIDEtLjExNC0uMzU4IDEgMSAwIDAgMSAuMTkyLS4yMWMuMzU2LS4yMDIuNzY3LS4xMzYgMS4xNDYuMDE2LjM1Mi4xNDQuNjE4LjQwOCAxLjAwMS43ODIuMzkyLjQ1MS40NjIuNTc2LjY4NS45MTUuMTc2LjI2NC4zMzYuNTM2LjQ0Ni44NDguMDY2LjE5NC0uMDIuMzUzLS4yNS40NSIvPjwvc3ZnPg=="
                      alt=""
                      width="22"
                      height="22"
                    />
                    <b>DeepSeek</b>
                    <small data-i18n="int.native">{tx('int.native')}</small>
                  </div>
                </li>
                <li>
                  <div className="tile">
                    <img
                      src="data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+TWlzdHJhbCBBSTwvdGl0bGU+PHBhdGggZD0iTTE3LjE0MyAzLjQyOXYzLjQyOGgtMy40Mjl2My40MjloLTMuNDI4VjYuODU3SDYuODU3VjMuNDNIMy40M3YxMy43MTRIMHYzLjQyOGgxMC4yODZ2LTMuNDI4SDYuODU3di0zLjQyOWgzLjQyOXYzLjQyOWgzLjQyOXYtMy40MjloMy40Mjh2My40MjloLTMuNDI4djMuNDI4SDI0di0zLjQyOGgtMy40M1YzLjQyOXoiLz48L3N2Zz4="
                      alt=""
                      width="22"
                      height="22"
                    />
                    <b>Mistral AI</b>
                    <small data-i18n="int.native">{tx('int.native')}</small>
                  </div>
                </li>
                <li>
                  <div className="tile">
                    <img
                      src="data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+T2xsYW1hPC90aXRsZT48cGF0aCBkPSJNMTYuMzYxIDEwLjI2YS44OTQuODk0IDAgMCAwLS41NTguNDdsLS4wNzIuMTQ4LjAwMS4yMDdjMCAuMTkzLjAwNC4yMTcuMDU5LjM1My4wNzYuMTkzLjE1Mi4zMTIuMjkxLjQ0OC4yNC4yMzguNTEuMy44NzIuMjA1YS44Ni44NiAwIDAgMCAuNTE3LS40MzYuNzUyLjc1MiAwIDAgMCAuMDgtLjQ5OGMtLjA2NC0uNDUzLS4zMy0uNzgyLS43MjQtLjg5N2ExLjA2IDEuMDYgMCAwIDAtLjQ2NiAwem0tOS4yMDMuMDA1Yy0uMzA1LjA5Ni0uNTMzLjMyLS42NS42MzlhMS4xODcgMS4xODcgMCAwIDAtLjA2LjUyYy4wNTcuMzA5LjMxLjU5LjU5OC42NjcuMzYyLjA5NS42MzIuMDMzLjg3Mi0uMjA1LjE0LS4xMzYuMjE1LS4yNTUuMjkxLS40NDguMDU1LS4xMzYuMDU5LS4xNi4wNTktLjM1M2wuMDAxLS4yMDctLjA3Mi0uMTQ4YS44OTQuODk0IDAgMCAwLS41NjUtLjQ3MiAxLjAyIDEuMDIgMCAwIDAtLjQ3NC4wMDdabTQuMTg0IDJjLS4xMzEuMDcxLS4yMjMuMjUtLjE5NS4zODMuMDMxLjE0My4xNTcuMjg4LjM1My40MDcuMTA1LjA2My4xMTIuMDcyLjExNy4xMzYuMDA0LjAzOC0uMDEuMTQ2LS4wMjkuMjQzLS4wMi4wOTQtLjAzNi4xOTQtLjAzNi4yMjIuMDAyLjA3NC4wNy4xOTUuMTQzLjI1My4wNjQuMDUyLjA3Ni4wNTQuMjU1LjA1OS4xNjQuMDA1LjE5OC4wMDEuMjY0LS4wMy4xNjktLjA4Mi4yMTItLjIzNC4xNS0uNTI1LS4wNTItLjI0My0uMDQyLS4yOC4wODctLjM1NS4xMzctLjA4LjI4MS0uMjE5LjMyNC0uMzE0YS4zNjUuMzY1IDAgMCAwLS4xNzUtLjQ4LjM5NC4zOTQgMCAwIDAtLjE4MS0uMDMzYy0uMTI2IDAtLjIwNy4wMy0uMzU1LjEyNGwtLjA4NS4wNTMtLjA1My0uMDMyYy0uMjE5LS4xMy0uMjU5LS4xNDUtLjM5MS0uMTQzYS4zOTYuMzk2IDAgMCAwLS4xOTMuMDMyem0uMzktMi4xOTVjLS4zNzMuMDM2LS40NzUuMDUtLjY1NC4wODYtLjI5MS4wNi0uNjguMTk1LS45NTEuMzI4LS45NC40Ni0xLjU4OSAxLjIyNi0xLjc4NyAyLjExNC0uMDQuMTc2LS4wNDUuMjM0LS4wNDUuNTMgMCAuMjk0LjAwNS4zNTcuMDQzLjUyNC4yNjQgMS4xNiAxLjMzMiAyLjAxNyAyLjcxNCAyLjE3My4zLjAzMyAxLjU5Ni4wMzMgMS44OTYgMCAxLjExLS4xMjUgMi4wNjQtLjcyNyAyLjQ5My0xLjU3MS4xMTQtLjIyNi4xNjktLjM3Mi4yMi0uNjAyLjAzOS0uMTY3LjA0NC0uMjMuMDQ0LS41MjMgMC0uMjk3LS4wMDUtLjM1NS0uMDQ1LS41MzEtLjI4OC0xLjI5LTEuNTM5LTIuMzA0LTMuMDcyLTIuNDk3YTYuODczIDYuODczIDAgMCAwLS44NTUtLjAzMXptLjY0NS45MzdhMy4yODMgMy4yODMgMCAwIDEgMS40NC41MTRjLjIyMy4xNDguNTM3LjQ1OC42NzEuNjYyLjE2Ni4yNTEuMjYuNTA4LjMwMy44Mi4wMi4xNDMuMDEuMjUxLS4wNDMuNDgyLS4wOC4zNDUtLjMzMi43MDUtLjY3Mi45NTdhMy4xMTUgMy4xMTUgMCAwIDEtLjY4OS4zNDhjLS4zODIuMTIyLS42MzIuMTQ0LTEuNTI1LjEzOC0uNTgyLS4wMDYtLjY4Ni0uMDEtLjg1My0uMDQyLS41Ny0uMTA3LTEuMDIyLS4zMzQtMS4zNS0uNjgtLjI2NC0uMjgtLjM4NS0uNTM1LS40NS0uOTQ2LS4wMy0uMTkyLjAyNS0uNTA5LjEzNy0uNzc2LjEzNi0uMzI2LjQ4OC0uNzMuODM2LS45NjMuNDAzLS4yNjkuOTM0LS40NiAxLjQyMi0uNTEyLjE4Ny0uMDIuNTg2LS4wMi43NzMtLjAwMnptLTUuNTAzLTExYTEuNjUzIDEuNjUzIDAgMCAwLS42ODMuMjk4QzUuNjE3Ljc0IDUuMTczIDEuNjY2IDQuOTg1IDIuODE5Yy0uMDcuNDM2LS4xMTkgMS4wNC0uMTE5IDEuNTAzIDAgLjU0NC4wNjQgMS4yNC4xNTUgMS43MjEuMDIuMTA3LjAzMS4yMDIuMDIzLjIwOGE4LjEyIDguMTIgMCAwIDEtLjE4Ny4xNTIgNS4zMjQgNS4zMjQgMCAwIDAtLjk0OSAxLjAyIDUuNDkgNS40OSAwIDAgMC0uOTQgMi4zMzkgNi42MjUgNi42MjUgMCAwIDAtLjAyMyAxLjM1N2MuMDkxLjc4LjMyNSAxLjQzOC43MjcgMi4wNGwuMTMuMTk1LS4wMzcuMDY0Yy0uMjY5LjQ1Mi0uNDk4IDEuMTA1LS42MDUgMS43MzItLjA4NC40OTYtLjA5NS42MjktLjA5NSAxLjI5NCAwIC42Ny4wMDkuODAzLjA4OCAxLjI2Ni4wOTUuNTU1LjI4OCAxLjE0My41MDMgMS41MzQuMDcxLjEyOC4yNDMuMzkzLjI2NC40MDcuMDA3LjAwMy0uMDE0LjA2Ny0uMDQ2LjE0MWE3LjQwNSA3LjQwNSAwIDAgMC0uNTQ4IDEuODczYy0uMDYyLjQxNy0uMDcxLjU1Mi0uMDcxLjk5MSAwIC41Ni4wMzEuODMyLjE0OCAxLjI3OUwzLjQyIDI0aDEuNDc4bC0uMDUtLjA5MWMtLjI5Ny0uNTUyLS4zMjUtMS41NzUtLjA2OC0yLjU5Ny4xMTctLjQ3Mi4yNS0uODE5LjQ5OC0xLjI5NmwuMTQ4LS4yOXYtLjE3N2MwLS4xNjUtLjAwMy0uMTg0LS4wNTctLjI5M2EuOTE1LjkxNSAwIDAgMC0uMTk0LS4yNSAxLjc0IDEuNzQgMCAwIDEtLjM4NS0uNTQzYy0uNDI0LS45Mi0uNTA2LTIuMjg2LS4yMDgtMy40NTEuMTI0LS40ODYuMzI5LS45MTguNTQ0LTEuMTU0YS43ODcuNzg3IDAgMCAwIC4yMjMtLjUzMWMwLS4xOTUtLjA3LS4zNTUtLjIyNC0uNTIyYTMuMTM2IDMuMTM2IDAgMCAxLS44MTctMS43MjljLS4xNC0uOTYuMTE0LTIuMDA1LjY5LTIuODM0LjU2My0uODE0IDEuMzUzLTEuMzM2IDIuMjM3LTEuNDc1LjE5OS0uMDMzLjU3LS4wMjguNzc2LjAxLjIyNi4wNC4zNjcuMDI4LjUxMi0uMDQxLjE3OS0uMDg1LjI2OC0uMTkuMzc0LS40MzEuMDkzLS4yMTUuMTY1LS4zMzMuMzYtLjU3Ni4yMzQtLjI5LjQ2LS40ODkuODIyLS43MjkuNDEzLS4yNy44ODQtLjQ2NyAxLjM1Mi0uNTYxLjE3LS4wMzUuMjUtLjA0LjU2OS0uMDQuMzE5IDAgLjM5OC4wMDUuNTY5LjA0YTQuMDcgNC4wNyAwIDAgMSAxLjkxNC45OTdjLjExNy4xMDkuMzk4LjQ1Ny40ODguNjAyLjAzNC4wNTcuMDk1LjE3Ny4xMzIuMjY3LjEwNS4yNDEuMTk1LjM0Ni4zNzQuNDMuMTQuMDY4LjI4Ni4wODIuNTAzLjA0NS4zNDMtLjA1OC42MDctLjA1My45NDMuMDE2IDEuMTQ0LjIzIDIuMTQgMS4xNzMgMi41ODEgMi40MzcuMzg1IDEuMTA4LjI3NiAyLjI2Ny0uMjk2IDMuMTUzLS4wOTcuMTUtLjE5My4yNy0uMzMzLjQxOS0uMzAxLjMyMi0uMzAxLjcyMi0uMDAxIDEuMDUzLjQ5My41MzkuODAxIDEuODY2LjcwOCAzLjAzNi0uMDYyLjc3Mi0uMjYgMS40NjMtLjUzMyAxLjg1NGEyLjA5NiAyLjA5NiAwIDAgMS0uMjI0LjI1OC45MTYuOTE2IDAgMCAwLS4xOTQuMjVjLS4wNTQuMTA5LS4wNTcuMTI4LS4wNTcuMjkzdi4xNzhsLjE0OC4yOWMuMjQ4LjQ3Ni4zOC44MjMuNDk4IDEuMjk1LjI1MyAxLjAwOC4yMzEgMi4wMS0uMDU5IDIuNTgxYS44NDUuODQ1IDAgMCAwLS4wNDQuMDk4YzAgLjAwNi4zMjkuMDA5LjczMi4wMDloLjczbC4wMi0uMDc0LjAzNi0uMTM0Yy4wMTktLjA3Ni4wNTctLjMuMDg4LS41MTYuMDI5LS4yMTcuMDI5LTEuMDE2IDAtMS4yNTgtLjExLS44NzUtLjI5NS0xLjU3LS41OTctMi4yMjYtLjAzMi0uMDc0LS4wNTMtLjEzOC0uMDQ2LS4xNDEuMDA4LS4wMDUuMDU3LS4wNzQuMTA4LS4xNTIuMzc2LS41NjkuNjA3LTEuMjg0LjcyNC0yLjIyOC4wMzEtLjI2LjAzMS0xLjM3OCAwLTEuNjI4LS4wODMtLjY0NS0uMTgyLTEuMDgyLS4zNDgtMS41MjVhNi4wODMgNi4wODMgMCAwIDAtLjMyOS0uN2wtLjAzOC0uMDY0LjEzMS0uMTk0Yy40MDItLjYwNC42MzYtMS4yNjIuNzI3LTIuMDRhNi42MjUgNi42MjUgMCAwIDAtLjAyNC0xLjM1OCA1LjUxMiA1LjUxMiAwIDAgMC0uOTM5LTIuMzM5IDUuMzI1IDUuMzI1IDAgMCAwLS45NS0xLjAyIDguMDk3IDguMDk3IDAgMCAxLS4xODYtLjE1Mi42OTIuNjkyIDAgMCAxIC4wMjMtLjIwOGMuMjA4LTEuMDg3LjIwMS0yLjQ0My0uMDE3LTMuNTAzLS4xOS0uOTI0LS41MzUtMS42NTgtLjk4LTIuMDgyLS4zNTQtLjMzOC0uNzE2LS40ODItMS4xNS0uNDU1LS45OTYuMDU5LTEuOCAxLjIwNS0yLjExNiAzLjAxYTYuODA1IDYuODA1IDAgMCAwLS4wOTcuNzI2YzAgLjAzNi0uMDA3LjA2Ni0uMDE1LjA2NmEuOTYuOTYgMCAwIDEtLjE0OS0uMDc4QTQuODU3IDQuODU3IDAgMCAwIDEyIDMuMDNjLS44MzIgMC0xLjY4Ny4yNDMtMi40NTYuNjk4YS45NTguOTU4IDAgMCAxLS4xNDguMDc4Yy0uMDA4IDAtLjAxNS0uMDMtLjAxNS0uMDY2YTYuNzEgNi43MSAwIDAgMC0uMDk3LS43MjVDOC45OTcgMS4zOTIgOC4zMzcuMzE5IDcuNDYuMDQ4YTIuMDk2IDIuMDk2IDAgMCAwLS41ODUtLjA0MVptLjI5MyAxLjQwMmMuMjQ4LjE5Ny41MjMuNzU5LjY4MiAxLjM4OC4wMy4xMTMuMDYuMjQ0LjA2OS4yOTIuMDA3LjA0Ny4wMjYuMTUyLjA0MS4yMzMuMDY3LjM2NS4wOTguNzYuMTAyIDEuMjRsLjAwMi40NzUtLjEyLjE3NS0uMTE4LjE3OGgtLjI3OGMtLjMyNCAwLS42NDYuMDQxLS45NTQuMTI0bC0uMjM4LjA2Yy0uMDMzLjAwNy0uMDM4LS4wMDMtLjA1Ny0uMTQ0YTguNDM4IDguNDM4IDAgMCAxIC4wMTYtMi4zMjNjLjEyNC0uNzg4LjQxMy0xLjUwMS42OTYtMS43MTEuMDY3LS4wNS4wNzktLjA0OS4xNTcuMDEzem05LjgyNS0uMDEyYy4xNy4xMjYuMzU4LjQ2LjQ5OC44ODguMjguODU0LjM2IDIuMDI4LjIxMiAzLjE0NS0uMDE5LjE0LS4wMjQuMTUxLS4wNTcuMTQ0bC0uMjM4LS4wNmEzLjY5MyAzLjY5MyAwIDAgMC0uOTU0LS4xMjRoLS4yNzhsLS4xMTktLjE3OC0uMTE5LS4xNzUuMDAyLS40NzRjLjAwNC0uNjY5LjA2Ni0xLjE5LjIxNC0xLjc3Mi4xNTctLjYyMy40MzQtMS4xODUuNjgtMS4zODIuMDc4LS4wNjIuMDktLjA2My4xNTktLjAxMnoiLz48L3N2Zz4="
                      alt=""
                      width="22"
                      height="22"
                    />
                    <b>Ollama</b>
                    <small data-i18n="int.native">{tx('int.native')}</small>
                  </div>
                </li>
                <li>
                  <div className="tile">
                    <img
                      src="data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iY3VycmVudENvbG9yIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTMgMiAzIDE0aDZsLTIgOCAxMC0xMmgtNmwyLTh6Ii8+Cjwvc3ZnPgo="
                      alt=""
                      width="22"
                      height="22"
                    />
                    <b>Groq</b>
                    <small data-i18n="int.native">{tx('int.native')}</small>
                  </div>
                </li>
                <li>
                  <div className="tile">
                    <img
                      src="data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+R29vZ2xlIENsb3VkPC90aXRsZT48cGF0aCBkPSJNMTIuMTkgMi4zOGE5LjM0NCA5LjM0NCAwIDAgMC05LjIzNCA2Ljg5M2MuMDUzLS4wMi0uMDU1LjAxMyAwIDAtMy44NzUgMi41NTEtMy45MjIgOC4xMS0uMjQ3IDEwLjk0MWwuMDA2LS4wMDctLjAwNy4wM2E2LjcxNyA2LjcxNyAwIDAgMCA0LjA3NyAxLjM1Nmg1LjE3M2wuMDMuMDNoNS4xOTJjNi42ODcuMDUzIDkuMzc2LTguNjA1IDMuODM1LTEyLjM1YTkuMzY1IDkuMzY1IDAgMCAwLTIuODIxLTQuNTUybC0uMDQzLjA0My4wMDYtLjA1QTkuMzQ0IDkuMzQ0IDAgMCAwIDEyLjE5IDIuMzh6bS0uMzU4IDQuMTQ2YzEuMjQ0LS4wNCAyLjUxOC4zNjggMy40ODYgMS4xNWE1LjE4NiA1LjE4NiAwIDAgMSAxLjg2MiA0LjA3OHYuNTE4YzMuNTMtLjA3IDMuNTMgNS4yNjIgMCA1LjE5M2gtNS4xOTNsLS4wMDguMDA5di0uMDRINi43ODVhMi41OSAyLjU5IDAgMCAxLTEuMDY3LS4yM2guMDAxYTIuNTk3IDIuNTk3IDAgMSAxIDMuNDM3LTMuNDM3bDMuMDEzLTMuMDEyQTYuNzQ3IDYuNzQ3IDAgMCAwIDguMTEgOC4yNGMuMDE4LS4wMS4wNC0uMDI2LjA1NC0uMDIzYTUuMTg2IDUuMTg2IDAgMCAxIDMuNjctMS42OXoiLz48L3N2Zz4="
                      alt=""
                      width="22"
                      height="22"
                    />
                    <b>Vertex AI</b>
                    <small data-i18n="int.native">{tx('int.native')}</small>
                  </div>
                </li>
                <li>
                  <div className="tile">
                    <img
                      src="data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMS44IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8Y2lyY2xlIGN4PSI5LjUiIGN5PSIxMiIgcj0iNi41Ii8+CjxjaXJjbGUgY3g9IjE0LjUiIGN5PSIxMiIgcj0iNi41Ii8+Cjwvc3ZnPgo="
                      alt=""
                      width="22"
                      height="22"
                    />
                    <b>Cohere</b>
                    <small data-i18n="int.native">{tx('int.native')}</small>
                  </div>
                </li>
                <li>
                  <div className="tile">
                    <img
                      src="data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+T3BlblJvdXRlcjwvdGl0bGU+PHBhdGggZD0iTTE2Ljc3OCAxLjg0NHYxLjkxOXEtLjU2OS0uMDI2LTEuMTM4LS4wMzItLjcwOC0uMDA4LTEuNDE1LjAzN2MtMS45My4xMjYtNC4wMjMuNzI4LTYuMTQ5IDIuMjM3LTIuOTExIDIuMDY2LTIuNzMxIDEuOTUtNC4xNCAyLjc1LS4zOTYuMjIzLTEuMzQyLjU3NC0yLjE4NS43OTgtLjg0MS4yMjUtMS43NTMuMzMzLTEuNzUxLjMzM3Y0LjIyOXMuNzY4LjEwOCAxLjYxLjMzM2MuODQyLjIyNCAxLjc4OS41NzUgMi4xODUuNzk5IDEuNDEuNzk4IDEuMjI4LjY4MyA0LjE0IDIuNzUgMi4xMjYgMS41MDkgNC4yMiAyLjExIDYuMTQ4IDIuMjM2Ljg4LjA1OCAxLjcxNi4wNDEgMi41NTUuMDA1djEuOTE4bDcuMjIyLTQuMTY4LTcuMjIyLTQuMTd2Mi4xNzZjLS44Ni4wMzgtMS42MTEuMDY1LTIuMjc4LjAyMS0xLjM2NC0uMDktMi40MTctLjM1Ny0zLjk3OS0xLjQ2NS0yLjI0NC0xLjU5My0yLjg2Ni0yLjAyNy0zLjY4LTIuNTA4Ljg4OS0uNTE4IDEuNDQ5LS45MDYgMy44MjItMi41OSAxLjU2LTEuMTA5IDIuNjE0LTEuMzc3IDMuOTc4LTEuNDY2LjY2Ny0uMDQ0IDEuNDE4LS4wMTcgMi4yNzguMDJ2Mi4xNzZMMjQgNi4wMTRaIi8+PC9zdmc+"
                      alt=""
                      width="22"
                      height="22"
                    />
                    <b>OpenRouter</b>
                    <small data-i18n="int.broker">{tx('int.broker')}</small>
                  </div>
                </li>
                <li aria-hidden="true" />
                <li aria-hidden="true" />
              </ul>
            </div>
          </div>
        </section>

        {/* ============================ EFFICIENCY ============================ */}
        <section className="sec eff" aria-labelledby="eff-title">
          <div className="wrap eff__grid">
            <div className="eff__hero rv">
              <p className="eyebrow">
                <b>05</b> <span data-i18n="eff.eyebrow">{tx('eff.eyebrow')}</span>
              </p>
              <div className="eff__bigrow">
                <p className="eff__big" aria-hidden="true">
                  87<span>%</span>
                </p>
                <p className="eff__est" data-i18n="eff.estimate">
                  {tx('eff.estimate')}
                </p>
              </div>
              <h2 className="eff__cap" id="eff-title">
                <span className="sr-only">87%</span>
                <span data-i18n="eff.cap">{tx('eff.cap')}</span>
              </h2>
            </div>
            <div>
              <ul className="metrics">
                <li className="metric" style={{ '--rd': '0.0s' } as CSSProperties}>
                  <p className="metric__label" data-i18n="eff.m1">
                    {tx('eff.m1')}
                  </p>
                  <div className="metric__rows">
                    <div className="bar">
                      <span data-i18n="eff.without">{tx('eff.without')}</span>
                      <span className="bar__track">
                        <span className="bar__fill" style={{ '--w': '100%' } as CSSProperties} />
                      </span>
                      <span className="bar__val" data-i18n="eff.m1a">
                        {tx('eff.m1a')}
                      </span>
                    </div>
                    <div className="bar bar--with">
                      <span data-i18n="eff.with">{tx('eff.with')}</span>
                      <span className="bar__track">
                        <span className="bar__fill" style={{ '--w': '13.3%' } as CSSProperties} />
                      </span>
                      <span className="bar__val" data-i18n="eff.m1b">
                        {tx('eff.m1b')}
                      </span>
                    </div>
                  </div>
                </li>
                <li className="metric" style={{ '--rd': '0.1s' } as CSSProperties}>
                  <p className="metric__label" data-i18n="eff.m2">
                    {tx('eff.m2')}
                  </p>
                  <div className="metric__rows">
                    <div className="bar">
                      <span data-i18n="eff.without">{tx('eff.without')}</span>
                      <span className="bar__track">
                        <span className="bar__fill" style={{ '--w': '100%' } as CSSProperties} />
                      </span>
                      <span className="bar__val" data-i18n="eff.m2a">
                        {tx('eff.m2a')}
                      </span>
                    </div>
                    <div className="bar bar--with">
                      <span data-i18n="eff.with">{tx('eff.with')}</span>
                      <span className="bar__track">
                        <span className="bar__zero" />
                      </span>
                      <span className="bar__val" data-i18n="eff.m2b">
                        {tx('eff.m2b')}
                      </span>
                    </div>
                  </div>
                </li>
                <li className="metric" style={{ '--rd': '0.2s' } as CSSProperties}>
                  <p className="metric__label" data-i18n="eff.m3">
                    {tx('eff.m3')}
                  </p>
                  <div className="metric__rows">
                    <div className="bar">
                      <span data-i18n="eff.without">{tx('eff.without')}</span>
                      <span className="bar__track">
                        <span className="bar__fill" style={{ '--w': '100%' } as CSSProperties} />
                      </span>
                      <span className="bar__val" data-i18n="eff.m3a">
                        {tx('eff.m3a')}
                      </span>
                    </div>
                    <div className="bar bar--with">
                      <span data-i18n="eff.with">{tx('eff.with')}</span>
                      <span className="bar__track">
                        <span className="bar__fill" style={{ '--w': '13.5%' } as CSSProperties} />
                      </span>
                      <span className="bar__val" data-i18n="eff.m3b">
                        {tx('eff.m3b')}
                      </span>
                    </div>
                  </div>
                </li>
                <li className="metric" style={{ '--rd': '0.3s' } as CSSProperties}>
                  <p className="metric__label" data-i18n="eff.m4">
                    {tx('eff.m4')}
                  </p>
                  <div className="metric__rows">
                    <div className="bar">
                      <span data-i18n="eff.without">{tx('eff.without')}</span>
                      <span className="bar__track">
                        <span className="bar__fill" style={{ '--w': '100%' } as CSSProperties} />
                      </span>
                      <span className="bar__val" data-i18n="eff.m4a">
                        {tx('eff.m4a')}
                      </span>
                    </div>
                    <div className="bar bar--with">
                      <span data-i18n="eff.with">{tx('eff.with')}</span>
                      <span className="bar__track">
                        <span className="bar__fill" style={{ '--w': '10%' } as CSSProperties} />
                      </span>
                      <span className="bar__val" data-i18n="eff.m4b">
                        {tx('eff.m4b')}
                      </span>
                    </div>
                  </div>
                </li>
              </ul>
              <p
                className="eff__note"
                data-i18n="eff.note"
                dangerouslySetInnerHTML={{ __html: tx('eff.note') }}
              />
            </div>
          </div>
        </section>

        {/* ============================ PRIVACY ============================ */}
        <section className="sec prv" aria-labelledby="prv-title">
          <div className="wrap vault">
            <div>
              <p className="eyebrow rv">
                <b>06</b>{' '}
                <span
                  data-i18n="prv.eyebrow"
                  dangerouslySetInnerHTML={{ __html: tx('prv.eyebrow') }}
                />
              </p>
              <p className="vault__path rv" aria-hidden="true">
                ~/<span>.egc</span>
              </p>
              <h2
                className="h-section rv"
                id="prv-title"
                data-i18n="prv.title"
                dangerouslySetInnerHTML={{ __html: tx('prv.title') }}
              />
            </div>
            <div className="rv" style={{ '--rd': '.1s' } as CSSProperties}>
              <ul className="specs">
                <li>
                  <span className="k" data-i18n="prv.k1">
                    {tx('prv.k1')}
                  </span>
                  <span className="v">
                    <span data-i18n="prv.v1">{tx('prv.v1')}</span>
                    <small data-i18n="prv.s1">{tx('prv.s1')}</small>
                  </span>
                </li>
                <li>
                  <span className="k" data-i18n="prv.k2">
                    {tx('prv.k2')}
                  </span>
                  <span className="v">
                    <span data-i18n="prv.v2">{tx('prv.v2')}</span>
                    <small data-i18n="prv.s2">{tx('prv.s2')}</small>
                  </span>
                </li>
                <li>
                  <span className="k" data-i18n="prv.k3">
                    {tx('prv.k3')}
                  </span>
                  <span className="v">
                    <span data-i18n="prv.v3">{tx('prv.v3')}</span>
                    <small data-i18n="prv.s3">{tx('prv.s3')}</small>
                  </span>
                </li>
                <li>
                  <span className="k" data-i18n="prv.k4">
                    {tx('prv.k4')}
                  </span>
                  <span className="v">
                    <span data-i18n="prv.v4">{tx('prv.v4')}</span>
                    <small data-i18n="prv.s4">{tx('prv.s4')}</small>
                  </span>
                </li>
                <li>
                  <span className="k" data-i18n="prv.k5">
                    {tx('prv.k5')}
                  </span>
                  <span className="v">
                    <span data-i18n="prv.v5">{tx('prv.v5')}</span>
                    <small data-i18n="prv.s5">{tx('prv.s5')}</small>
                  </span>
                </li>
              </ul>
              <ul
                className="proofs"
                data-i18n-attr="aria-label:prv.proofs"
                aria-label={tx('prv.proofs')}
              >
                <li>
                  <a
                    href="https://www.bestpractices.dev/projects/13099"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    OpenSSF Best Practices
                  </a>
                </li>
                <li>
                  <a
                    href="https://securityscorecards.dev/viewer/?uri=github.com/Fmarzochi/EGC"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    OpenSSF Scorecard
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/Fmarzochi/EGC/actions/workflows/codeql.yml"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    CodeQL
                  </a>
                </li>
                <li>
                  <a
                    href="https://sonarcloud.io/project/overview?id=Fmarzochi_EGC"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    SonarCloud
                  </a>
                </li>
                <li>
                  <Link
                    prefetch={false}
                    href={localePath(lang, '/docs/security/')}
                    data-i18n="prv.model"
                  >
                    {tx('prv.model')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ============================ INSTALL ============================ */}
        <section className="sec ins grain" id="instalar" aria-labelledby="ins-title">
          <div className="wrap ins__grid">
            <div>
              <p className="eyebrow rv">
                <b>07</b> <span data-i18n="ins.eyebrow">{tx('ins.eyebrow')}</span>
              </p>
              <h2
                className="h-section rv"
                id="ins-title"
                data-i18n="ins.title"
                dangerouslySetInnerHTML={{ __html: tx('ins.title') }}
              />
              <ol className="steps rv">
                <li>
                  <div>
                    <h3 data-i18n="ins.st1">{tx('ins.st1')}</h3>
                    <p data-i18n="ins.st1p">{tx('ins.st1p')}</p>
                  </div>
                </li>
                <li>
                  <div>
                    <h3 data-i18n="ins.st2" dangerouslySetInnerHTML={{ __html: tx('ins.st2') }} />
                    <p data-i18n="ins.st2p">{tx('ins.st2p')}</p>
                  </div>
                </li>
                <li>
                  <div>
                    <h3 data-i18n="ins.st3">{tx('ins.st3')}</h3>
                    <p data-i18n="ins.st3p">{tx('ins.st3p')}</p>
                  </div>
                </li>
              </ol>
            </div>
            <div className="term rv" style={{ '--rd': '.1s' } as CSSProperties}>
              <div
                className="term__tabs"
                role="tablist"
                data-i18n-attr="aria-label:ins.tabs"
                aria-label={tx('ins.tabs')}
              >
                <button
                  className="term__tab"
                  role="tab"
                  id="tab-npm"
                  aria-controls="panel-npm"
                  aria-selected="true"
                  tabIndex={0}
                  type="button"
                >
                  npm<small data-i18n="ins.rec">{tx('ins.rec')}</small>
                </button>{' '}
                <button
                  className="term__tab"
                  role="tab"
                  id="tab-linux"
                  aria-controls="panel-linux"
                  aria-selected="false"
                  tabIndex={-1}
                  type="button"
                >
                  Linux
                </button>{' '}
                <button
                  className="term__tab"
                  role="tab"
                  id="tab-macos"
                  aria-controls="panel-macos"
                  aria-selected="false"
                  tabIndex={-1}
                  type="button"
                >
                  macOS
                </button>{' '}
                <button
                  className="term__tab"
                  role="tab"
                  id="tab-windows"
                  aria-controls="panel-windows"
                  aria-selected="false"
                  tabIndex={-1}
                  type="button"
                >
                  Windows
                </button>
              </div>
              <div
                className="term__panel"
                role="tabpanel"
                id="panel-npm"
                aria-labelledby="tab-npm"
                tabIndex={0}
                data-cmd="npm install -g @egchq/egc
egc install"
              >
                <p className="term__note" data-i18n="ins.npmNote">
                  {tx('ins.npmNote')}
                </p>
                <pre>
                  <span className="p">{'$ '}</span>
                  {'npm install -g @egchq/egc\n'}
                  <span className="p">{'$ '}</span>
                  {'egc install\n'}
                  <span className="c" data-i18n="ins.verify">
                    {tx('ins.verify')}
                  </span>
                  {'\n'}
                  <span className="p">{'$ '}</span>
                  {'egc doctor\n'}
                  <span className="ok">{'egc-guardian running'}</span>
                  {'\n'}
                  <span className="ok">{'egc-memory   running'}</span>
                </pre>
              </div>
              <div
                className="term__panel"
                role="tabpanel"
                id="panel-linux"
                aria-labelledby="tab-linux"
                tabIndex={0}
                hidden
                data-cmd="git clone https://github.com/Fmarzochi/EGC.git
cd EGC && sh scripts/install.sh"
              >
                <p
                  className="term__note"
                  data-i18n="ins.req"
                  dangerouslySetInnerHTML={{ __html: tx('ins.req') }}
                />
                <pre>
                  <span className="p">{'$ '}</span>
                  {'git clone https://github.com/Fmarzochi/EGC.git\n'}
                  <span className="p">{'$ '}</span>
                  {'cd EGC && sh scripts/install.sh'}
                </pre>
              </div>
              <div
                className="term__panel"
                role="tabpanel"
                id="panel-macos"
                aria-labelledby="tab-macos"
                tabIndex={0}
                hidden
                data-cmd="git clone https://github.com/Fmarzochi/EGC.git
cd EGC && sh scripts/install.sh"
              >
                <p
                  className="term__note"
                  data-i18n="ins.req"
                  dangerouslySetInnerHTML={{ __html: tx('ins.req') }}
                />
                <pre>
                  <span className="p">{'$ '}</span>
                  {'git clone https://github.com/Fmarzochi/EGC.git\n'}
                  <span className="p">{'$ '}</span>
                  {'cd EGC && sh scripts/install.sh'}
                </pre>
              </div>
              <div
                className="term__panel"
                role="tabpanel"
                id="panel-windows"
                aria-labelledby="tab-windows"
                tabIndex={0}
                hidden
                data-cmd="git clone https://github.com/Fmarzochi/EGC.git
cd EGC; .\scripts\install.ps1"
              >
                <p
                  className="term__note"
                  data-i18n="ins.reqWin"
                  dangerouslySetInnerHTML={{ __html: tx('ins.reqWin') }}
                />
                <pre>
                  <span className="p">{'PS> '}</span>
                  {'git clone https://github.com/Fmarzochi/EGC.git\n'}
                  <span className="p">{'PS> '}</span>
                  {'cd EGC; .\\scripts\\install.ps1'}
                </pre>
              </div>
              <div className="term__bar">
                <Link
                  prefetch={false}
                  className="link-arrow"
                  href={localePath(lang, '/get-started/')}
                >
                  <span data-i18n="ins.guide">{tx('ins.guide')}</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>{' '}
                <span className="term__status" role="status" data-term-status="" />{' '}
                <button
                  className="copy-btn"
                  type="button"
                  data-copy-active=""
                  data-label-key="ui.copyCmds"
                  data-i18n-attr="aria-label:a.copyTab"
                  aria-label={tx('a.copyTab')}
                >
                  <svg
                    className="i-copy"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <rect x="9" y="9" width="12" height="12" rx="2" />
                    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                  </svg>
                  <svg
                    className="i-done"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    aria-hidden="true"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  <span data-copy-label="" data-i18n="ui.copyCmds">
                    {tx('ui.copyCmds')}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ============================ FAQ ============================ */}
        <section className="sec faq" aria-labelledby="faq-title">
          <div className="wrap faq__grid">
            <div className="faq__aside">
              <p className="eyebrow rv">
                <b>08</b> <span data-i18n="faq.eyebrow">{tx('faq.eyebrow')}</span>
              </p>
              <h2
                className="h-section rv"
                id="faq-title"
                data-i18n="faq.title"
                dangerouslySetInnerHTML={{ __html: tx('faq.title') }}
              />
              <p className="lede rv" style={{ marginTop: '24px' }}>
                <span data-i18n="faq.more">{tx('faq.more')}</span>
                <br />
                <Link prefetch={false} className="link-arrow" href={localePath(lang, '/docs/faq/')}>
                  <span data-i18n="faq.link">{tx('faq.link')}</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </p>
            </div>
            <div className="rv" data-faq="">
              <details open>
                <summary>
                  <span data-i18n="q1">{tx('q1')}</span>
                  <i aria-hidden="true" />
                </summary>
                <div className="ans">
                  <p data-i18n="a1">{tx('a1')}</p>
                </div>
              </details>
              <details>
                <summary>
                  <span data-i18n="q2">{tx('q2')}</span>
                  <i aria-hidden="true" />
                </summary>
                <div className="ans">
                  <p data-i18n="a2">{tx('a2')}</p>
                </div>
              </details>
              <details>
                <summary>
                  <span data-i18n="q3">{tx('q3')}</span>
                  <i aria-hidden="true" />
                </summary>
                <div className="ans">
                  <p data-i18n="a3">{tx('a3')}</p>
                </div>
              </details>
              <details>
                <summary>
                  <span data-i18n="q4">{tx('q4')}</span>
                  <i aria-hidden="true" />
                </summary>
                <div className="ans">
                  <p data-i18n="a4">{tx('a4')}</p>
                </div>
              </details>
              <details>
                <summary>
                  <span data-i18n="q5">{tx('q5')}</span>
                  <i aria-hidden="true" />
                </summary>
                <div className="ans">
                  <p data-i18n="a5">{tx('a5')}</p>
                </div>
              </details>
              <details>
                <summary>
                  <span data-i18n="q6">{tx('q6')}</span>
                  <i aria-hidden="true" />
                </summary>
                <div className="ans">
                  <p data-i18n="a6">{tx('a6')}</p>
                </div>
              </details>
              <details>
                <summary>
                  <span data-i18n="q7">{tx('q7')}</span>
                  <i aria-hidden="true" />
                </summary>
                <div className="ans">
                  <p data-i18n="a7">{tx('a7')}</p>
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* ============================ CLOSING ============================ */}
        <section className="closing grain" aria-labelledby="cl-title">
          <div className="closing__mark" aria-hidden="true">
            <svg className="egc-mark" viewBox="0 0 480 480" aria-hidden="true" focusable="false">
              <defs>
                <linearGradient id="m-close-p" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#B4F8D6" />
                  <stop offset=".46" stopColor="#4FF3A3" />
                  <stop offset="1" stopColor="#17A862" />
                </linearGradient>
                <filter id="m-close-e" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow
                    dx="0"
                    dy="0"
                    stdDeviation="7"
                    flood-color="#04361F"
                    flood-opacity=".42"
                  />
                </filter>
                <clipPath id="m-close-q">
                  <rect x="0" y="0" width="240" height="240" />
                </clipPath>
              </defs>
              <g className="egc-mark__body" filter="url(#m-close-e)">
                <g className="egc-mark__petal egc-mark__petal--1">
                  <circle cx="240" cy="130" r="100" fill="url(#m-close-p)" />
                </g>
                <g className="egc-mark__petal egc-mark__petal--2">
                  <circle cx="350" cy="240" r="100" fill="url(#m-close-p)" />
                </g>
                <g className="egc-mark__petal egc-mark__petal--3">
                  <circle cx="240" cy="350" r="100" fill="url(#m-close-p)" />
                </g>
                <g className="egc-mark__petal egc-mark__petal--4">
                  <circle cx="130" cy="240" r="100" fill="url(#m-close-p)" />
                </g>
                <g clipPath="url(#m-close-q)">
                  <g className="egc-mark__petal egc-mark__petal--1">
                    <circle cx="240" cy="130" r="100" fill="url(#m-close-p)" />
                  </g>
                </g>
              </g>
              <circle className="egc-mark__core" cx="240" cy="240" r="29" fill="#05231A" />
            </svg>
          </div>
          <div className="wrap">
            <h2
              id="cl-title"
              className="rv"
              data-i18n="cl.title"
              dangerouslySetInnerHTML={{ __html: tx('cl.title') }}
            />
            <div className="closing__row rv" style={{ '--rd': '.1s' } as CSSProperties}>
              <a className="btn" href="#instalar">
                <span data-i18n="hero.ctaInstall">{tx('hero.ctaInstall')}</span>
                <span className="btn__icon" aria-hidden="true">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </a>
              <div className="cmd">
                <span className="cmd__prompt" aria-hidden="true">
                  $
                </span>
                <span className="cmd__text">npm install -g @egchq/egc &amp;&amp; egc install</span>
                <button
                  className="copy-btn"
                  type="button"
                  data-copy="npm install -g @egchq/egc && egc install"
                  data-label-key="ui.copy"
                  data-i18n-attr="aria-label:a.copyInstall"
                  aria-label={tx('a.copyInstall')}
                >
                  <svg
                    className="i-copy"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <rect x="9" y="9" width="12" height="12" rx="2" />
                    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                  </svg>
                  <svg
                    className="i-done"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    aria-hidden="true"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  <span data-copy-label="" data-i18n="ui.copy">
                    {tx('ui.copy')}
                  </span>
                </button>
              </div>
            </div>
            <p className="closing__en rv" style={{ '--rd': '.2s' } as CSSProperties}>
              EGC · Context That Never Resets
            </p>
          </div>
        </section>
      </main>

      {/* ============================ FOOTER (community + support) ============================ */}
      <footer className="ftr">
        <div className="wrap">
          <div className="comm">
            <p className="comm__title" data-i18n="com.title">
              {tx('com.title')}
            </p>
            <ul className="channels">
              <li>
                <a
                  href="https://github.com/Fmarzochi/EGC"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>
                    <b>GitHub</b>
                    <small data-i18n="com.gh">{tx('com.gh')}</small>
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://www.npmjs.com/package/@egchq/egc"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>
                    <b>npm</b>
                    <small data-i18n="com.npm">{tx('com.npm')}</small>
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              </li>
              <li>
                <a href="https://discord.gg/FmXbgUmdmM" target="_blank" rel="noopener noreferrer">
                  <span>
                    <b>Discord</b>
                    <small data-i18n="com.discord">{tx('com.discord')}</small>
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://huggingface.co/spaces/fmarzochi/EGC"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>
                    <b>Hugging Face</b>
                    <small data-i18n="com.hf">{tx('com.hf')}</small>
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              </li>
            </ul>
            <div className="support">
              <p data-i18n="com.support">{tx('com.support')}</p>
              <div className="support__btns">
                <a
                  className="btn"
                  href="https://github.com/sponsors/Fmarzochi"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span data-i18n="com.sponsors">{tx('com.sponsors')}</span>
                  <span className="btn__icon" aria-hidden="true">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </a>{' '}
                <a
                  className="btn btn--ghost"
                  href="https://www.paypal.com/donate/?business=fmarzochi%40gmail.com&currency_code=USD"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-i18n="com.paypal"
                >
                  {tx('com.paypal')}
                </a>
              </div>
              <div className="backers">
                <div>
                  <b data-i18n="com.partner">{tx('com.partner')}</b>
                  <a href="https://www.pincushion.io/" target="_blank" rel="noopener noreferrer">
                    <img
                      src={withBase('sponsors/pincushion.png')}
                      alt=""
                      width="28"
                      height="28"
                      loading="lazy"
                    />
                    Pincushion
                  </a>
                </div>
                <div>
                  <b data-i18n="com.backer">{tx('com.backer')}</b>
                  <a
                    href="https://github.com/chizormaangel-commits"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAaQAAAGkCAIAAADxLsZiAAAFrUlEQVR4nOzWYW3DMBRG0XUKgMIrlEIolMB7EMZhWuxo9xwC/v746h0z8wXw333vHgCwgtgBCWIHJIgdkCB2QILYAQliBySIHZAgdkCC2AEJYgckiB2QIHZAgtgBCWIHJIgdkCB2QILYAQliBySIHZAgdkCC2AEJYgckiB2QIHZAgtgBCWIHJIgdkCB2QILYAQliBySIHZAgdkCC2AEJx+4B3Micn90T/t7z9d49gVtw2QEJYgckiB2QIHZAgtgBCWIHJIgdkCB2QILYAQliBySIHZAgdkCC2AEJYgckiB2QIHZAgtgBCWIHJIgdkCB2QILYAQliBySIHZAgdkCC2AEJYgckiB2QIHZAgtgBCWIHJIgdkCB2QILYAQliBySIHZAgdkCC2AEJYgckiB2QIHZAgtgBCWIHJIgdkCB2QILYAQliBySIHZAgdkCC2AEJYgckiB2QIHZAgtgBCWIHJIgdkCB2QILYAQliBySIHZAgdkCC2AEJYgckiB2QIHZAgtgBCWIHJIgdkCB2QILYAQliBySIHZAgdkCC2AEJYgckiB2QIHZAgtgBCWIHJIgdkCB2QILYAQliBySIHZAgdkCC2AEJYgckiB2QIHZAgtgBCWIHJIgdkCB2QILYAQliBySIHZAgdkCC2AEJYgckiB2QIHZAgtgBCWIHJIgdkCB2QILYAQliBySIHZAgdkCC2AEJYgckiB2QIHZAgtgBCWIHJIgdkCB2QILYAQliBySIHZAgdkCC2AEJYgckiB2QIHZAgtgBCWIHJIgdkCB2QILYAQliBySIHZAgdkCC2AEJYgckiB2QIHZAgtgBCWIHJIgdkCB2QMJjZnZvALicyw5IEDsgQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSxA5IEDsgQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSxA5IEDsgQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSxA5IEDsgQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSxA5IEDsgQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSxA5IEDsgQeyABLEDEsQOSBA7IEHsgASxAxKOZS/N+Vn21jLP13v3BFr8o19z2QEJYgckiB2QIHZAgtgBCWIHJIgdkCB2QILYAQliBySIHZAgdkCC2AEJYgckiB2QIHZAgtgBCWIHJIgdkCB2QILYAQliBySIHZAgdkCC2AEJYgckiB2QIHZAgtgBCWIHJIgdkCB2QILYAQliBySIHZAgdkCC2AEJYgckiB2QIHZAgtgBCWIHJIgdkCB2QILYAQliBySIHZAgdkCC2AEJYgckiB2QIHZAgtgBCWIHJIgdkCB2QILYAQliBySIHZAgdkCC2AEJYgckiB2QIHZAgtgBCWIHJIgdkCB2QILYAQliByQ8Zmb3BoDLueyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSxA5IEDsgQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSxA5IEDsgQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSxA5IEDsgQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSxA5IEDsgQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSxA5IEDsgQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSxA5IEDsgQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSxA5IEDsgQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSxA5IEDsgQeyABLEDEsQOSBA7IEHsgASxAxLEDkj4CQAA//9QZRS9mLUf5QAAAABJRU5ErkJggg=="
                      alt=""
                      width="28"
                      height="28"
                      loading="lazy"
                    />
                    @chizormaangel-commits
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="ftr__grid">
            <div className="ftr__brand">
              <a className="brand" href="#topo">
                <svg
                  className="egc-mark"
                  viewBox="0 0 480 480"
                  aria-hidden="true"
                  focusable="false"
                >
                  <defs>
                    <linearGradient id="m-ftr-p" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#B4F8D6" />
                      <stop offset=".46" stopColor="#4FF3A3" />
                      <stop offset="1" stopColor="#17A862" />
                    </linearGradient>
                    <filter id="m-ftr-e" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow
                        dx="0"
                        dy="0"
                        stdDeviation="7"
                        flood-color="#04361F"
                        flood-opacity=".42"
                      />
                    </filter>
                    <clipPath id="m-ftr-q">
                      <rect x="0" y="0" width="240" height="240" />
                    </clipPath>
                  </defs>
                  <g className="egc-mark__body" filter="url(#m-ftr-e)">
                    <g className="egc-mark__petal egc-mark__petal--1">
                      <circle cx="240" cy="130" r="100" fill="url(#m-ftr-p)" />
                    </g>
                    <g className="egc-mark__petal egc-mark__petal--2">
                      <circle cx="350" cy="240" r="100" fill="url(#m-ftr-p)" />
                    </g>
                    <g className="egc-mark__petal egc-mark__petal--3">
                      <circle cx="240" cy="350" r="100" fill="url(#m-ftr-p)" />
                    </g>
                    <g className="egc-mark__petal egc-mark__petal--4">
                      <circle cx="130" cy="240" r="100" fill="url(#m-ftr-p)" />
                    </g>
                    <g clipPath="url(#m-ftr-q)">
                      <g className="egc-mark__petal egc-mark__petal--1">
                        <circle cx="240" cy="130" r="100" fill="url(#m-ftr-p)" />
                      </g>
                    </g>
                  </g>
                  <circle className="egc-mark__core" cx="240" cy="240" r="29" fill="#05231A" />
                </svg>
                <span>EGC</span>
              </a>
              <p data-i18n="ft.tag">{tx('ft.tag')}</p>
            </div>
            <div>
              <h2 data-i18n="ft.docs">{tx('ft.docs')}</h2>
              <ul>
                <li>
                  <Link
                    prefetch={false}
                    href={localePath(lang, '/get-started/')}
                    data-i18n="ft.guide"
                  >
                    {tx('ft.guide')}
                  </Link>
                </li>
                <li>
                  <Link
                    prefetch={false}
                    href={localePath(lang, '/docs/memory/')}
                    data-i18n="ft.memory"
                  >
                    {tx('ft.memory')}
                  </Link>
                </li>
                <li>
                  <Link prefetch={false} href={localePath(lang, '/docs/guardian/')}>
                    Guardian
                  </Link>
                </li>
                <li>
                  <Link prefetch={false} href={localePath(lang, '/docs/mcp/')} data-i18n="ft.mcp">
                    {tx('ft.mcp')}
                  </Link>
                </li>
                <li>
                  <Link
                    prefetch={false}
                    href={localePath(lang, '/docs/architecture/')}
                    data-i18n="ft.arch"
                  >
                    {tx('ft.arch')}
                  </Link>
                </li>
                <li>
                  <Link
                    prefetch={false}
                    href={localePath(lang, '/integrations/')}
                    data-i18n="ft.int"
                  >
                    {tx('ft.int')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 data-i18n="ft.project">{tx('ft.project')}</h2>
              <ul>
                <li>
                  <a
                    href="https://github.com/Fmarzochi/EGC/releases"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-i18n="ft.releases"
                  >
                    {tx('ft.releases')}
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/Fmarzochi/EGC/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-i18n="ft.issues"
                  >
                    {tx('ft.issues')}
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/Fmarzochi/EGC/blob/main/.github/CONTRIBUTING.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-i18n="ft.contrib"
                  >
                    {tx('ft.contrib')}
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/Fmarzochi/EGC/blob/main/docs/VISION.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-i18n="ft.vision"
                  >
                    {tx('ft.vision')}
                  </a>
                </li>
                <li>
                  <Link
                    prefetch={false}
                    href={localePath(lang, '/contributors/')}
                    data-i18n="ft.hof"
                  >
                    {tx('ft.hof')}
                  </Link>
                </li>
                <li>
                  <a href={withBase('rss.xml')} data-i18n="ft.rss">
                    {tx('ft.rss')}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 data-i18n="ft.security">{tx('ft.security')}</h2>
              <ul>
                <li>
                  <a
                    href="https://github.com/Fmarzochi/EGC/blob/main/.github/SECURITY.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-i18n="ft.policy"
                  >
                    {tx('ft.policy')}
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/Fmarzochi/EGC/security"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-i18n="ft.adv"
                  >
                    {tx('ft.adv')}
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/Fmarzochi/EGC/actions/workflows/dependency-review.yml"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-i18n="ft.dep"
                  >
                    {tx('ft.dep')}
                  </a>
                </li>
                <li>
                  <Link
                    prefetch={false}
                    href={localePath(lang, '/privacy/')}
                    data-i18n="ft.privacy"
                  >
                    {tx('ft.privacy')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="ftr__bottom">
            <p data-i18n="ft.license" dangerouslySetInnerHTML={{ __html: tx('ft.license') }} />
            <p className="mono">&gt; egc restore ✓ ready</p>
          </div>
        </div>
      </footer>
      <script
        type="application/ld+json"
        id="ld-faq"
        dangerouslySetInnerHTML={{ __html: tx('ld.faq') }}
      />
      <HomeBehavior texts={runtimeTexts} />
    </>
  );
}
