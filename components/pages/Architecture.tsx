import type { ReactNode } from 'react';
import DocsSection from '@/components/docs/DocsSection';
import DocsShell from '@/components/docs/DocsShell';
import { withBase } from '@/lib/base';
import type { Lang } from '@/lib/lang';

// The Architecture page in both languages: one markup, texts per language. Ported from
// src/pages/docs/architecture.astro (English); the Portuguese texts are a translation of it.

interface Copy {
  meta: { title: string; description: string };
  eyebrow: string;
  title: string;
  lead: string;
  overview: string;
  scrollHint: string;
  diagramLabel: string;
  diagramAlt: string;
  caption: (link: ReactNode) => ReactNode;
  fullSize: string;
  layersTitle: string;
  layers: { title: string; desc: string }[];
  notesTitle: string;
  consolidation: string;
  consolidationP1: string;
  consolidationP2: (branch: ReactNode) => ReactNode;
}

const COPY: Record<Lang, Copy> = {
  en: {
    meta: {
      title: 'Architecture',
      description:
        'How EGC works internally: two MCP servers, local SQLite, encrypted Markdown state files, one install command.',
    },
    eyebrow: 'Reference',
    title: 'Architecture',
    lead: 'Two MCP servers, local SQLite, encrypted Markdown state files, one install command. No cloud, no daemon, no config server.',
    overview: 'Overview',
    scrollHint: 'Scroll the diagram horizontally, or focus it and use the arrow keys.',
    diagramLabel: 'EGC architecture diagram',
    diagramAlt:
      'AI coding tools read the memory protocol from tool instruction files. Where MCP is registered, tools connect over stdio to egc-memory and egc-guardian. egc-memory reads and writes encrypted branch-scoped Markdown state and a local SQLite decision and session store.',
    caption: (link) => (
      <>
        Tools use the installed memory protocol. Where registered, they also connect to the two
        local MCP servers over stdio. {link} to zoom.
      </>
    ),
    fullSize: 'Open the full-size diagram (new tab)',
    layersTitle: 'Layers',
    layers: [
      {
        title: 'AI Tool Layer',
        desc: "Claude Code, Cursor, Codex, Antigravity CLI, OpenCode, Devin Desktop, Amp, VS Code Copilot, Zed, Kiro, Trae, CodeBuddy, Junie, Goose, OpenHands, Aider, Warp, Cline, and Qwen Code: 19 managed install targets. Each tool reads state at session start and writes at session end: through the MCP servers where they are registered, and through the propagated context files everywhere else. The cognitive bootstrap injected by the installer writes this protocol into each tool's global instruction file.",
      },
      {
        title: 'MCP Transport (stdio)',
        desc: 'Both servers communicate over stdio. The tool spawns them as child processes. No ports, no network, no daemon. Starts in under 100ms.',
      },
      {
        title: 'egc-memory',
        desc: 'Handles all memory operations. Reads and writes Markdown state files scoped per project and git branch. Persists decisions to SQLite with BM25 full-text search. Runs the session bus so parallel sessions announce presence, claim paths, and hand work off without collisions.',
      },
      {
        title: 'egc-guardian',
        desc: 'Validates commands and file writes before execution, scans untrusted content for prompt-injection patterns (validate_content, advisory only) and provides context utilities (reduce_context, orchestrate_task, auto_learn). Enforcement is wired at the harness level too: prompt routing and pre-tool hooks run on every session, and the Token Crusher compresses shell output before it reaches the model, with savings tracked in a local ledger (egc gain).',
      },
      {
        title: 'Local Storage (~/.egc/)',
        desc: 'State files are Markdown, one per project branch, encrypted at rest with AES-256-GCM and integrity-checked with HMAC-SHA256. SQLite stores structured decision history for querying, and the crusher ledger records every token saving. Everything is local and never leaves your machine.',
      },
      {
        title: 'Dashboard (localhost:7890)',
        desc: 'Real-time mission control launched right after install: live tool calls, token usage, provider comparison, session replay, and export to CSV/JSON. IDE hook emitters stream events from Cursor, Kiro, OpenCode, and CodeBuddy.',
      },
    ],
    notesTitle: 'Design notes',
    consolidation: 'Architectural consolidation',
    consolidationP1:
      'Earlier versions of EGC explored distributed runtime concepts: FederationManager, ReplayEngine, cognitive orchestration layers, multi-provider dispatching. Those experiments were real explorations, not deception. They helped define what the project actually needed to be.',
    consolidationP2: (branch) => (
      <>
        The current runtime reflects that consolidation. Two MCP servers, local SQLite, encrypted
        Markdown state files, one install command. The branch {branch} preserves the full historical
        architecture for anyone who wants to study the evolution.
      </>
    ),
  },
  pt: {
    meta: {
      title: 'Arquitetura',
      description:
        'Como o EGC funciona por dentro: dois servidores MCP, SQLite local, arquivos de estado em Markdown criptografados, um comando de instalação.',
    },
    eyebrow: 'Referência',
    title: 'Arquitetura',
    lead: 'Dois servidores MCP, SQLite local, arquivos de estado em Markdown criptografados, um comando de instalação. Sem nuvem, sem daemon, sem servidor de configuração.',
    overview: 'Visão geral',
    scrollHint: 'Role o diagrama para o lado, ou selecione-o e use as setas do teclado.',
    diagramLabel: 'Diagrama da arquitetura do EGC',
    diagramAlt:
      'As ferramentas de programação com IA leem o protocolo de memória nos arquivos de instrução de cada ferramenta. Onde o MCP está registrado, as ferramentas se conectam por stdio ao egc-memory e ao egc-guardian. O egc-memory lê e grava o estado em Markdown criptografado por branch e um armazenamento local em SQLite de decisões e sessões.',
    caption: (link) => (
      <>
        As ferramentas usam o protocolo de memória instalado. Onde estão registradas, também se
        conectam aos dois servidores MCP locais por stdio. {link} para ampliar.
      </>
    ),
    fullSize: 'Abra o diagrama em tamanho real (nova aba)',
    layersTitle: 'Camadas',
    layers: [
      {
        title: 'Camada das ferramentas de IA',
        desc: 'Claude Code, Cursor, Codex, Antigravity CLI, OpenCode, Devin Desktop, Amp, VS Code Copilot, Zed, Kiro, Trae, CodeBuddy, Junie, Goose, OpenHands, Aider, Warp, Cline e Qwen Code: 19 destinos de instalação gerenciados. Cada ferramenta lê o estado no início da sessão e grava no fim: pelos servidores MCP onde eles estão registrados, e pelos arquivos de contexto propagados nos demais casos. O bootstrap cognitivo que o instalador injeta escreve esse protocolo no arquivo de instruções global de cada ferramenta.',
      },
      {
        title: 'Transporte MCP (stdio)',
        desc: 'Os dois servidores se comunicam por stdio. A ferramenta os inicia como processos filhos. Sem portas, sem rede, sem daemon. Sobe em menos de 100 ms.',
      },
      {
        title: 'egc-memory',
        desc: 'Cuida de todas as operações de memória. Lê e grava os arquivos de estado em Markdown separados por projeto e por branch do git. Guarda as decisões no SQLite com busca de texto completo BM25. Mantém o barramento de sessões, para que sessões paralelas anunciem presença, reservem caminhos e passem trabalho adiante sem colisões.',
      },
      {
        title: 'egc-guardian',
        desc: 'Valida comandos e gravações de arquivo antes de executar, procura padrões de prompt injection em conteúdo não confiável (validate_content, só como aviso) e oferece utilitários de contexto (reduce_context, orchestrate_task, auto_learn). A aplicação também acontece no nível do harness: o roteamento de prompts e os hooks antes das ferramentas rodam em toda sessão, e o Token Crusher comprime a saída do terminal antes de ela chegar ao modelo, com a economia registrada num livro-caixa local (egc gain).',
      },
      {
        title: 'Armazenamento local (~/.egc/)',
        desc: 'Os arquivos de estado são Markdown, um por branch do projeto, criptografados em repouso com AES-256-GCM e com integridade verificada por HMAC-SHA256. O SQLite guarda o histórico estruturado de decisões para consulta, e o livro-caixa do crusher registra cada economia de tokens. Tudo é local e nunca sai da sua máquina.',
      },
      {
        title: 'Painel (localhost:7890)',
        desc: 'Central de controle em tempo real aberta logo após a instalação: chamadas de ferramenta ao vivo, uso de tokens, comparação de provedores, replay de sessões e exportação para CSV/JSON. Emissores de hooks das IDEs enviam eventos do Cursor, do Kiro, do OpenCode e do CodeBuddy.',
      },
    ],
    notesTitle: 'Notas de projeto',
    consolidation: 'Consolidação da arquitetura',
    consolidationP1:
      'Versões anteriores do EGC exploraram conceitos de runtime distribuído: FederationManager, ReplayEngine, camadas de orquestração cognitiva, despacho entre vários provedores. Esses experimentos foram explorações reais, não enganação. Ajudaram a definir o que o projeto realmente precisava ser.',
    consolidationP2: (branch) => (
      <>
        O runtime atual reflete essa consolidação. Dois servidores MCP, SQLite local, arquivos de
        estado em Markdown criptografados, um comando de instalação. A branch {branch} preserva a
        arquitetura histórica completa para quem quiser estudar a evolução.
      </>
    ),
  },
};

