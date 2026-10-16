import type { ReactNode } from 'react';
import Link from 'next/link';
import DocsShell from '@/components/docs/DocsShell';
import {
  INTEGRATIONS_PT,
  SUPPORT_LEVEL_LABEL_PT,
  SUPPORT_LEVEL_SUMMARY_PT,
} from '@/data/integrations-pt';
import {
  integrations,
  SUPPORT_LEVEL_LABEL,
  SUPPORT_LEVEL_SUMMARY,
  type Integration,
} from '@/data/integrations';
import { withBase } from '@/lib/base';
import type { Lang } from '@/lib/lang';
import { localePath } from '@/lib/site-i18n';

// One page per tool in both languages: one markup, texts per language. Ported from
// src/pages/integrations/[slug].astro (English); the Portuguese texts are a translation of it,
// with the per-tool texts in data/integrations-pt.ts.

const codeClass = 'font-mono text-egc-700 dark:text-egc-400';

interface Copy {
  title: (name: string) => string;
  description: (name: string, others: number) => string;
  eyebrow: string;
  heading: (name: string) => string;
  levelLabel: typeof SUPPORT_LEVEL_LABEL;
  levelSummary: typeof SUPPORT_LEVEL_SUMMARY;
  howLevels: string;
  installTitle: string;
  installLead: (name: string, init: ReactNode) => ReactNode;
  library: (name: string, all: ReactNode, one: ReactNode) => ReactNode;
  getsTitle: (name: string) => string;
  memory: (name: string) => string;
  meshWithSignal: (signal: string) => string;
  meshWithout: (name: string) => string;
  guardian: (hooks: string) => string;
  crusher: string;
  whereTitle: string;
  rows: [string, string, string];
  specLead: (spec: ReactNode) => ReactNode;
  spec: string;
  shareTitle: (name: string) => string;
  shareLead: (name: string) => string;
}

