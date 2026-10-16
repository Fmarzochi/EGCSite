import type { ReactNode } from 'react';
import Link from 'next/link';
import DocsShell from '@/components/docs/DocsShell';
import { SUPPORT_LEVEL_LABEL_PT } from '@/data/integrations-pt';
import { integrations, SUPPORT_LEVEL_LABEL, type SupportLevel } from '@/data/integrations';
import { withBase } from '@/lib/base';
import type { Lang } from '@/lib/lang';
import { localePath } from '@/lib/site-i18n';

// The integrations index in both languages: one markup, texts per language. Ported from
// src/pages/integrations/index.astro (English); the Portuguese texts are a translation of it.

interface Copy {
  meta: { title: string; description: string };
  eyebrow: string;
  title: string;
  lead: string;
  levels: Record<SupportLevel, string>;
  notes: Record<SupportLevel, string>;
  footer: (governance: ReactNode, spec: ReactNode) => ReactNode;
  governance: string;
  spec: string;
}

const n = integrations.length;

// The tool counts follow data/integrations.ts; the description names five tools before "and N other".
const COPY: Record<Lang, Copy> = {
  en: {
    meta: {
      title: `Integrations: EGC in ${n} AI coding tools`,
      description: `One shared memory across Claude Code, Cursor, Codex, OpenCode, Antigravity and ${n - 5} other AI coding tools. Pick your tool to see what EGC installs, where, and what it guarantees.`,
    },
    eyebrow: 'Integrations',
    title: `One brain, ${n} AI coding tools`,
    lead: 'Every tool gets the memory protocol and the session bus; the two local MCP servers are registered in the ten tools EGC writes MCP config for today. Pick yours to see what EGC installs, where it goes, and how native hooks decide what Guardian and the Token Crusher can do inside it.',
    levels: SUPPORT_LEVEL_LABEL,
    notes: {
      core: 'The maintainer or an area steward runs these daily; a regression caused by a vendor change is fixed before the next release.',
      community:
        'Installed, registered and tested in CI like the core tools; a vendor change that breaks one waits for a report or a pull request.',
    },
    footer: (governance, spec) => (
      <>
        Support levels are defined in {governance}; the integration mechanics per tool are in the{' '}
        {spec}.
      </>
    ),
    governance: 'the governance docs',
    spec: 'integration tiers spec',
  },
  pt: {
    meta: {
      title: `Integrações: o EGC em ${n} ferramentas de programação com IA`,
      description: `Uma memória compartilhada entre Claude Code, Cursor, Codex, OpenCode, Antigravity e outras ${n - 5} ferramentas de programação com IA. Escolha a sua para ver o que o EGC instala, onde e o que ele garante.`,
    },
    eyebrow: 'Integrações',
    title: `Um cérebro, ${n} ferramentas de programação com IA`,
    lead: 'Toda ferramenta recebe o protocolo de memória e o barramento de sessões; os dois servidores MCP locais são registrados nas dez ferramentas para as quais o EGC grava configuração de MCP hoje. Escolha a sua para ver o que o EGC instala, onde fica e como os hooks nativos decidem o que o Guardian e o Token Crusher podem fazer dentro dela.',
    levels: SUPPORT_LEVEL_LABEL_PT,
    notes: {
      core: 'O mantenedor ou um responsável pela área usa estas todo dia; uma regressão causada por mudança do fabricante é corrigida antes da próxima release.',
      community:
        'Instaladas, registradas e testadas no CI como as principais; uma mudança do fabricante que quebre alguma delas espera um relato ou um pull request.',
    },
    footer: (governance, spec) => (
      <>
        Os níveis de suporte estão definidos {governance}; o funcionamento da integração de cada
        ferramenta está na {spec}.
      </>
    ),
    governance: 'na documentação de governança',
    spec: 'especificação dos tiers de integração',
  },
};

export function integrationsMetadata(lang: Lang) {
  return COPY[lang].meta;
}

const LEVELS: SupportLevel[] = ['core', 'community'];

export default function Integrations({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <DocsShell current="integrations" lang={lang}>
      <div className="pb-2 mb-8 border-b border-gray-200 dark:border-gray-800">
        <p className="text-xs font-semibold uppercase tracking-widest text-egc-600 dark:text-egc-400 mb-2">
          {t.eyebrow}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          {t.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{t.lead}</p>
      </div>

      {LEVELS.map((level) => (
        <section key={level} className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {t.levels[level]}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t.notes[level]}</p>
          <div className="integrations-list">
            {integrations
              .filter((entry) => entry.level === level)
              .map((entry) => (
                <Link
                  prefetch={false}
                  key={entry.slug}
                  href={localePath(lang, `/integrations/${entry.slug}/`)}
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
                    <span className="sr-only">, {t.levels[level]}</span>
                  </span>
                </Link>
              ))}
          </div>
        </section>
      ))}

      <p className="text-xs text-gray-500 dark:text-gray-400">
        {t.footer(
          <a
            href="https://github.com/Fmarzochi/EGC/blob/main/docs/governance/support-levels.md"
            className="underline hover:text-egc-600 dark:hover:text-egc-400"
          >
            {t.governance}
          </a>,
          <a
            href="https://github.com/Fmarzochi/EGC/blob/main/docs/spec/integration-tiers.md"
            className="underline hover:text-egc-600 dark:hover:text-egc-400"
          >
            {t.spec}
          </a>,
        )}
      </p>
    </DocsShell>
  );
}
