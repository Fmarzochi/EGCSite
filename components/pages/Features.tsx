import type { ReactNode } from 'react';
import DocsShell from '@/components/docs/DocsShell';
import { integrations } from '@/data/integrations';
import type { Lang } from '@/lib/lang';

// The Features page in both languages: one markup, texts per language. Ported from
// src/pages/features.astro (English); the Portuguese texts are a translation of it.

const codeClass = 'text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono';
const thClass = (align: 'left' | 'center') =>
  `px-5 py-3 text-${align} font-semibold text-gray-700 dark:text-gray-300`;

interface Copy {
  meta: { title: string; description: string };
  eyebrow: string;
  title: string;
  lead: string;
  coreTitle: string;
  coreLead: string;
  core: { title: string; desc: string; icon: string }[];
  libraryTitle: string;
  libraryLead: string;
  scrollHint: string;
  libraryLabel: string;
  libraryColumns: [string, string, string];
  library: { type: string; count: string; desc: string }[];
  libraryPaths: (paths: ReactNode) => ReactNode;
  toolsTitle: string;
  toolsLabel: string;
  toolsColumns: [string, string, string];
  context: string;
  providersTitle: string;
  providersLead: (resolver: ReactNode) => ReactNode;
  providersLabel: string;
  providersColumns: [string, string];
  vertex: string;
  openRouterMore: string;
  ollama: string;
}

