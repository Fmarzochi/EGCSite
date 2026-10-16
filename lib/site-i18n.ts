import { canonicalUrl } from '@/lib/base';
import type { Lang } from '@/lib/lang';

// Inner pages are bilingual by URL: the English page keeps its address (/docs/memory/) and the
// Portuguese one lives under /pt/ (/pt/docs/memory/). There is no language switch and no
// redirect on inner pages: the address decides. Only the home picks the language from the time
// zone (lib/lang.ts), and every link then stays in that language.

/** Inner pages that have a Portuguese version under /pt/. */
const PT_PAGES: readonly string[] = [
  '/',
  '/get-started/',
  '/features/',
  '/docs/architecture/',
  '/docs/cli/',
  '/docs/faq/',
  '/docs/guardian/',
  '/docs/mcp/',
  '/docs/memory/',
  '/docs/security/',
  '/privacy/',
];

/**
 * Sections translated as a whole: the index and every page under it (one per tool, one per
 * contributor). A prefix rather than a list, so this module, which the browser scripts import
 * too, never pulls the integration or contributor data into the client bundle.
 */
const PT_SECTIONS: readonly string[] = ['/integrations/', '/contributors/'];

/** Whether the inner page at `path` ('/docs/faq/') has a Portuguese version under /pt/. */
export function hasPortuguese(path: string): boolean {
  return PT_PAGES.includes(path) || PT_SECTIONS.some((section) => path.startsWith(section));
}

/** Address of `path` in `lang`: the Portuguese page when it exists, the English one otherwise. */
export function localePath(lang: Lang, path: string): string {
  return lang === 'pt' && hasPortuguese(path) ? `/pt${path}` : path;
}

/** hreflang alternates for a route ('get-started/' or 'pt/get-started/'), when both languages exist. */
export function languageAlternates(route: string): Record<string, string> | undefined {
  const path = `/${route.replace(/^\/+/, '').replace(/^pt\//, '')}`;
  if (!hasPortuguese(path)) return undefined;
  return {
    en: canonicalUrl(path),
    'pt-BR': canonicalUrl(`pt${path}`),
    'x-default': canonicalUrl(path),
  };
}

/** Language of an inner page route. */
export function routeLang(route: string): Lang {
  return /^\/?pt\//.test(route) ? 'pt' : 'en';
}

const en = {
  skip: 'Skip to content',
  nav: {
    home: 'Home',
    features: 'Features',
    integrations: 'Integrations',
    docs: 'Docs',
    hof: 'Hall of Fame',
    getEgc: 'Get EGC',
    newTab: '(opens in new tab)',
    main: 'Main navigation',
    mobile: 'Mobile navigation',
    site: 'Site navigation',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    star: 'Star on GitHub (opens in new tab)',
  },
  footer: {
    tagline: 'Your project remembers across sessions, branches and tools.',
    docs: 'Documentation',
    project: 'Project',
    security: 'Security',
    getStarted: 'Get Started',
    features: 'Features',
    memory: 'Memory',
    mcp: 'MCP Servers',
    architecture: 'Architecture',
    integrations: 'Integrations',
    contributing: 'Contributing',
    vision: 'Vision',
    securityPolicy: 'Security',
    rss: 'RSS Feed',
    rssLabel: 'RSS feed for EGC releases',
    hfLabel: 'Hugging Face Space',
    securityPolicyLabel: 'Security policy',
    githubRepo: 'GitHub repository',
    discordServer: 'Discord server',
    license: 'EGC Contributors. Apache 2.0 Licensed.',
    privacy: 'Privacy Policy',
    openSource: 'Open Source',
  },
  docs: {
    gettingStarted: 'Getting Started',
    installation: 'Installation',
    features: 'Features',
    mcpServers: 'MCP Servers',
    overview: 'Overview',
    integrations: 'Integrations',
    allTools: (n: number) => `All ${n} tools`,
    reference: 'Reference',
    architecture: 'Architecture',
    security: 'Security',
    cli: 'CLI Reference',
    faq: 'FAQ',
    vision: 'Vision',
    community: 'Community',
    contributing: 'Contributing',
    releases: 'Releases',
    legal: 'Legal',
    privacy: 'Privacy Policy',
    topics: 'Topics',
    documentation: 'Documentation',
    openMenu: 'Open docs menu',
    closeMenu: 'Close docs menu',
    quickNav: 'Documentation quick navigation',
    sidebar: 'Documentation navigation',
    onThisPage: 'On this page',
    pages: 'Documentation pages',
    previous: '← Previous',
    next: 'Next →',
    quickTip: 'QUICK TIP',
    memoryTip: 'State is encrypted per project branch at',
  },
  // Texts DocsBehavior writes at runtime; it reads the page language from <html lang>.
  behavior: {
    copy: 'Copy',
    copyCode: 'Copy code',
    copied: 'Copied ✓',
    codeCopied: 'Code copied',
    copyFailed: 'Copy failed',
    previousSection: '← Previous section',
    nextSection: 'Next section →',
    pageSections: 'Page sections',
    showFullPage: 'Show full page',
  },
};