const COPY: Record<Lang, Copy> = {
  en: {
    title: (name) => `EGC for ${name}: one memory shared with every AI coding tool`,
    description: (name, others) =>
      `Give ${name} the same persistent memory, guardrails and context as ${others} other AI coding tools. One local install, encrypted on your machine, nothing sent to a cloud.`,
    eyebrow: 'Integrations',
    heading: (name) => `EGC for ${name}`,
    levelLabel: SUPPORT_LEVEL_LABEL,
    levelSummary: SUPPORT_LEVEL_SUMMARY,
    howLevels: 'How support levels work',
    installTitle: 'Install',
    installLead: (name, init) => (
      <>
        One command sets up the engine for {name} and every other tool it detects. Then run {init}{' '}
        once in each project you want EGC to manage.
      </>
    ),
    library: (name, all, one) => (
      <>
        The prompt library (agents, skills, commands and rules) is optional and off by default. Add
        it to every detected tool with {all}, or to {name} alone with {one}.
      </>
    ),
    getsTitle: (name) => `What ${name} gets`,
    memory: (name) =>
      `Decisions, session context, working memory and lessons captured in ${name} are available in every other tool you open, and the other way around. Encrypted at rest, kept per project and branch, never committed.`,
    meshWithSignal: (signal) =>
      `Open sessions announce themselves, claim the files they edit and exchange events on a local bus. ${signal}`,
    meshWithout: (name) =>
      `Open sessions announce themselves, claim the files they edit and exchange events on a local bus; ${name} reads the bus through the memory protocol, and through the MCP tools where they are registered.`,
    guardian: (hooks) =>
      `Command validation and write gating by egc-guardian: through its MCP tools where they are registered, and through the tool's own hooks where it has them. ${hooks}`,
    crusher:
      'Shell output is compressed before it reaches the model, with every error and warning kept and a local ledger of what it saved. Where the tool has no hook that rewrites commands, the PATH-level shim (egc crusher-shim) covers git, npm, gh and the rest.',
    whereTitle: 'Where EGC installs',
    rows: ['Target id', 'Files', 'MCP servers'],
    specLead: (spec) => <>The full map of how each tool integrates lives in the {spec}.</>,
    spec: 'integration tiers spec',
    shareTitle: (name) => `Share memory between ${name} and`,
    shareLead: (name) =>
      `Every tool below reads and writes the same memory as ${name}. Open two of them side by side and the second already knows what the first decided.`,
  },
  pt: {
    title: (name) =>
      `EGC para ${name}: uma memória compartilhada com todas as ferramentas de programação com IA`,
    description: (name, others) =>
      `Dê ao ${name} a mesma memória persistente, as mesmas proteções e o mesmo contexto de outras ${others} ferramentas de programação com IA. Uma instalação local, criptografada na sua máquina, nada enviado para a nuvem.`,
    eyebrow: 'Integrações',
    heading: (name) => `EGC para ${name}`,
    levelLabel: SUPPORT_LEVEL_LABEL_PT,
    levelSummary: SUPPORT_LEVEL_SUMMARY_PT,
    howLevels: 'Como funcionam os níveis de suporte',
    installTitle: 'Instalação',
    installLead: (name, init) => (
      <>
        Um comando prepara o motor para o {name} e para todas as outras ferramentas que ele
        detectar. Depois rode {init} uma vez em cada projeto que você quer que o EGC gerencie.
      </>
    ),
    library: (name, all, one) => (
      <>
        A biblioteca de prompts (agents, skills, commands e rules) é opcional e vem desligada.
        Adicione em todas as ferramentas detectadas com {all}, ou só no {name} com {one}.
      </>
    ),
    getsTitle: (name) => `O que o ${name} ganha`,
    memory: (name) =>
      `Decisões, contexto da sessão, memória de trabalho e lições registradas no ${name} ficam disponíveis em todas as outras ferramentas que você abrir, e vice-versa. Criptografado em repouso, separado por projeto e por branch, nunca commitado.`,
    meshWithSignal: (signal) =>
      `As sessões abertas se anunciam, reservam os arquivos que editam e trocam eventos num barramento local. ${signal}`,
    meshWithout: (name) =>
      `As sessões abertas se anunciam, reservam os arquivos que editam e trocam eventos num barramento local; o ${name} lê o barramento pelo protocolo de memória, e pelas ferramentas MCP onde elas estão registradas.`,
    guardian: (hooks) =>
      `Validação de comandos e controle de gravações pelo egc-guardian: pelas ferramentas MCP dele onde estão registradas, e pelos hooks da própria ferramenta onde ela os tem. ${hooks}`,
    crusher:
      'A saída do terminal é comprimida antes de chegar ao modelo, mantendo todo erro e aviso, com um livro-caixa local do que foi economizado. Onde a ferramenta não tem um hook que reescreva comandos, o shim no nível do PATH (egc crusher-shim) cobre git, npm, gh e o resto.',
    whereTitle: 'Onde o EGC instala',
    rows: ['Id do destino', 'Arquivos', 'Servidores MCP'],
    specLead: (spec) => <>O mapa completo de como cada ferramenta se integra está na {spec}.</>,
    spec: 'especificação dos tiers de integração',
    shareTitle: (name) => `Compartilhe a memória entre o ${name} e`,
    shareLead: (name) =>
      `Todas as ferramentas abaixo leem e gravam a mesma memória que o ${name}. Abra duas lado a lado e a segunda já sabe o que a primeira decidiu.`,
  },
};

/** The texts of one tool in `lang`; English when a translation is missing. */
function toolText(integration: Integration, lang: Lang) {
  const pt = lang === 'pt' ? INTEGRATIONS_PT[integration.slug] : undefined;
  return pt ?? integration;
}

export function findIntegration(slug: string) {
  return integrations.find((entry) => entry.slug === slug);
}

export function integrationMetadata(integration: Integration, lang: Lang) {
  const t = COPY[lang];
  const others = integrations.length - 1;
  return { title: t.title(integration.name), description: t.description(integration.name, others) };
}

export function integrationParams() {
  return integrations.map((integration) => ({ slug: integration.slug }));
}