const COPY: Record<Lang, Copy> = {
  en: {
    meta: {
      title: 'Features',
      description:
        'Full feature overview: persistent memory, prompt library, multi-tool support, security, and more.',
    },
    eyebrow: 'Getting Started',
    title: 'Features',
    lead: 'Everything EGC provides out of the box.',
    coreTitle: 'Core capabilities',
    coreLead: 'The runtime capabilities that keep context, sessions and tool behavior aligned.',
    core: [
      {
        title: 'Persistent memory',
        desc: 'State is saved at the end of each session and restored at the start. Decisions, preferences, and next steps survive window closes and tool switches.',
        icon: '🧠',
      },
      {
        title: 'Global memory',
        desc: 'A user-wide scope shared across every project: save transversal preferences and lessons once with scope global, and every session in every tool starts already knowing them. Project state always wins.',
        icon: '🌍',
      },
      {
        title: 'Token Crusher',
        desc: 'Shell output is compressed up to 90% before it reaches the model: long git logs, test noise and install spam shrink while errors always survive. egc saved reports your accumulated savings at zero token cost.',
        icon: '⚡',
      },
      {
        title: 'Real-time session mesh',
        desc: 'Parallel sessions announce presence, split territory, take fail-fast cooperative path locks, and exchange events delivered in real time: wake-on-write push is on by default, session_wait parks idle tabs until an event arrives, and tools with native hook surfaces get a turn-boundary notice the moment the shared bus moves.',
        icon: '🕸️',
      },
      {
        title: 'Commit privacy',
        desc: 'Populated memory never reaches a commit: pre-commit block, CI guard, and a git clean filter configured by egc init that stages a zeroed blob even when hooks are bypassed. Your context stays yours.',
        icon: '🔒',
      },
      {
        title: 'Bidirectional sync',
        desc: 'update_state propagates context to all 12 tool config files automatically. Run egc watch to also sync changes you make directly in any tool file back to state and to all other tools in real time.',
        icon: '🔄',
      },
      {
        title: 'Multi-tool',
        desc: `Works with ${integrations.length} AI coding tools. Install once and EGC sets up every tool you have installed with what it can read.`,
        icon: '🔌',
      },
      {
        title: 'Local-first',
        desc: 'All state stays on your machine at ~/.egc/, encrypted at rest with AES-256-GCM. Nothing is sent externally.',
        icon: '🔒',
      },
      {
        title: 'Zero config',
        desc: 'npm install -g @egchq/egc && egc install handles everything: detects your tools, registers the servers, bootstraps the protocol. The prompt library stays opt-in.',
        icon: '⚡',
      },
      {
        title: 'Guardian layer',
        desc: 'egc-guardian enforces safety at the harness level: every shell command and file write is validated before execution. UserPromptSubmit and PreToolUse hooks block dangerous patterns without AI behavioral calls.',
        icon: '🛡️',
      },
      {
        title: 'EGC Scrubber',
        desc: 'Content you own is cleaned of AI provenance marks automatically at write time: invisible Unicode carriers and long dashes are stripped, and AI co-authorship is removed from commit messages. An opt-in pass also strips provenance metadata from Markdown, HTML and SVG, from PNG and JPEG images, and from PDF Document Info dictionaries. Deterministic and fail-open, so a crash or binary input never blocks or corrupts a write. An opt-in statistical layer rewrites the prose to reduce token-sampling watermarks and measures how far the text moved: honestly best-effort, never claimed undetectable.',
        icon: '🧽',
      },
      {
        title: 'Decision history',
        desc: 'Every architectural decision is stored in SQLite with a timestamp. Query by date or tag.',
        icon: '📋',
      },
    ],
    libraryTitle: 'Prompt library',
    libraryLead:
      'Optional and off by default: the installer asks (default no), egc install --prompt-library adds it later, and the engine works exactly the same without it. Written from real experience, not generated.',
    scrollHint: 'Scroll the table horizontally for all columns.',
    libraryLabel: 'Prompt library quantities',
    libraryColumns: ['Type', 'Count', 'What it is'],
    library: [
      { type: 'Agents', count: '61', desc: 'Persona and behavior definitions' },
      { type: 'Skills', count: '232', desc: 'Domain-specific workflow runbooks' },
      { type: 'Commands', count: '77', desc: 'Command definitions and lifecycle hooks' },
      { type: 'Rules', count: '109', desc: 'Constraints and governance directives' },
    ],
    libraryPaths: (paths) => (
      <>
        Organized per harness: works in {paths}, and more. Switch tools and the same workflows
        follow you.
      </>
    ),
    toolsTitle: 'Supported tools',
    toolsLabel: 'Supported tools and bootstrap paths',
    toolsColumns: ['Tool', 'MCP', 'Bootstrap'],
    context: 'context',
    providersTitle: 'Supported LLM providers',
    providersLead: (resolver) => (
      <>
        EGC routes to any supported provider via {resolver}. Fallback chains degrade automatically
        when a model is unavailable.
      </>
    ),
    providersLabel: 'Supported LLM providers and models',
    providersColumns: ['Provider', 'Models'],
    vertex: 'Gemini through Google Cloud',
    openRouterMore: 'and more',
    ollama: 'local, offline',
  },
  pt: {
    meta: {
      title: 'Funções',
      description:
        'Visão completa das funções: memória persistente, biblioteca de prompts, suporte a várias ferramentas, segurança e mais.',
    },
    eyebrow: 'Primeiros passos',
    title: 'Funções',
    lead: 'Tudo o que o EGC entrega logo após a instalação.',
    coreTitle: 'Recursos principais',
    coreLead:
      'Os recursos do runtime que mantêm contexto, sessões e o comportamento das ferramentas alinhados.',
    core: [
      {
        title: 'Memória persistente',
        desc: 'O estado é salvo no fim de cada sessão e restaurado no início. Decisões, preferências e próximos passos sobrevivem ao fechar a janela e à troca de ferramenta.',
        icon: '🧠',
      },
      {
        title: 'Memória global',
        desc: 'Um escopo do usuário compartilhado por todos os projetos: salve uma vez, com scope global, as preferências e lições que valem para tudo, e toda sessão em toda ferramenta já começa sabendo. O estado do projeto sempre prevalece.',
        icon: '🌍',
      },
      {
        title: 'Token Crusher',
        desc: 'A saída do terminal é comprimida em até 90% antes de chegar ao modelo: git logs longos, ruído de testes e a poluição das instalações encolhem, e os erros sempre ficam. O egc saved mostra a economia acumulada sem gastar token.',
        icon: '⚡',
      },
      {
        title: 'Malha de sessões em tempo real',
        desc: 'Sessões paralelas anunciam presença, dividem território, pegam travas cooperativas de caminho que falham na hora e trocam eventos entregues em tempo real: o push ao gravar vem ligado por padrão, o session_wait deixa abas ociosas esperando até chegar um evento, e ferramentas com hooks nativos recebem um aviso na virada do turno assim que o barramento compartilhado muda.',
        icon: '🕸️',
      },
      {
        title: 'Privacidade nos commits',
        desc: 'Memória preenchida nunca chega a um commit: bloqueio no pre-commit, guarda no CI e um filtro clean do git, configurado pelo egc init, que coloca no stage um blob zerado mesmo quando os hooks são pulados. Seu contexto continua seu.',
        icon: '🔒',
      },
      {
        title: 'Sincronização nos dois sentidos',
        desc: 'O update_state propaga o contexto para os 12 arquivos de configuração das ferramentas automaticamente. Rode egc watch para também levar ao estado, e a todas as outras ferramentas, as mudanças que você fizer direto no arquivo de qualquer ferramenta, em tempo real.',
        icon: '🔄',
      },
      {
        title: 'Várias ferramentas',
        desc: `Funciona com ${integrations.length} ferramentas de programação com IA. Instale uma vez e o EGC configura cada ferramenta instalada com o que ela consegue ler.`,
        icon: '🔌',
      },
      {
        title: 'Local primeiro',
        desc: 'Todo o estado fica na sua máquina, em ~/.egc/, criptografado em repouso com AES-256-GCM. Nada é enviado para fora.',
        icon: '🔒',
      },
      {
        title: 'Zero configuração',
        desc: 'npm install -g @egchq/egc && egc install cuida de tudo: detecta suas ferramentas, registra os servidores e prepara o protocolo. A biblioteca de prompts continua opcional.',
        icon: '⚡',
      },
      {
        title: 'Camada Guardian',
        desc: 'O egc-guardian aplica a segurança no nível do harness: todo comando de terminal e toda gravação de arquivo são validados antes de executar. Os hooks UserPromptSubmit e PreToolUse bloqueiam padrões perigosos sem depender do comportamento da IA.',
        icon: '🛡️',
      },
      {
        title: 'EGC Scrubber',
        desc: 'O conteúdo que é seu fica limpo das marcas de procedência de IA automaticamente, na hora da gravação: caracteres Unicode invisíveis e travessões são removidos, e a coautoria de IA sai das mensagens de commit. Uma etapa opcional também remove metadados de procedência de Markdown, HTML e SVG, de imagens PNG e JPEG e dos dicionários Document Info de PDF. É determinístico e, se falhar, deixa passar: um erro ou um arquivo binário nunca bloqueia nem corrompe uma gravação. Uma camada estatística opcional reescreve o texto para reduzir marcas d’água de amostragem de tokens e mede quanto o texto mudou: um esforço honesto, sem nunca prometer que fica indetectável.',
        icon: '🧽',
      },
      {
        title: 'Histórico de decisões',
        desc: 'Cada decisão de arquitetura é guardada no SQLite com data e hora. Consulte por data ou por tag.',
        icon: '📋',
      },
    ],
    libraryTitle: 'Biblioteca de prompts',
    libraryLead:
      'Opcional e desligada por padrão: o instalador pergunta (o padrão é não), egc install --prompt-library adiciona depois, e o motor funciona exatamente igual sem ela. Escrita a partir de experiência real, não gerada.',
    scrollHint: 'Role a tabela para o lado para ver todas as colunas.',
    libraryLabel: 'Quantidades da biblioteca de prompts',
    libraryColumns: ['Tipo', 'Quantidade', 'O que é'],
    library: [
      { type: 'Agents', count: '61', desc: 'Definições de persona e comportamento' },
      { type: 'Skills', count: '232', desc: 'Roteiros de trabalho por área' },
      { type: 'Commands', count: '77', desc: 'Definições de comandos e hooks do ciclo de vida' },
      { type: 'Rules', count: '109', desc: 'Restrições e diretrizes de governança' },
    ],
    libraryPaths: (paths) => (
      <>
        Organizada por harness: funciona em {paths} e outros. Troque de ferramenta e os mesmos
        fluxos vão junto.
      </>
    ),
    toolsTitle: 'Ferramentas suportadas',
    toolsLabel: 'Ferramentas suportadas e caminhos de bootstrap',
    toolsColumns: ['Ferramenta', 'MCP', 'Bootstrap'],
    context: 'contexto',
    providersTitle: 'Provedores de LLM suportados',
    providersLead: (resolver) => (
      <>
        O EGC encaminha para qualquer provedor suportado pelo {resolver}. As cadeias de fallback
        recuam sozinhas quando um modelo não está disponível.
      </>
    ),
    providersLabel: 'Provedores de LLM e modelos suportados',
    providersColumns: ['Provedor', 'Modelos'],
    vertex: 'Gemini pelo Google Cloud',
    openRouterMore: 'e outros',
    ollama: 'local, offline',
  },
};

