import DocsShell from '@/components/docs/DocsShell';
import { integrations } from '@/data/integrations';
import type { Lang } from '@/lib/lang';

// The FAQ page in both languages: one markup, texts per language. Ported from
// src/pages/docs/faq.astro (English); the Portuguese texts are a translation of it.

const TOOL_LIST =
  'Claude Code, Cursor, Codex CLI, Antigravity CLI, OpenCode, Devin Desktop, Amp, VS Code Copilot, Zed, Kiro, Trae, CodeBuddy, JetBrains Junie, Goose, OpenHands, Aider, Warp, Cline, Qwen Code, Kimi Code CLI, Crush, Auggie, Mistral Vibe, Grok Build, Kilo Code CLI, MiMo Code, Pi';

interface Copy {
  meta: { title: string; description: string };
  eyebrow: string;
  title: string;
  lead: string;
  faqs: { q: string; a: string }[];
  stillTitle: string;
  stillLead: string;
  openIssue: string;
}

const COPY: Record<Lang, Copy> = {
  en: {
    meta: {
      title: 'FAQ',
      description: 'Frequently asked questions about EGC - Extended Global Context.',
    },
    eyebrow: 'Reference',
    title: 'FAQ',
    lead: 'Frequently asked questions about EGC.',
    faqs: [
      {
        q: 'Does EGC send my project data anywhere?',
        a: 'No. All state is stored locally at ~/.egc/, and the MCP servers communicate over stdio with your local AI tool only. Nothing is sent to external servers unless you turn it on yourself: the anonymous usage ping (off by default; one hit per install, init or doctor run, carrying the version and the operating system), the Team Brain, which pushes your state sealed with your team key to a git remote you own, or the Guardian LLM routing (EGC_LLM_ROUTING), which sends the text you route to the provider you configured.',
      },
      {
        q: 'Which tools are supported?',
        a: `${integrations.length} tools: ${TOOL_LIST}, and Droid. The installer auto-detects which ones are installed. Gemini CLI, Continue.dev, and Roo Code were retired after their vendors discontinued them, and Amazon Q Developer CLI followed on 2026-09-30 (sign-ups closed, support ending on 2027-04-30, the CLI became the Kiro CLI).`,
      },
      {
        q: 'Does the AI need to call get_state manually?',
        a: "No. The cognitive bootstrap injected by the installer (egc install, then egc init in each project) writes the protocol into each tool's global instruction file. The AI is instructed to call get_state at the start of each session automatically. For tools where the AI instruction file isn't read automatically (varies by tool version), you may need to add the project's CLAUDE.md or equivalent to the session context manually.",
      },
      {
        q: 'Can I use EGC with multiple projects?',
        a: 'Yes. State is stored per project and per git branch: the project slug comes from the absolute path of the directory, and each branch gets its own state document. Open different projects in different sessions and each gets its own memory.',
      },
      {
        q: 'What happens if the state file gets corrupted?',
        a: 'State files are Markdown encrypted at rest, and the memory server authenticates each one (AES-256-GCM) when it reads it, so a corrupted file is refused instead of loaded. To recover, save a fresh state with update_state and force: true, or delete the state file to reset the project; egc export shows what is stored. egc repair restores the files the installer manages (hooks, instruction files, servers), not the state. The SQLite database is separate from the state files.',
      },
      {
        q: 'Is the prompt library required?',
        a: "No. It's optional and off by default: the installer asks, and from v1.1.22 egc install --prompt-library adds it without the question. The MCP servers (memory and guardian) work independently of the prompt library.",
      },
      {
        q: 'How is state different from a CLAUDE.md or .cursorrules file?',
        a: "Those files are static and committed to the repo. EGC's state is dynamic and project-local: the AI writes to it every session, accumulating decisions and preferences over time. They complement each other: static rules for repo conventions, EGC state for session continuity.",
      },
      {
        q: 'Is EGC free?',
        a: 'Yes. The engine is Apache-2.0 and stays free, the Team Brain for one person included: your machines, a git remote you own, no server of ours. What EGC will charge for later is a hosted team service for companies on top of the same engine (a real-time relay, key distribution, SSO, an audit trail), never the memory on your machine and never a check inside the open-source code. The direction is written down in docs/VISION.md.',
      },
      {
        q: 'What do core-supported and community-supported mean?',
        a: 'Every tool gets the same install path, and the memory protocol goes into the instruction file each tool reads. Core-supported tools (Claude Code, Antigravity, Cursor, Codex CLI, OpenCode) are run daily by the maintainer or a steward, and a regression caused by a vendor change is fixed before the next release. Community-supported tools are installed and tested in CI like the rest, but a vendor change waits for a report or a pull request. The list and the criteria live in docs/governance/support-levels.md, and each tool has its own page under Integrations.',
      },
      {
        q: 'Can I contribute?',
        a: 'Yes. Read CONTRIBUTING.md on GitHub. PRs are welcome for bug fixes, new tool integrations, and prompt library additions.',
      },
    ],
    stillTitle: 'Still have questions?',
    stillLead: 'Open an issue on GitHub or check the source. Everything is open.',
    openIssue: 'Open an issue',
  },
  pt: {
    meta: {
      title: 'Perguntas frequentes',
      description: 'Perguntas frequentes sobre o EGC - Extended Global Context.',
    },
    eyebrow: 'Referência',
    title: 'Perguntas frequentes',
    lead: 'As dúvidas mais comuns sobre o EGC.',
    faqs: [
      {
        q: 'O EGC envia os dados do meu projeto para algum lugar?',
        a: 'Não. Todo o estado fica guardado localmente em ~/.egc/, e os servidores MCP se comunicam por stdio só com a sua ferramenta de IA local. Nada é enviado a servidores externos, a não ser o que você mesmo ligar: o ping anônimo de uso (desligado por padrão; um registro por instalação, init ou doctor, só com a versão e o sistema operacional), o Team Brain, que envia o seu estado selado com a chave da sua equipe para um remoto git seu, ou o roteamento de LLM do Guardian (EGC_LLM_ROUTING), que manda o texto que você rotear ao provedor que você configurou.',
      },
      {
        q: 'Quais ferramentas são suportadas?',
        a: `${integrations.length} ferramentas: ${TOOL_LIST} e Droid. O instalador detecta sozinho quais estão instaladas. Gemini CLI, Continue.dev e Roo Code foram aposentadas depois que os fabricantes as descontinuaram, e o Amazon Q Developer CLI seguiu o mesmo caminho em 2026-09-30 (cadastros fechados, suporte até 2027-04-30, a CLI virou a Kiro CLI).`,
      },
      {
        q: 'A IA precisa chamar get_state manualmente?',
        a: 'Não. O bootstrap cognitivo que o instalador injeta (egc install e depois egc init em cada projeto) escreve o protocolo no arquivo de instruções global de cada ferramenta. A IA é instruída a chamar get_state no início de cada sessão automaticamente. Nas ferramentas em que o arquivo de instruções da IA não é lido automaticamente (depende da versão da ferramenta), pode ser preciso adicionar o CLAUDE.md do projeto, ou equivalente, ao contexto da sessão manualmente.',
      },
      {
        q: 'Posso usar o EGC com vários projetos?',
        a: 'Sim. O estado é guardado por projeto e por branch do git: o identificador do projeto vem do caminho absoluto da pasta, e cada branch ganha seu próprio documento de estado. Abra projetos diferentes em sessões diferentes e cada um terá a sua memória.',
      },
      {
        q: 'O que acontece se o arquivo de estado corromper?',
        a: 'Os arquivos de estado são Markdown criptografado em repouso, e o servidor de memória autentica cada um (AES-256-GCM) ao ler, então um arquivo corrompido é recusado em vez de carregado. Para recuperar, salve um estado novo com update_state e force: true, ou apague o arquivo de estado para zerar o projeto; egc export mostra o que está guardado. O egc repair restaura os arquivos que o instalador gerencia (hooks, arquivos de instruções, servidores), não o estado. O banco SQLite é separado dos arquivos de estado.',
      },
      {
        q: 'A biblioteca de prompts é obrigatória?',
        a: 'Não. Ela é opcional e vem desligada: o instalador pergunta, e a partir da v1.1.22 egc install --prompt-library adiciona a biblioteca sem a pergunta. Os servidores MCP (memória e guardian) funcionam independentemente da biblioteca de prompts.',
      },
      {
        q: 'Qual a diferença entre o estado e um arquivo CLAUDE.md ou .cursorrules?',
        a: 'Esses arquivos são estáticos e ficam commitados no repositório. O estado do EGC é dinâmico e local do projeto: a IA escreve nele a cada sessão, acumulando decisões e preferências com o tempo. Um complementa o outro: regras estáticas para as convenções do repositório, estado do EGC para a continuidade entre sessões.',
      },
      {
        q: 'O EGC é gratuito?',
        a: 'Sim. O motor é Apache-2.0 e continua gratuito, com o Team Brain para uma pessoa incluído: as suas máquinas, um remoto git seu, nenhum servidor nosso. O que o EGC vai cobrar mais adiante é um serviço de equipe hospedado para empresas, por cima do mesmo motor (relay em tempo real, distribuição de chaves, SSO, trilha de auditoria), nunca a memória na sua máquina e nunca uma trava dentro do código aberto. A direção está escrita em docs/VISION.md.',
      },
      {
        q: 'O que significam suporte principal e suporte da comunidade?',
        a: 'Toda ferramenta recebe o mesmo caminho de instalação e o mesmo protocolo de memória. As ferramentas com suporte principal (core-supported: Claude Code, Antigravity, Cursor, Codex CLI, OpenCode) são usadas todo dia pelo mantenedor ou por um responsável, e uma regressão causada por mudança do fabricante é corrigida antes da próxima release. As com suporte da comunidade (community-supported) são instaladas e testadas no CI como as demais, mas uma mudança do fabricante espera um relato ou um pull request. A lista e os critérios estão em docs/governance/support-levels.md, e cada ferramenta tem sua própria página em Integrações.',
      },
      {
        q: 'Posso contribuir?',
        a: 'Sim. Leia o CONTRIBUTING.md no GitHub. PRs são bem-vindos para correções de bugs, novas integrações de ferramentas e acréscimos à biblioteca de prompts.',
      },
    ],
    stillTitle: 'Ainda tem dúvidas?',
    stillLead: 'Abra uma issue no GitHub ou confira o código. Tudo é aberto.',
    openIssue: 'Abrir uma issue',
  },
};

export function faqMetadata(lang: Lang) {
  return COPY[lang].meta;
}

export default function Faq({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <DocsShell current="faq" lang={lang}>
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
        <div className="space-y-4" id="faq-list">
          {t.faqs.map((item, i) => (
            <details
              key={item.q}
              className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 group"
              open={i === 0}
            >
              <summary className="px-4 sm:px-5 py-4 cursor-pointer flex items-center gap-3 justify-between list-none min-h-[44px]">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {item.q}
                </span>
                <svg
                  className="w-4 h-4 text-gray-400 shrink-0 transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <div className="px-5 pb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-6">
        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{t.stillTitle}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t.stillLead}</p>
        <a
          href="https://github.com/Fmarzochi/EGC/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 py-1 -my-1 text-sm font-semibold text-egc-600 dark:text-egc-400 hover:underline"
        >
          {t.openIssue}
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </section>
    </DocsShell>
  );
}