export type SiteText = typeof en;

const pt: SiteText = {
  skip: 'Pular para o conteúdo',
  nav: {
    home: 'Início',
    features: 'Funções',
    integrations: 'Integrações',
    docs: 'Documentação',
    hof: 'Hall of Fame',
    getEgc: 'Instalar EGC',
    newTab: '(abre em nova aba)',
    main: 'Navegação principal',
    mobile: 'Navegação móvel',
    site: 'Navegação do site',
    openMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
    star: 'Dar uma estrela no GitHub (abre em nova aba)',
  },
  footer: {
    tagline: 'Seu projeto lembra entre sessões, branches e ferramentas.',
    docs: 'Documentação',
    project: 'Projeto',
    security: 'Segurança',
    getStarted: 'Guia de instalação',
    features: 'Funções',
    memory: 'Memória',
    mcp: 'Servidores MCP',
    architecture: 'Arquitetura',
    integrations: 'Integrações',
    contributing: 'Como contribuir',
    vision: 'Visão',
    securityPolicy: 'Política de segurança',
    rss: 'RSS de releases',
    rssLabel: 'Feed RSS das releases do EGC',
    hfLabel: 'Space no Hugging Face',
    securityPolicyLabel: 'Política de segurança',
    githubRepo: 'Repositório no GitHub',
    discordServer: 'Servidor no Discord',
    license: 'Contribuidores do EGC. Licença Apache 2.0.',
    privacy: 'Política de privacidade',
    openSource: 'Código aberto',
  },
  docs: {
    gettingStarted: 'Primeiros passos',
    installation: 'Instalação',
    features: 'Funções',
    mcpServers: 'Servidores MCP',
    overview: 'Visão geral',
    integrations: 'Integrações',
    allTools: (n: number) => `Todas as ${n} ferramentas`,
    reference: 'Referência',
    architecture: 'Arquitetura',
    security: 'Segurança',
    cli: 'Referência da CLI',
    faq: 'Perguntas frequentes',
    vision: 'Visão',
    community: 'Comunidade',
    contributing: 'Como contribuir',
    releases: 'Releases',
    legal: 'Legal',
    privacy: 'Política de privacidade',
    topics: 'Tópicos',
    documentation: 'Documentação',
    openMenu: 'Abrir o menu da documentação',
    closeMenu: 'Fechar o menu da documentação',
    quickNav: 'Navegação rápida da documentação',
    sidebar: 'Navegação da documentação',
    onThisPage: 'Nesta página',
    pages: 'Páginas da documentação',
    previous: '← Anterior',
    next: 'Próxima →',
    quickTip: 'DICA',
    memoryTip: 'O estado é criptografado por branch do projeto em',
  },
  behavior: {
    copy: 'Copiar',
    copyCode: 'Copiar código',
    copied: 'Copiado ✓',
    codeCopied: 'Código copiado',
    copyFailed: 'Falha ao copiar',
    previousSection: '← Seção anterior',
    nextSection: 'Próxima seção →',
    pageSections: 'Seções da página',
    showFullPage: 'Mostrar a página inteira',
  },
};

const TEXT: Record<Lang, SiteText> = { en, pt };

export function siteText(lang: Lang): SiteText {
  return TEXT[lang];
}

/** Language of the page being shown, for client behaviours: from <html lang>. */
export function documentLang(): Lang {
  return document.documentElement.lang.startsWith('pt') ? 'pt' : 'en';
}