export function featuresMetadata(lang: Lang) {
  return COPY[lang].meta;
}

const TOOLS = [
  { tool: 'Claude Code', mcp: true, bootstrap: '~/.claude/CLAUDE.md' },
  { tool: 'Antigravity CLI', mcp: true, bootstrap: '~/.gemini/GEMINI.md' },
  { tool: 'Cursor', mcp: true, bootstrap: 'project .cursor/rules/' },
  { tool: 'Codex CLI', mcp: true, bootstrap: '~/.codex/config.toml' },
  { tool: 'OpenCode', mcp: true, bootstrap: '~/.config/opencode/ (plugin, instructions, skills)' },
  { tool: 'Devin Desktop', mcp: false, bootstrap: '~/.codeium/windsurf/' },
  { tool: 'Amp', mcp: false, bootstrap: '~/.amp/' },
  { tool: 'VS Code Copilot', mcp: false, bootstrap: '~/.github/' },
  { tool: 'Zed', mcp: true, bootstrap: '~/.config/zed/AGENTS.md' },
  { tool: 'Kiro', mcp: true, bootstrap: '~/.kiro/hooks/' },
  { tool: 'Trae', mcp: false, bootstrap: '~/.trae/MEMORY.md' },
  { tool: 'CodeBuddy', mcp: false, bootstrap: '~/.codebuddy/MEMORY.md' },
  { tool: 'JetBrains Junie', mcp: false, bootstrap: '.junie/guidelines.md' },
  { tool: 'Goose', mcp: false, bootstrap: '~/.agents/skills/' },
  { tool: 'OpenHands', mcp: false, bootstrap: '~/.agents/skills/' },
  { tool: 'Aider', mcp: false, bootstrap: '.aider/skills/ + .aider.conf.yml' },
  { tool: 'Warp', mcp: false, bootstrap: '.warp/skills/ + AGENTS.md index' },
  { tool: 'Cline', mcp: false, bootstrap: '.clinerules/' },
  { tool: 'Qwen Code', mcp: false, bootstrap: '.qwen/skills/' },
];