export default function IntegrationDetail({
  integration,
  lang,
}: {
  integration: Integration;
  lang: Lang;
}) {
  const t = COPY[lang];
  const text = toolText(integration, lang);
  const others = integrations.filter((entry) => entry.slug !== integration.slug);
  const { description } = integrationMetadata(integration, lang);
  const levelClass =
    integration.level === 'core'
      ? 'bg-egc-100 text-egc-800 dark:bg-egc-900/40 dark:text-egc-300'
      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  const faculties = [
    {
      name: 'Memory',
      label: lang === 'pt' ? 'Memória' : 'Memory',
      text: t.memory(integration.name),
    },
    {
      name: 'Session Mesh',
      label: lang === 'pt' ? 'Malha de sessões' : 'Session Mesh',
      text: text.meshSignal ? t.meshWithSignal(text.meshSignal) : t.meshWithout(integration.name),
    },
    { name: 'Guardian', label: 'Guardian', text: t.guardian(text.hooks) },
    { name: 'Token Crusher', label: 'Token Crusher', text: t.crusher },
  ];

  return (
    <DocsShell current="integrations" lang={lang}>
      <div className="pb-2 mb-8 border-b border-gray-200 dark:border-gray-800">
        <p className="text-xs font-semibold uppercase tracking-widest text-egc-600 dark:text-egc-400 mb-2">
          {t.eyebrow}
        </p>
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-xl bg-white shadow-lg shadow-black/5 dark:shadow-black/20 flex items-center justify-center shrink-0">
            <img
              src={withBase(`tools/${integration.icon}`)}
              alt=""
              aria-hidden="true"
              className="w-8 h-8 object-contain"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {t.heading(integration.name)}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${levelClass}`}
        >
          {t.levelLabel[integration.level]}
        </span>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {t.levelSummary[integration.level]}{' '}
          <a
            href="https://github.com/Fmarzochi/EGC/blob/main/docs/governance/support-levels.md"
            className="underline hover:text-egc-600 dark:hover:text-egc-400"
          >
            {t.howLevels}
          </a>
          .
        </p>
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.installTitle}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {t.installLead(integration.name, <code className={codeClass}>egc init</code>)}
        </p>
        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 mb-3">
          <pre className="bg-gray-900 p-4 sm:p-5 text-xs sm:text-sm font-mono overflow-x-auto m-0 rounded-none text-gray-100">
            <code>{'npm install -g @egchq/egc && egc install\ncd your-project && egc init'}</code>
          </pre>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t.library(
            integration.name,
            <code className={codeClass}>egc install --prompt-library</code>,
            <code className={codeClass}>
              egc install --target {integration.targetId} --profile full
            </code>,
          )}
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {t.getsTitle(integration.name)}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {faculties.map((faculty) => (
            <div
              key={faculty.name}
              className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{faculty.label}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{faculty.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.whereTitle}</h2>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-x-auto">
          <table className="w-full text-sm min-w-[480px]">
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              <tr className="bg-white dark:bg-gray-950">
                <th
                  scope="row"
                  className="px-5 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 w-40"
                >
                  {t.rows[0]}
                </th>
                <td className="px-5 py-3 font-mono text-xs text-egc-700 dark:text-egc-400">
                  {integration.targetId}
                </td>
              </tr>
              <tr className="bg-white dark:bg-gray-950">
                <th
                  scope="row"
                  className="px-5 py-3 text-left font-semibold text-gray-700 dark:text-gray-300"
                >
                  {t.rows[1]}
                </th>
                <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{text.installs}</td>
              </tr>
              <tr className="bg-white dark:bg-gray-950">
                <th
                  scope="row"
                  className="px-5 py-3 text-left font-semibold text-gray-700 dark:text-gray-300"
                >
                  {t.rows[2]}
                </th>
                <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{text.mcp}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
          {t.specLead(
            <a
              href="https://github.com/Fmarzochi/EGC/blob/main/docs/spec/integration-tiers.md"
              className="underline hover:text-egc-600 dark:hover:text-egc-400"
            >
              {t.spec}
            </a>,
          )}
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {t.shareTitle(integration.name)}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {t.shareLead(integration.name)}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {others.map((other) => (
            <Link
              prefetch={false}
              key={other.slug}
              href={localePath(lang, `/integrations/${other.slug}/`)}
              className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 hover:border-egc-500/60 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-white shadow shadow-black/5 flex items-center justify-center shrink-0">
                <img
                  src={withBase(`tools/${other.icon}`)}
                  alt=""
                  aria-hidden="true"
                  className="w-5 h-5 object-contain"
                  loading="lazy"
                />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-tight">
                {other.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </DocsShell>
  );
}
