import { Fragment } from 'react';
import DocsSection from '@/components/docs/DocsSection';
import DocsShell from '@/components/docs/DocsShell';
import type { Lang } from '@/lib/lang';

// The Security page in both languages: one markup, texts per language. Ported from
// src/pages/docs/security.astro (English); the Portuguese texts are a translation of it.

const BADGES = [
  {
    href: 'https://www.bestpractices.dev/projects/13099',
    label: 'OpenSSF Best Practices',
    src: 'https://www.bestpractices.dev/projects/13099/badge',
    alt: 'OpenSSF Best Practices',
    width: '184',
  },
  {
    href: 'https://securityscorecards.dev/viewer/?uri=github.com/Fmarzochi/EGC',
    label: 'OpenSSF Scorecard',
    src: 'https://img.shields.io/ossf-scorecard/github.com/Fmarzochi/EGC?label=openssf+scorecard&style=flat',
    alt: 'OpenSSF Scorecard',
    width: '136',
  },
  {
    href: 'https://sonarcloud.io/project/overview?id=Fmarzochi_EGC',
    label: 'SonarCloud quality gate',
    src: 'https://sonarcloud.io/api/project_badges/measure?project=Fmarzochi_EGC&metric=alert_status',
    alt: 'SonarCloud Quality Gate',
    width: '148',
  },
  {
    href: 'https://github.com/Fmarzochi/EGC/actions/workflows/codeql.yml',
    label: 'CodeQL status',
    src: 'https://img.shields.io/github/actions/workflow/status/Fmarzochi/EGC/codeql.yml?branch=main&label=CodeQL&logo=github&style=flat',
    alt: 'CodeQL',
    width: '121',
  },
  {
    href: 'https://socket.dev/npm/package/@egchq/egc',
    label: 'Socket.dev supply chain score',
    src: 'https://img.shields.io/badge/socket.dev-monitored-3b82f6?style=flat',
    alt: 'Socket.dev supply chain monitoring',
    width: '136',
  },
];

const CARDS = [
  {
    title: 'CodeQL',
    icon: '🔍',
    href: 'https://github.com/Fmarzochi/EGC/actions/workflows/codeql.yml',
  },
  {
    title: 'SonarCloud',
    icon: '☁️',
    href: 'https://sonarcloud.io/project/overview?id=Fmarzochi_EGC',
  },
  { title: 'Dependabot', icon: '🤖', href: 'https://github.com/Fmarzochi/EGC/network/updates' },
  {
    title: 'Dependency Review',
    icon: '🔗',
    href: 'https://github.com/Fmarzochi/EGC/actions/workflows/dependency-review.yml',
  },
  { title: 'ClusterFuzzLite', icon: '💥', href: 'https://github.com/Fmarzochi/EGC/issues/910' },
  {
    title: 'OpenSSF Scorecard',
    icon: '🏆',
    href: 'https://securityscorecards.dev/viewer/?uri=github.com/Fmarzochi/EGC',
  },
  {
    title: 'OpenSSF Best Practices',
    icon: '✅',
    href: 'https://www.bestpractices.dev/projects/13099',
  },
  { title: 'Socket.dev', icon: '🔗', href: 'https://socket.dev/npm/package/@egchq/egc' },
  { title: 'DCO', icon: '✍️', href: 'https://github.com/Fmarzochi/EGC/actions/workflows/dco.yml' },
];

const IN_SCOPE = [
  'scripts/',
  'mcp/servers/',
  'scripts/install.sh, scripts/install.ps1',
  'hooks/, skills/',
];

interface Copy {
  meta: { title: string; description: string };
  eyebrow: string;
  title: string;
  lead: string;
  postureTitle: string;
  newTab: string;
  badgeLabels: Record<string, string>;
  cards: Record<string, string>;
  reportTitle: string;
  noPublic: string;
  noPublicWhy: string;
  advisory: string;
  email: string;
  timelineTitle: string;
  timeline: { label: string; time: string }[];
  scopeTitle: string;
  inScope: string;
  outScope: string;
  outOfScope: string[];
}

