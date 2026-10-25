import type { ReactNode } from 'react';
import Link from 'next/link';
import DocsSection from '@/components/docs/DocsSection';
import DocsShell from '@/components/docs/DocsShell';
import type { Lang } from '@/lib/lang';
import { localePath } from '@/lib/site-i18n';

// The MCP overview page in both languages: one markup, texts per language. Ported from
// src/pages/docs/mcp.astro (English); the Portuguese texts are a translation of it.
// The mcp.json sample stays as egc init writes it.

const MEMORY_TOOLS = [
  'get_state',
  'update_state',
  'store_decision',
  'query_history',
  'search_history',
  'working_memory_set',
  'working_memory_get',
  'working_memory_list',
  'lesson_save',
  'lesson_recall',
  'lesson_reinforce',
  'detect_patterns',
  'compress_observations',
  'get_project_state',
  'session_announce',
  'session_peers',
  'session_send',
  'session_events',
  'session_wait',
  'claim_path',
  'release_path',
  'team_init',
  'team_sync',
  'team_status',
];

const GUARDIAN_TOOLS = [
  'validate_command',
  'validate_write',
  'validate_content',
  'reduce_context',
  'orchestrate_task',
  'rank_files',
  'prepare_handoff',
  'auto_learn',
];

const MCP_JSON =
  '\n{\n  "mcpServers": {\n    "egc-memory": {\n      "command": "node",\n      "args": ["<npm global prefix>/node_modules/@egchq/egc/mcp/servers/egc-memory/build/index.js"]\n    },\n    "egc-guardian": {\n      "command": "node",\n      "args": ["<npm global prefix>/node_modules/@egchq/egc/mcp/servers/egc-guardian/build/index.js"]\n    }\n  }\n}';

interface Copy {
  meta: { title: string; description: string };
  eyebrow: string;
  title: string;
  lead: string;
  memorySub: string;
  guardianSub: string;
  readDocs: string;
  transportTitle: string;
  transportLead: (stdio: ReactNode) => ReactNode;
  mcpComment: string;
  localTitle: string;
  local: { icon: string; title: string; desc: string }[];
}

const COPY: Record<Lang, Copy> = {
  en: {
    meta: {
      title: 'MCP Servers',
      description: 'Overview of the two MCP servers that power EGC: egc-memory and egc-guardian.',
    },
    eyebrow: 'MCP Servers',
    title: 'MCP Overview',
    lead: 'EGC runs two local MCP servers over stdio. Both ship prebuilt inside the npm package and are registered by egc init and the installers in 24 of the 29 tools (23 through their user-level config, Devin Desktop through the project file); CodeBuddy, Trae, Aider and Cline reach the same memory through the protocol files, and Letta Code gets the skills alone.',
    memorySub: 'Persistent project memory',
    guardianSub: 'Validation and safety layer',
    readDocs: 'Read docs →',
    transportTitle: 'Transport',
    transportLead: (stdio) => (
      <>
        Both servers communicate over {stdio}. Each AI tool spawns them as child processes when a
        session starts. No daemon, no ports, no network exposure.
      </>
    ),
    mcpComment:
      '// mcp.json as written by egc init (Cursor shown; Claude Code is registered through its own CLI)',
    localTitle: 'Local-first',
    local: [
      {
        icon: '🔒',
        title: 'No cloud',
        desc: 'All state stays on your machine. Nothing is sent to external servers.',
      },
      {
        icon: '📁',
        title: 'Yours to read',
        desc: 'State is Markdown, encrypted at rest and owned by the server: egc export prints it decrypted, and deleting a state file resets that project.',
      },
      {
        icon: '⚡',
        title: 'Fast startup',
        desc: 'Stdio transport means near-zero latency. Both servers start in under 100ms.',
      },
    ],
  },
  pt: {
    meta: {
      title: 'Servidores MCP',
      description:
        'Visão geral dos dois servidores MCP que fazem o EGC funcionar: egc-memory e egc-guardian.',
    },
    eyebrow: 'Servidores MCP',
    title: 'Visão geral do MCP',
    lead: 'O EGC roda dois servidores MCP locais por stdio. Os dois vêm prontos dentro do pacote npm e são registrados pelo egc init e pelos instaladores em 24 das 29 ferramentas (23 pela configuração do usuário, o Devin Desktop pelo arquivo do projeto); CodeBuddy, Trae, Aider e Cline chegam à mesma memória pelos arquivos de protocolo, e o Letta Code recebe só as skills.',
    memorySub: 'Memória persistente do projeto',
    guardianSub: 'Camada de validação e segurança',
    readDocs: 'Ler a documentação →',
    transportTitle: 'Transporte',
    transportLead: (stdio) => (
      <>
        Os dois servidores se comunicam por {stdio}. Cada ferramenta de IA os inicia como processos
        filhos quando a sessão começa. Sem daemon, sem portas, sem exposição na rede.
      </>
    ),
    mcpComment:
      '// mcp.json como o egc init grava (exemplo do Cursor; o Claude Code é registrado pela própria CLI)',
    localTitle: 'Local primeiro',
    local: [
      {
        icon: '🔒',
        title: 'Sem nuvem',
        desc: 'Todo o estado fica na sua máquina. Nada é enviado a servidores externos.',
      },
      {
        icon: '📁',
        title: 'Seu para ler',
        desc: 'O estado é Markdown, criptografado em repouso e mantido pelo servidor: egc export mostra o conteúdo descriptografado, e apagar um arquivo de estado zera aquele projeto.',
      },
      {
        icon: '⚡',
        title: 'Início rápido',
        desc: 'O transporte por stdio tem latência quase zero. Os dois servidores sobem em menos de 100 ms.',
      },
    ],
  },
};