export function architectureMetadata(lang: Lang) {
  return COPY[lang].meta;
}

export default function Architecture({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <DocsShell current="architecture" lang={lang}>
      <div className="pb-2 mb-8 border-b border-gray-200 dark:border-gray-800">
        <p className="text-xs font-semibold uppercase tracking-widest text-egc-600 dark:text-egc-400 mb-2">
          {t.eyebrow}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          {t.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{t.lead}</p>
      </div>

      {/* Diagram */}
      <DocsSection title={t.overview} open>
        <figure className="architecture-figure">
          <p className="architecture-scroll-hint" id="architecture-scroll-hint">
            {t.scrollHint}
          </p>
          <div
            className="architecture-scroll"
            role="region"
            aria-label={t.diagramLabel}
            aria-describedby="architecture-scroll-hint architecture-diagram-caption"
            tabIndex={0}
          >
            <img src={withBase('architecture.svg')} alt={t.diagramAlt} width="880" height="560" />
          </div>
          <figcaption id="architecture-diagram-caption">
            {t.caption(
              <a href={withBase('architecture.svg')} target="_blank" rel="noopener noreferrer">
                {t.fullSize}
              </a>,
            )}
          </figcaption>
        </figure>
      </DocsSection>

      {/* Layers */}
      <DocsSection title={t.layersTitle}>
        <div className="editorial-list">
          {t.layers.map((step, i) => (
            <div key={step.title} className="flex gap-4">
              <div className="shrink-0 w-7 text-egc-400 font-mono text-sm font-bold">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </DocsSection>

      {/* Design notes */}
      <DocsSection title={t.notesTitle}>
        <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 p-6">
          <h3 className="font-semibold text-amber-900 dark:text-amber-400 mb-2">
            {t.consolidation}
          </h3>
          <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
            {t.consolidationP1}
          </p>
          <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed mt-3">
            {t.consolidationP2(
              <code className="text-xs bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded font-mono">
                legacy-runtime
              </code>,
            )}
          </p>
        </div>
      </DocsSection>
    </DocsShell>
  );
}