const COPY: Record<Lang, Copy> = {
  en: {
    meta: {
      title: 'Security',
      description:
        'EGC security posture: OpenSSF, CodeQL, SonarCloud, Dependency Review, ClusterFuzzLite, Dependabot, and vulnerability reporting.',
    },
    eyebrow: 'Reference',
    title: 'Security',
    lead: 'EGC maintains a layered security posture: static analysis, supply chain protection, continuous fuzzing, and community-driven scoring.',
    postureTitle: 'Security posture',
    newTab: '(opens in new tab)',
    badgeLabels: {
      'OpenSSF Best Practices': 'OpenSSF Best Practices',
      'OpenSSF Scorecard': 'OpenSSF Scorecard',
      'SonarCloud quality gate': 'SonarCloud quality gate',
      'CodeQL status': 'CodeQL status',
      'Socket.dev supply chain score': 'Socket.dev supply chain score',
    },
    cards: {
      CodeQL:
        'Static analysis on every PR and weekly scheduled scans. Covers JavaScript and TypeScript, Python, and the GitHub Actions workflows. Advanced query suite enabled.',
      SonarCloud:
        'Continuous code quality and security analysis. Tracks reliability, maintainability, and security hotspots on every push.',
      Dependabot:
        'Automated dependency update PRs. Grouped by ecosystem (npm). Security alerts and auto-dismissal of dev-only patches enabled.',
      'Dependency Review':
        'Every PR is scanned for newly introduced vulnerable or license-incompatible dependencies before merge.',
      ClusterFuzzLite:
        'Continuous fuzzing through ClusterFuzzLite on pull requests and on a weekly batch. The JavaScript harnesses have been active since the upstream blocker tracked in #910 was resolved in July 2026.',
      'OpenSSF Scorecard':
        'Weekly automated scoring across 20+ security checks: branch protection, signed releases, CI, token permissions, and more.',
      'OpenSSF Best Practices':
        'Best Practices badge passing, plus Baseline Levels 1, 2 and 3. Validates documentation, test coverage, vulnerability reporting process, and project hygiene.',
      'Socket.dev':
        'Supply chain protection on every PR touching package.json. Catches malicious packages, typosquatting, and obfuscated code before they reach the codebase.',
      DCO: 'Developer Certificate of Origin enforced on every commit. All contributors must sign off their changes.',
    },
    reportTitle: 'Reporting a vulnerability',
    noPublic: 'Do not open public GitHub issues for security vulnerabilities.',
    noPublicWhy: 'Public disclosure before a fix is available puts all users at risk.',
    advisory: 'Private GitHub Advisory',
    email: 'Email',
    timelineTitle: 'Response timeline',
    timeline: [
      { label: 'Acknowledgment', time: 'Within 72 hours' },
      { label: 'Status update', time: 'Within 14 days' },
      { label: 'Resolution or mitigation', time: 'Within 90 days of confirmed vulnerability' },
    ],
    scopeTitle: 'Scope',
    inScope: 'In scope',
    outScope: 'Out of scope',
    outOfScope: [
      'Third-party dependency vulnerabilities',
      'Issues requiring physical machine access',
      'DoS against local-only runtime',
      'Behaviors requiring write access to host',
    ],
  },
  pt: {
    meta: {
      title: 'Segurança',
      description:
        'A postura de segurança do EGC: OpenSSF, CodeQL, SonarCloud, Dependency Review, ClusterFuzzLite, Dependabot e como relatar vulnerabilidades.',
    },
    eyebrow: 'Referência',
    title: 'Segurança',
    lead: 'O EGC mantém a segurança em camadas: análise estática, proteção da cadeia de suprimentos, fuzzing contínuo e pontuação mantida pela comunidade.',
    postureTitle: 'Postura de segurança',
    newTab: '(abre em nova aba)',
    badgeLabels: {
      'OpenSSF Best Practices': 'OpenSSF Best Practices',
      'OpenSSF Scorecard': 'OpenSSF Scorecard',
      'SonarCloud quality gate': 'Quality gate do SonarCloud',
      'CodeQL status': 'Status do CodeQL',
      'Socket.dev supply chain score': 'Pontuação da cadeia de suprimentos no Socket.dev',
    },
    cards: {
      CodeQL:
        'Análise estática em todo PR e varreduras semanais agendadas. Cobre JavaScript e TypeScript, Python e os workflows do GitHub Actions. Conjunto avançado de consultas ativado.',
      SonarCloud:
        'Análise contínua de qualidade e segurança do código. Acompanha confiabilidade, manutenibilidade e pontos sensíveis de segurança a cada push.',
      Dependabot:
        'PRs automáticos de atualização de dependências, agrupados por ecossistema (npm). Alertas de segurança e descarte automático de correções só de desenvolvimento ativados.',
      'Dependency Review':
        'Todo PR é verificado, antes do merge, em busca de novas dependências vulneráveis ou com licença incompatível.',
      ClusterFuzzLite:
        'Fuzzing contínuo com o ClusterFuzzLite nos pull requests e numa rodada semanal. Os harnesses de JavaScript estão ativos desde que o bloqueio externo acompanhado na #910 foi resolvido, em julho de 2026.',
      'OpenSSF Scorecard':
        'Pontuação automática semanal em mais de 20 verificações de segurança: proteção de branch, releases assinadas, CI, permissões de token e mais.',
      'OpenSSF Best Practices':
        'Selo Best Practices aprovado, mais os Baseline Levels 1, 2 e 3. Verifica documentação, cobertura de testes, processo de relato de vulnerabilidades e a higiene do projeto.',
      'Socket.dev':
        'Proteção da cadeia de suprimentos em todo PR que mexe no package.json. Pega pacotes maliciosos, typosquatting e código ofuscado antes que cheguem ao código.',
      DCO: 'Developer Certificate of Origin exigido em todo commit. Todos os contribuidores precisam assinar as próprias mudanças.',
    },
    reportTitle: 'Como relatar uma vulnerabilidade',
    noPublic: 'Não abra issues públicas no GitHub para vulnerabilidades de segurança.',
    noPublicWhy: 'Divulgar publicamente antes de haver correção coloca todos os usuários em risco.',
    advisory: 'Advisory privado no GitHub',
    email: 'E-mail',
    timelineTitle: 'Prazos de resposta',
    timeline: [
      { label: 'Confirmação de recebimento', time: 'Em até 72 horas' },
      { label: 'Atualização de status', time: 'Em até 14 dias' },
      {
        label: 'Correção ou mitigação',
        time: 'Em até 90 dias após a vulnerabilidade ser confirmada',
      },
    ],
    scopeTitle: 'Escopo',
    inScope: 'Dentro do escopo',
    outScope: 'Fora do escopo',
    outOfScope: [
      'Vulnerabilidades em dependências de terceiros',
      'Problemas que exigem acesso físico à máquina',
      'DoS contra o runtime, que é só local',
      'Comportamentos que exigem acesso de escrita ao host',
    ],
  },
};