export function mcpMetadata(lang: Lang) {
  return COPY[lang].meta;
}

export default function Mcp({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <DocsShell current="mcp" lang={lang}>
      <div className="pb-2 mb-8 border-b border-gray-200 dark:border-gray-800">
        <p className="text-xs font-semibold uppercase tracking-widest text-egc-600 dark:text-egc-400 mb-2">
          {t.eyebrow}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          {t.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{t.lead}</p>
      </div>

      <section className="mb-10">
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href={localePath(lang, '/docs/memory/')}
            className="block rounded-xl border border-[#10B866]/30 bg-[#141816] p-6 hover:border-[#3DF59A]/60 transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#10B866]/15 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-[#3DF59A]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"
                  />
                </svg>
              </div>
              <div>
                <h2 className="font-bold text-[#F3F6F4] font-mono">egc-memory</h2>
                <p className="text-xs text-[#A3ADA7]">{t.memorySub}</p>
              </div>
            </div>
            <div className="space-y-1.5 mb-4">
              {MEMORY_TOOLS.map((name) => (
                <div key={name} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B866] shrink-0" />{' '}
                  <code className="text-xs font-mono text-[#F3F6F4]">{name}</code>
                </div>
              ))}
            </div>
            <span className="text-xs font-semibold text-[#3DF59A]">{t.readDocs}</span>
          </Link>{' '}
          <Link
            href={localePath(lang, '/docs/guardian/')}
            className="block rounded-xl border border-[#1E2421] bg-[#141816] p-6 hover:border-white/30 transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-[#A3ADA7]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white font-mono">egc-guardian</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t.guardianSub}</p>
              </div>
            </div>
            <div className="space-y-1.5 mb-4">
              {GUARDIAN_TOOLS.map((name) => (
                <div key={name} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-600" />{' '}
                  <code className="text-xs font-mono text-gray-700 dark:text-gray-300">{name}</code>
                </div>
              ))}
            </div>
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
              {t.readDocs}
            </span>
          </Link>
        </div>
      </section>

      <DocsSection title={t.transportTitle} open>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {t.transportLead(<strong className="text-gray-900 dark:text-white">stdio</strong>)}
        </p>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <pre className="bg-gray-900 p-5 text-sm font-mono text-gray-300 overflow-x-auto m-0 rounded-none">
            <code>
              <span className="text-gray-400">{t.mcpComment}</span>
              {MCP_JSON}
            </code>
          </pre>
        </div>
      </DocsSection>

      <DocsSection title={t.localTitle}>
        <div className="grid sm:grid-cols-3 gap-4">
          {t.local.map((card) => (
            <div
              key={card.icon}
              className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5"
            >
              <div className="text-2xl mb-3">{card.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                {card.title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">{card.desc}</p>
            </div>
          ))}
        </div>
      </DocsSection>
    </DocsShell>
  );
}
