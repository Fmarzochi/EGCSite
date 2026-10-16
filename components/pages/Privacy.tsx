import type { ReactNode } from 'react';
import DocsShell from '@/components/docs/DocsShell';
import { withBase } from '@/lib/base';
import type { Lang } from '@/lib/lang';

// The privacy policy in both languages: one markup, texts per language. Ported from
// src/pages/privacy.astro (English); the Portuguese text is a translation of it that keeps every
// commitment exactly as the English one states it.

const strong = (text: string) => <strong className="text-gray-900 dark:text-white">{text}</strong>;
const linkClass = 'text-egc-600 dark:text-egc-400 hover:underline';

function External({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
      {children}
    </a>
  );
}

interface Copy {
  meta: { title: string; description: string };
  eyebrow: string;
  title: string;
  dates: string;
  intro: (site: ReactNode, egc: ReactNode) => ReactNode;
  tldr: string[];
  collectTitle: string;
  collect: (none: ReactNode) => ReactNode;
  analyticsTitle: string;
  analyticsLead: (goat: ReactNode) => ReactNode;
  goatPoints: ReactNode[];
  dashboard: (link: ReactNode) => ReactNode;
  rssTitle: string;
  rss: (link: ReactNode) => ReactNode;
  rssLink: string;
  thirdTitle: string;
  thirdLead: string;
  githubPages: ReactNode;
  /** The demo video player on the home. */
  youtube: ReactNode;
  cliTitle: string;
  cli: (path: ReactNode, policy: ReactNode) => ReactNode;
  securityPolicy: string;
  contactTitle: string;
  contact: (email: ReactNode, issues: ReactNode) => ReactNode;
}

const COPY: Record<Lang, Copy> = {
  en: {
    meta: {
      title: 'Privacy Policy',
      description:
        'EGCSite privacy policy. No personal data collected. No cookies. GoatCounter analytics only.',
    },
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    dates: 'Effective date: June 16, 2026. Last updated: September 20, 2026.',
    intro: (site, egc) => (
      <>
        This site ({site}) is the official documentation and marketing website for {egc}, an
        open-source project. This policy explains what data is collected when you visit this site.
      </>
    ),
    tldr: [
      'No personal data collected',
      'No cookies, no tracking pixels, no fingerprinting',
      'No account or registration required',
      'Analytics are aggregate-only and privacy-first',
      'No data is sold or shared with third parties',
    ],
    collectTitle: 'What we collect',
    collect: (none) => (
      <>
        We collect {none}. There are no forms, no login, no newsletter signup, and no user accounts
        on this site.
      </>
    ),
    analyticsTitle: 'Analytics',
    analyticsLead: (goat) => (
      <>This site uses {goat}, an open-source, privacy-first analytics tool. GoatCounter:</>
    ),
    goatPoints: [
      <>Does {strong('not')} use cookies</>,
      <>Does {strong('not')} collect IP addresses or any personally identifiable information</>,
      <>Does {strong('not')} fingerprint devices or browsers</>,
      <>Collects only aggregate page view counts and referrer domains</>,
      <>Is GDPR and LGPD compliant by design, requiring no consent banner</>,
    ],
    dashboard: (link) => (
      <>
        The analytics dashboard is hosted at {link}. GoatCounter&apos;s own privacy policy applies
        to data processed by their service.
      </>
    ),
    rssTitle: 'RSS feed',
    rss: (link) => (
      <>
        This site provides an {link} for release announcements. Subscribing to the RSS feed does not
        send any data to us. Your RSS reader fetches the feed file directly from GitHub Pages.
      </>
    ),
    rssLink: 'RSS feed',
    thirdTitle: 'Third-party services',
    thirdLead: 'This site loads resources from:',
    githubPages: (
      <>
        {strong('GitHub Pages')} - the hosting provider. GitHub&apos;s privacy policy applies to
        page delivery.
      </>
    ),
    youtube: (
      <>
        {strong('YouTube')} - the recorded demo on the home page. The player loads from
        youtube-nocookie.com only when you press play; until then the page makes no request to
        YouTube. Once the video plays, Google&apos;s privacy policy applies to it.
      </>
    ),
    cliTitle: 'EGC itself (the CLI tool)',
    cli: (path, policy) => (
      <>
        The EGC tool installed on your machine is local-first. All state is stored in {path} on your
        device. Nothing leaves your machine unless you turn on the optional anonymous usage ping,
        which is off by default, asks once, and sends one hit per install, init or doctor run
        carrying only the EGC version and the operating system. See the {policy} for details.
      </>
    ),
    securityPolicy: 'Security policy',
    contactTitle: 'Contact',
    contact: (email, issues) => (
      <>
        Questions about this policy? Email {email} or open an issue at {issues}.
      </>
    ),
  },
  pt: {
    meta: {
      title: 'Política de privacidade',
      description:
        'Política de privacidade do EGCSite. Nenhum dado pessoal coletado. Sem cookies. Só as estatísticas do GoatCounter.',
    },
    eyebrow: 'Legal',
    title: 'Política de privacidade',
    dates: 'Em vigor desde 16 de junho de 2026. Última atualização: 20 de setembro de 2026.',
    intro: (site, egc) => (
      <>
        Este site ({site}) é o site oficial de documentação e divulgação do {egc}, um projeto de
        código aberto. Esta política explica quais dados são coletados quando você visita este site.
      </>
    ),
    tldr: [
      'Nenhum dado pessoal coletado',
      'Sem cookies, sem pixels de rastreamento, sem fingerprinting',
      'Nenhuma conta ou cadastro necessário',
      'As estatísticas são só agregadas e feitas com privacidade em primeiro lugar',
      'Nenhum dado é vendido ou compartilhado com terceiros',
    ],
    collectTitle: 'O que coletamos',
    collect: (none) => (
      <>
        Não coletamos {none}. Não há formulários, login, cadastro em newsletter nem contas de
        usuário neste site.
      </>
    ),
    analyticsTitle: 'Estatísticas de acesso',
    analyticsLead: (goat) => (
      <>
        Este site usa o {goat}, uma ferramenta de estatísticas de código aberto que põe a
        privacidade em primeiro lugar. O GoatCounter:
      </>
    ),
    goatPoints: [
      <>{strong('Não')} usa cookies</>,
      <>{strong('Não')} coleta endereços IP nem qualquer informação que identifique uma pessoa</>,
      <>{strong('Não')} faz fingerprinting de dispositivos ou navegadores</>,
      <>Coleta só contagens agregadas de visualizações de página e os domínios de origem</>,
      <>
        Está em conformidade com o GDPR e a LGPD desde a concepção, sem precisar de aviso de
        consentimento
      </>,
    ],
    dashboard: (link) => (
      <>
        O painel de estatísticas fica em {link}. A política de privacidade do próprio GoatCounter se
        aplica aos dados processados pelo serviço dele.
      </>
    ),
    rssTitle: 'Feed RSS',
    rss: (link) => (
      <>
        Este site oferece um {link} para os anúncios de releases. Assinar o feed RSS não nos envia
        nenhum dado. Seu leitor de RSS baixa o arquivo do feed direto do GitHub Pages.
      </>
    ),
    rssLink: 'feed RSS',
    thirdTitle: 'Serviços de terceiros',
    thirdLead: 'Este site carrega recursos de:',
    githubPages: (
      <>
        {strong('GitHub Pages')} - o provedor de hospedagem. A política de privacidade do GitHub se
        aplica à entrega das páginas.
      </>
    ),
    youtube: (
      <>
        {strong('YouTube')} - a demonstração gravada na página inicial. O player é carregado de
        youtube-nocookie.com só quando você aperta o play; até lá, a página não faz nenhuma
        requisição ao YouTube. Quando o vídeo toca, a política de privacidade do Google se aplica a
        ele.
      </>
    ),
    cliTitle: 'O próprio EGC (a ferramenta de linha de comando)',
    cli: (path, policy) => (
      <>
        A ferramenta EGC instalada na sua máquina é local primeiro. Todo o estado fica guardado em{' '}
        {path} no seu dispositivo. Nada sai da sua máquina, a menos que você ative o ping anônimo de
        uso opcional, que vem desligado por padrão, pergunta uma vez e envia um único registro por
        execução do install, do init ou do doctor, levando só a versão do EGC e o sistema
        operacional. Veja a {policy} para mais detalhes.
      </>
    ),
    securityPolicy: 'Política de segurança',
    contactTitle: 'Contato',
    contact: (email, issues) => (
      <>
        Dúvidas sobre esta política? Escreva para {email} ou abra uma issue em {issues}.
      </>
    ),
  },
};