export function securityMetadata(lang: Lang) {
  return COPY[lang].meta;
}

export default function Security({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <DocsShell current="security" lang={lang}>
      <div className="pb-2 mb-8 border-b border-gray-200 dark:border-gray-800">
        <p className="text-xs font-semibold uppercase tracking-widest text-egc-600 dark:text-egc-400 mb-2">
          {t.eyebrow}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          {t.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{t.lead}</p>
      </div>

      {/* Badges */}
      <DocsSection title={t.postureTitle} open>
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {BADGES.map((badge, i) => (
            <Fragment key={badge.href}>
              {i > 0 && ' '}
              <a
                href={badge.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t.badgeLabels[badge.label]} ${t.newTab}`}
                className="inline-flex py-0.5 -my-0.5"
              >
                <img
                  src={badge.src}
                  alt={badge.alt}
                  className="h-6"
                  width={badge.width}
                  height="20"
                />
              </a>
            </Fragment>
          ))}
        </div>

        <div className="balanced-grid sm:[--cols:2] lg:[--cols:3]">
          {CARDS.map((card) => (
            <a
              key={card.title}
              href={card.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 hover:border-egc-500/50 dark:hover:border-egc-500/30 transition-colors"
            >
              <div className="text-2xl mb-3">{card.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 group-hover:text-egc-600 dark:group-hover:text-egc-400 transition-colors">
                {card.title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">{t.cards[card.title]}</p>
            </a>
          ))}
        </div>
      </DocsSection>

      {/* Reporting */}
      <DocsSection title={t.reportTitle}>
        <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-5 mb-5">
          <p className="text-sm text-red-800 dark:text-red-300 font-semibold mb-1">{t.noPublic}</p>
          <p className="text-sm text-red-700 dark:text-red-400">{t.noPublicWhy}</p>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
            <svg
              className="w-5 h-5 text-egc-600 dark:text-egc-400 shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                {t.advisory}
              </p>
              <a
                href="https://github.com/Fmarzochi/EGC/security/advisories/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block py-1 -my-1 text-sm text-egc-600 dark:text-egc-400 hover:underline"
              >
                github.com/Fmarzochi/EGC/security/advisories/new
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
            <svg
              className="w-5 h-5 text-egc-600 dark:text-egc-400 shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{t.email}</p>
              <a
                href="mailto:fmarzochi@gmail.com"
                className="inline-block py-1 -my-1 text-sm text-egc-600 dark:text-egc-400 hover:underline"
              >
                fmarzochi@gmail.com
              </a>
            </div>
          </div>
        </div>
      </DocsSection>

      {/* Timeline */}
      <DocsSection title={t.timelineTitle}>
        <div className="space-y-2">
          {t.timeline.map((row) => (
            <div
              key={row.label}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 sm:px-5 py-3"
            >
              <span className="text-sm font-medium text-gray-900 dark:text-white">{row.label}</span>{' '}
              <span className="text-sm text-egc-600 dark:text-egc-400 font-semibold">
                {row.time}
              </span>
            </div>
          ))}
        </div>
      </DocsSection>

      {/* Scope */}
      <DocsSection title={t.scopeTitle}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-[#10B866]/30 bg-[#141816] p-5">
            <h3 className="text-sm font-semibold text-[#3DF59A] mb-3 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-[#3DF59A]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>{' '}
              {t.inScope}
            </h3>
            <ul className="space-y-2 text-xs">
              {IN_SCOPE.map((s) => (
                <li key={s} className="font-mono text-[#F3F6F4] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3DF59A] shrink-0" />{' '}
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-[#1E2421] bg-[#141816] p-5">
            <h3 className="text-sm font-semibold text-[#A3ADA7] mb-3 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-[#8C9690]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>{' '}
              {t.outScope}
            </h3>
            <ul className="space-y-2 text-xs">
              {t.outOfScope.map((s) => (
                <li key={s} className="text-[#8C9690] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C9690]/40 shrink-0" />{' '}
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DocsSection>
    </DocsShell>
  );
}