function providers(t: Copy) {
  return [
    {
      provider: 'Google Gemini',
      models: 'Gemini 2.5 Pro / Flash / Flash-Lite, 2.0 Flash, 1.5 Pro / Flash',
    },
    { provider: 'Anthropic Claude', models: 'Opus 4.5, Sonnet 4.7, Haiku 4.7' },
    { provider: 'OpenAI', models: 'GPT-4o, GPT-4o-mini' },
    { provider: 'DeepSeek', models: 'deepseek-chat, deepseek-reasoner' },
    { provider: 'Mistral AI', models: 'mistral-large-latest' },
    { provider: 'Groq', models: 'gpt-oss-120b' },
    { provider: 'Cohere', models: 'Command A' },
    { provider: 'Vertex AI', models: t.vertex },
    {
      provider: 'OpenRouter',
      models: `DeepSeek R1, DeepSeek Chat V3, Qwen3 235B, Qwen3 32B, Llama 4 Maverick, Llama 4 Scout, Llama 3.3 70B, Gemini 2.5 via OR, GPT-4o via OR, ${t.openRouterMore}`,
    },
    { provider: 'Ollama', models: `Llama 3.2, Mistral, CodeLlama (${t.ollama})` },
  ];
}

export default function Features({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <DocsShell current="features" lang={lang}>
      <div className="pb-2 mb-8 border-b border-gray-200 dark:border-gray-800">
        <p className="text-xs font-semibold uppercase tracking-widest text-egc-600 dark:text-egc-400 mb-2">
          {t.eyebrow}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          {t.title}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{t.lead}</p>
      </div>

      {/* Core features */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t.coreTitle}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">{t.coreLead}</p>
        <div className="editorial-list grid grid-cols-1 md:grid-cols-2 gap-x-8">
          {t.core.map((card) => (
            <article key={card.title} className="min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-1">
                {card.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed break-words">
                {card.desc}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Prompt library */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.libraryTitle}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">{t.libraryLead}</p>
        <p className="sm:hidden text-xs text-gray-400 mb-2">{t.scrollHint}</p>
        <div
          className="table-scroll rounded-xl border border-gray-200 dark:border-gray-800 w-full mb-5"
          role="region"
          aria-label={t.libraryLabel}
          tabIndex={0}
        >
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <th scope="col" className={thClass('left')}>
                  {t.libraryColumns[0]}
                </th>
                <th scope="col" className={thClass('center')}>
                  {t.libraryColumns[1]}
                </th>
                <th scope="col" className={thClass('left')}>
                  {t.libraryColumns[2]}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {t.library.map((row) => (
                <tr key={row.type} className="bg-white dark:bg-gray-950">
                  <td className="px-5 py-3 font-mono text-xs text-egc-700 dark:text-egc-400">
                    {row.type}
                  </td>
                  <td className="px-5 py-3 text-center font-bold text-gray-900 dark:text-white">
                    {row.count}
                  </td>
                  <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t.libraryPaths(
            <>
              <code className={codeClass}>.cursor/</code>,{' '}
              <code className={codeClass}>.claude/</code>,{' '}
              <code className={codeClass}>.gemini/</code>
            </>,
          )}
        </p>
      </section>

      {/* Supported tools */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.toolsTitle}</h2>
        <p className="sm:hidden text-xs text-gray-400 mb-2">{t.scrollHint}</p>
        <div
          className="table-scroll rounded-xl border border-gray-200 dark:border-gray-800 w-full"
          role="region"
          aria-label={t.toolsLabel}
          tabIndex={0}
        >
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <th scope="col" className={thClass('left')}>
                  {t.toolsColumns[0]}
                </th>
                <th scope="col" className={thClass('center')}>
                  {t.toolsColumns[1]}
                </th>
                <th scope="col" className={thClass('left')}>
                  {t.toolsColumns[2]}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {TOOLS.map((row) => (
                <tr key={row.tool} className="bg-white dark:bg-gray-950">
                  <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">
                    {row.tool}
                  </td>
                  <td className="px-5 py-3 text-center">
                    {row.mcp ? (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-egc-100 dark:bg-egc-900/30">
                        <span className="sr-only">MCP</span>
                        <svg
                          className="w-3 h-3 text-egc-600 dark:text-egc-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 dark:text-gray-300">{t.context}</span>
                    )}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">
                    {row.bootstrap}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Supported LLM providers */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.providersTitle}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
          {t.providersLead(<code className={codeClass}>ModelResolver</code>)}
        </p>
        <p className="sm:hidden text-xs text-gray-400 mb-2">{t.scrollHint}</p>
        <div
          className="table-scroll rounded-xl border border-gray-200 dark:border-gray-800 w-full"
          role="region"
          aria-label={t.providersLabel}
          tabIndex={0}
        >
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <th scope="col" className={thClass('left')}>
                  {t.providersColumns[0]}
                </th>
                <th scope="col" className={thClass('left')}>
                  {t.providersColumns[1]}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {providers(t).map((row) => (
                <tr key={row.provider} className="bg-white dark:bg-gray-950">
                  <td className="px-5 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    {row.provider}
                  </td>
                  <td className="px-5 py-3 text-gray-600 dark:text-gray-400 text-xs">
                    {row.models}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </DocsShell>
  );
}