export function privacyMetadata(lang: Lang) {
  return COPY[lang].meta;
}

export default function Privacy({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <DocsShell current="privacy" lang={lang}>
      <div className="pb-2 mb-8 border-b border-gray-200 dark:border-gray-800">
        <p className="text-xs font-semibold uppercase tracking-widest text-egc-600 dark:text-egc-400 mb-2">
          {t.eyebrow}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          {t.title}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{t.dates}</p>
      </div>

      <section className="mb-10 prose prose-sm dark:prose-invert max-w-none">
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
          {t.intro(
            strong('fmarzochi.github.io/EGCSite'),
            <External href="https://github.com/Fmarzochi/EGC">
              EGC - Extended Global Context
            </External>,
          )}
        </p>

        {/* TL;DR card */}
        <div className="rounded-xl border border-egc-500/20 bg-egc-500/5 dark:bg-egc-500/10 p-5 mb-8">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">TL;DR</h2>
          <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
            {t.tldr.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-egc-500 mt-0.5 shrink-0">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>

        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{t.collectTitle}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
          {t.collect(strong(lang === 'pt' ? 'nenhum dado pessoal' : 'no personal data'))}
        </p>

        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{t.analyticsTitle}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
          {t.analyticsLead(<External href="https://www.goatcounter.com">GoatCounter</External>)}
        </p>
        <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400 mb-4 ml-4">
          {t.goatPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="shrink-0">-</span> {point}
            </li>
          ))}
        </ul>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
          {t.dashboard(<External href="https://egc.goatcounter.com">egc.goatcounter.com</External>)}
        </p>

        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{t.rssTitle}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
          {t.rss(
            <a href={withBase('rss.xml')} className={linkClass}>
              {t.rssLink}
            </a>,
          )}
        </p>

        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{t.thirdTitle}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
          {t.thirdLead}
        </p>
        <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400 mb-6 ml-4">
          <li className="flex items-start gap-2">
            <span className="shrink-0">-</span> {t.githubPages}
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">-</span> {t.youtube}
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{t.cliTitle}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
          {t.cli(
            <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">
              ~/.egc/
            </code>,
            <External href="https://github.com/Fmarzochi/EGC/blob/main/.github/SECURITY.md">
              {t.securityPolicy}
            </External>,
          )}
        </p>

        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{t.contactTitle}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {t.contact(
            <a href="mailto:fmarzochi@gmail.com" className={linkClass}>
              fmarzochi@gmail.com
            </a>,
            <External href="https://github.com/Fmarzochi/EGCSite/issues">
              github.com/Fmarzochi/EGCSite
            </External>,
          )}
        </p>
      </section>
    </DocsShell>
  );
}
