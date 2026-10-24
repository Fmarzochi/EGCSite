import DocsShell from '@/components/docs/DocsShell';
import type { Lang } from '@/lib/lang';

// The CLI reference in both languages: one markup, texts per language. Ported from
// src/pages/docs/cli.astro (English); the Portuguese texts are a translation of it.
// The examples are terminal sessions and stay in English in both, as the CLI prints them.

/** Commands as in the original page: `desc` is the English text. */
const COMMANDS: { cmd: string; desc: string; example: string }[] = [
  {
    cmd: 'egc init',
    desc: 'Run once in each project you want EGC to manage. Bootstraps the cognitive protocol in every detected tool, registers the MCP servers, prepares the state store, configures the commit-privacy filter for the repository and ends with a compact install check. Each step prints one check line; the full report is one egc doctor away.',
    example: `$ egc init

✓  cognitive protocol  6 tools up to date (v9)
✓  MCP registration  7 tools already registered
✓  memory  state store ready (6 migrations); loads on your first session
✓  commit-privacy filter  already configured; populated memory is stripped from staged blobs (local repo only)
✓  token crusher  shim installed and on PATH
✓  install check  12 targets healthy
Installation complete.`,
  },
  {
    cmd: 'egc doctor',
    desc: 'Verify both servers are built, the database is accessible, and all detected tools have EGC registered. The first command to run after installation.',
    example: `$ egc doctor

egc-guardian  running
egc-memory    running
database      ok
claude code   registered
cursor        registered

# Check against a local development checkout instead of the installed package:
$ egc doctor --repo-root /path/to/EGC`,
  },
  {
    cmd: 'egc status',
    desc: 'Show the last 5 decisions saved to memory for the current project, along with the active branch state file.',
    example: `$ egc status

Branch: feat/auth  (state: ~/.egc/state/my-app/feat-auth.md)
[2026-06-05] Moved from Prisma to Drizzle ORM
[2026-06-04] Dropped JWT in favor of iron-session
[2026-06-03] Settled on functional-only components
[2026-06-02] PostgreSQL with row-level security
[2026-06-01] Next.js 15 App Router`,
  },
  {
    cmd: 'egc consolidate',
    desc: 'Compact the state file for the current project when it grows too large. Rewrites entries in three layers: Working (last 7 days, kept verbatim), Episodic (last 30 days, summarized per week), and Semantic (older entries, condensed to core facts). The original file is backed up to ~/.egc/state/archive/ before any rewrite.',
    example: `$ egc consolidate

Consolidating state for my-app...
Working layer:  3 entries kept verbatim
Episodic layer: 12 entries summarized (2 weeks)
Semantic layer: 31 entries condensed
✓ Written to ~/.egc/state/my-app/main.md
  Backup at ~/.egc/state/archive/my-app-main-20260613.md

# Preview without writing:
$ egc consolidate --dry-run

# Run even if below the line threshold:
$ egc consolidate --force`,
  },
  {
    cmd: 'egc export',
    desc: 'Print the decrypted memory document for a project (default: the current directory) or for the user-wide global scope. Plain text is the Agent Memory Interchange Markdown document as stored; --json parses it into header fields and the five sections. Read-only: the state file and the key are never modified. Exit codes: 0 printed, 1 usage error or a state file or key that cannot be read or trusted, 2 no memory for the scope, 3 encrypted memory whose key is missing.',
    example: `$ egc export

# Project State
project: /home/you/projects/my-app
branch: main
...

# Another project, as JSON:
$ egc export --project /path/to/other-app --json

# The global scope shared by all projects:
$ egc export --scope global`,
  },
  {
    cmd: 'egc install',
    desc: 'Bare: set up the engine and ask about the optional prompt library (default no; from v1.1.22, --prompt-library and --no-prompt-library decide without the question). With --target and --profile: install the library to one tool, for example after adding a new tool.',
    example: `$ egc install --target cursor`,
  },
  {
    cmd: 'egc catalog',
    desc: 'List available profiles and components in the prompt library, and search the whole catalog by keyword with ranked results.',
    example: `$ egc catalog

agents    61
skills   232
commands  77
rules    109

$ egc catalog search memory session

Catalog matches for "memory session":

- ck [skill]
  Persistent per-project memory for Gemini Code...`,
  },
  {
    cmd: 'egc repair',
    desc: 'Restore drifted or missing managed files. Re-injects the cognitive bootstrap if it was overwritten.',
    example: `$ egc repair

✓ ~/.claude/CLAUDE.md restored
✓ ~/.gemini/GEMINI.md restored

# Repair against a local development checkout instead of the installed package:
$ egc repair --repo-root /path/to/EGC`,
  },
  {
    cmd: 'egc replay',
    desc: 'Play back a recorded session with timeline scrubbing: every tool call, file edit, and token count in order.',
    example: `$ egc sessions
$ egc replay <session-id>`,
  },
  {
    cmd: 'egc budget',
    desc: 'Set per-session token and cost limits, enforced by the pre-tool hook before each call.',
    example: `$ egc budget set --tokens 500000
$ egc budget status`,
  },
  {
    cmd: 'egc plugin',
    desc: 'Community plugin registry: install, list, update, and remove EGC plugins distributed via npm.',
    example: `$ egc plugin install <name>
$ egc plugin list`,
  },
  {
    cmd: 'egc saved',
    desc: 'Short token-savings report from the local Token Crusher ledger. Use egc gain for the full panel and egc discover for missed opportunities.',
    example: `$ egc saved

Tokens saved: ~139.2K (87.6% efficiency)`,
  },
  {
    cmd: 'egc uninstall',
    desc: 'Remove every EGC-managed file recorded in install-state, leaving your own configuration untouched.',
    example: `$ egc uninstall --target cursor`,
  },
  {
    cmd: 'egc watch',
    desc: "Start the bidirectional state sync daemon. Watches all EGC-managed tool config files in the project. When any file is edited outside of EGC's own propagation cycle - for example, when you update context in Cursor - the change is extracted from the EGC block and synced to all other tools automatically. Changes are also merged back into ~/.egc/state/ for full round-trip persistence.",
    example: `$ egc watch

[egc watch] Watching 4 tool config file(s) in /my-project
[egc watch] Press Ctrl+C to stop.
[egc watch] antigravity changed -> synced to: cursor, copilot, aider + state file

# Watch a specific project:
$ egc watch /path/to/project

# Suppress output:
$ egc watch --quiet`,
  },
  {
    cmd: 'egc dashboard',
    desc: 'Start the EGC Dashboard, a real-time Mission Control panel at http://localhost:7890. Shows live tool calls, file edits, shell commands, token usage, memory state, and agent status as your AI works. The dashboard auto-starts after egc install and egc init and runs as a background server.',
    example: `$ egc dashboard

EGC Dashboard running at http://localhost:7890

# Stop the background server:
$ egc dashboard stop

# Check if it's running:
$ egc dashboard status`,
  },
  {
    cmd: 'egc run',
    desc: 'Run any command through the Token Crusher. Noisy output (long git logs, test noise, install spam, giant JSON) is compressed up to 90% before it reaches the model; errors and warnings always survive. On hook-capable tools this happens silently without typing anything.',
    example: `$ egc run git log
... (12439 more commits)
[egc-crusher] saved ~139178 tokens (full output: rerun with --raw)

# Escape hatch, full output:
$ egc run --raw git log`,
  },
  {
    cmd: 'egc gain',
    desc: 'The full Token Crusher savings panel: totals, average per run, biggest crush, efficiency meter, and a breakdown by command kind. Read from the local ledger at zero token cost. Or just ask your AI "how much did I save?" and it runs this for you.',
    example: `$ egc gain

EGC Token Gain (local ledger, zero token cost)
  Crushed runs:     12
  Tokens saved:     ~412.7K
  Efficiency:       ████████████████████████ 97.3%

# Run-by-run log:
$ egc gain --history

# Short summary:
$ egc saved`,
  },
  {
    cmd: 'egc discover',
    desc: 'Scan your recent session transcripts for crushable output that never went through the Token Crusher, and see what those runs could have saved.',
    example: `$ egc discover

EGC Discover: crushable output that skipped the Token Crusher
  Transcripts scanned: 40 (last 7 days)
  Missed runs:         41
  Potential savings:   up to ~39.5K tokens`,
  },
  {
    cmd: 'egc crusher-shim',
    desc: 'Installed automatically by egc install and egc auto-update. A PATH-level binary shim (git, npm, pip, gh, and more) that compresses noisy output for any tool that shells out to run them. Covers a known gap: on Claude Code, the PreToolUse hook rewrite never fires for commands the AI assistant runs through its own Bash tool, only for a human typing directly into the terminal, so this is what makes the Crusher work there too. A human at an interactive terminal always gets full, untouched output; only non-interactive output capture goes through the Token Crusher.',
    example: `$ egc crusher-shim install
Shim directory: ~/.egc/bin
Installed: git, npm, pip, gh, ...
PATH updated in: ~/.bashrc, ~/.profile
Open a new terminal for it to take effect.

# Check status:
$ egc crusher-shim status

# Remove it:
$ egc crusher-shim uninstall`,
  },
  {
    cmd: 'egc claw',
    desc: 'NanoClaw REPL: a persistent, session-aware agent loop with zero dependencies. Conversation history lives in plain Markdown files, so sessions survive restarts and stay greppable.',
    example: `$ egc claw

NanoClaw v2: Session: default
Type /help for commands, exit to quit.

claw> `,
  },
  {
    cmd: 'egc harness-audit',
    desc: 'Scores your harness setup across tool coverage, context efficiency, quality gates, memory persistence, eval coverage, security guardrails, and cost efficiency. Text or JSON output.',
    example: `$ egc harness-audit --format json

{
  "scope": "repo",
  "deterministic": true,
  ...
}`,
  },
  {
    cmd: 'egc auto-update',
    desc: 'Pull the latest changes from GitHub, reinstall managed targets, and re-run the cognitive bootstrap so already-configured installs pick up new protocol sections instead of staying frozen at whatever shipped on first install. On an npm install it prints the upgrade command instead; on Windows, close the AI tools and terminals that run EGC before running it, or npm fails with EBUSY on a file it cannot rename.',
    example: `$ egc auto-update

Pulling latest from origin/main...
Building egc-guardian... done
Building egc-memory...  done
Reinstalling targets...
✓ claude code updated
✓ cursor updated

# Update against a local development checkout instead of the installed package:
$ egc auto-update --repo-root /path/to/EGC`,
  },
  {
    cmd: 'egc plan',
    desc: 'Inspect the selective-install manifests and the resolved plan for a target and profile before anything is written.',
    example: `$ egc plan --profile core --target cursor`,
  },
  {
    cmd: 'egc consult',
    desc: 'Recommend EGC components and profiles from a natural-language description of what you are building.',
    example: `$ egc consult "a Django API with Celery workers"`,
  },
  {
    cmd: 'egc list-installed',
    desc: 'Inspect the install-state files for the current context: which target, which profile, which files.',
    example: `$ egc list-installed`,
  },
  {
    cmd: 'egc overview',
    desc: 'Aggregated, read-only view of every per-project memory state on this machine.',
    example: `$ egc overview`,
  },
  {
    cmd: 'egc verify',
    desc: 'Run the project verification command and record a receipt for the commit gate.',
    example: `$ egc verify`,
  },
  {
    cmd: 'egc team',
    desc: 'Team memory sync over a git remote: init once per workstation, sync to pull and push lessons, status for health.',
    example: `$ egc team init <remote>
$ egc team sync
$ egc team status`,
  },
  {
    cmd: 'egc telemetry',
    desc: 'Anonymous usage telemetry, asked once on the first install, doctor or init run: status, on, off.',
    example: `$ egc telemetry status
$ egc telemetry off`,
  },
  {
    cmd: 'egc session-inspect',
    desc: 'Emit canonical EGC session snapshots from dmux or Gemini history targets.',
    example: `$ egc session-inspect`,
  },
  {
    cmd: 'egc loop-status',
    desc: 'Inspect transcripts for stale loop wakeups and pending tool results.',
    example: `$ egc loop-status`,
  },
];

const PT_DESC: Record<string, string> = {
  'egc init':
    'Rode uma vez em cada projeto que você quer que o EGC gerencie. Prepara o protocolo cognitivo em todas as ferramentas detectadas, registra os servidores MCP, prepara o armazenamento do estado, configura o filtro de privacidade dos commits do repositório e termina com uma checagem compacta da instalação. Cada etapa imprime uma linha de checagem; o relatório completo está a um egc doctor de distância.',
  'egc doctor':
    'Confere se os dois servidores estão compilados, se o banco de dados está acessível e se todas as ferramentas detectadas têm o EGC registrado. É o primeiro comando a rodar depois da instalação.',
  'egc status':
    'Mostra as 5 últimas decisões salvas na memória do projeto atual, junto com o arquivo de estado da branch ativa.',
  'egc consolidate':
    'Compacta o arquivo de estado do projeto atual quando ele fica grande demais. Reescreve os itens em três camadas: Working (últimos 7 dias, mantidos na íntegra), Episodic (últimos 30 dias, resumidos por semana) e Semantic (itens mais antigos, condensados nos fatos essenciais). O arquivo original vai para um backup em ~/.egc/state/archive/ antes de qualquer reescrita.',
  'egc export':
    'Imprime o documento de memória descriptografado de um projeto (por padrão, a pasta atual) ou do escopo global do usuário. Em texto puro, sai o documento Markdown do Agent Memory Interchange do jeito que está guardado; com --json, ele é separado nos campos do cabeçalho e nas cinco seções. Só leitura: o arquivo de estado e a chave nunca são alterados. Códigos de saída: 0 impresso, 1 erro de uso ou arquivo de estado ou chave que não pode ser lido ou não é confiável, 2 nenhuma memória no escopo, 3 memória criptografada sem a chave.',
  'egc install':
    'Sem opções: prepara o motor e pergunta sobre a biblioteca de prompts opcional (o padrão é não; a partir da v1.1.22, --prompt-library e --no-prompt-library decidem sem a pergunta). Com --target e --profile: instala a biblioteca em uma ferramenta, por exemplo depois de adicionar uma ferramenta nova.',
  'egc catalog':
    'Lista os perfis e componentes disponíveis na biblioteca de prompts e busca no catálogo inteiro por palavra-chave, com resultados ordenados.',
  'egc repair':
    'Restaura arquivos gerenciados que mudaram ou sumiram. Injeta de novo o bootstrap cognitivo se ele foi sobrescrito.',
  'egc replay':
    'Reproduz uma sessão gravada com uma linha do tempo navegável: cada chamada de ferramenta, edição de arquivo e contagem de tokens, em ordem.',
  'egc budget':
    'Define limites de tokens e de custo por sessão, aplicados pelo hook antes de cada chamada de ferramenta.',
  'egc plugin':
    'Registro de plugins da comunidade: instala, lista, atualiza e remove plugins do EGC distribuídos pelo npm.',
  'egc saved':
    'Relatório curto da economia de tokens, lido do livro-caixa local do Token Crusher. Use egc gain para o painel completo e egc discover para as oportunidades perdidas.',
  'egc uninstall':
    'Remove todos os arquivos gerenciados pelo EGC registrados no install-state, sem tocar na sua própria configuração.',
  'egc watch':
    'Inicia o daemon de sincronização do estado nos dois sentidos. Observa todos os arquivos de configuração de ferramentas gerenciados pelo EGC no projeto. Quando algum arquivo é editado fora do ciclo de propagação do próprio EGC (por exemplo, quando você atualiza o contexto no Cursor), a mudança é extraída do bloco do EGC e sincronizada com todas as outras ferramentas automaticamente. As mudanças também voltam para ~/.egc/state/, fechando o ciclo completo.',
  'egc dashboard':
    'Inicia o EGC Dashboard, um painel de controle em tempo real em http://localhost:7890. Mostra ao vivo as chamadas de ferramenta, edições de arquivo, comandos de terminal, uso de tokens, estado da memória e status dos agents enquanto a sua IA trabalha. O painel inicia sozinho depois do egc install e do egc init e roda como servidor em segundo plano.',
  'egc run':
    'Roda qualquer comando pelo Token Crusher. Saídas barulhentas (git logs longos, ruído de testes, poluição das instalações, JSON gigante) são comprimidas em até 90% antes de chegar ao modelo; erros e avisos sempre ficam. Nas ferramentas com hooks, isso acontece em silêncio, sem você digitar nada.',
  'egc gain':
    'O painel completo de economia do Token Crusher: totais, média por execução, maior compressão, medidor de eficiência e divisão por tipo de comando. Lido do livro-caixa local, sem gastar token. Ou simplesmente pergunte à sua IA "quanto eu economizei?" e ela roda isso para você.',
  'egc discover':
    'Varre as transcrições das suas sessões recentes em busca de saídas compressíveis que nunca passaram pelo Token Crusher, e mostra quanto essas execuções poderiam ter economizado.',
  'egc crusher-shim':
    'Instalado automaticamente pelo egc install e pelo egc auto-update. Um shim de binários no PATH (git, npm, pip, gh e outros) que comprime a saída barulhenta para qualquer ferramenta que os execute pelo terminal. Cobre uma lacuna conhecida: no Claude Code, a reescrita do hook PreToolUse nunca dispara para comandos que o assistente de IA roda pela própria ferramenta Bash, só para uma pessoa digitando direto no terminal, então é isso que faz o Crusher funcionar lá também. Uma pessoa num terminal interativo sempre recebe a saída completa e intacta; só a captura de saída não interativa passa pelo Token Crusher.',
  'egc claw':
    'NanoClaw REPL: um loop de agent persistente, que conhece a sessão, sem nenhuma dependência. O histórico da conversa fica em arquivos Markdown simples, então as sessões sobrevivem a reinícios e dá para buscar nelas com grep.',
  'egc harness-audit':
    'Dá nota à configuração do seu harness em cobertura de ferramentas, eficiência de contexto, gates de qualidade, persistência da memória, cobertura de avaliações, proteções de segurança e eficiência de custo. Saída em texto ou JSON.',
  'egc auto-update':
    'Baixa as últimas mudanças do GitHub, reinstala os destinos gerenciados e roda de novo o bootstrap cognitivo, para que instalações já configuradas recebam as novas seções do protocolo em vez de ficarem congeladas no que veio na primeira instalação. Numa instalação pelo npm, ele imprime o comando de atualização; no Windows, feche as ferramentas de IA e os terminais que rodam o EGC antes de rodá-lo, senão o npm falha com EBUSY num arquivo que não consegue renomear.',
  'egc plan':
    'Mostra os manifestos da instalação seletiva e o plano resolvido para um destino e um perfil antes de gravar qualquer coisa.',
  'egc consult':
    'Recomenda componentes e perfis do EGC a partir de uma descrição em linguagem natural do que você está construindo.',
  'egc list-installed':
    'Mostra os arquivos de install-state do contexto atual: qual destino, qual perfil, quais arquivos.',
  'egc overview':
    'Visão agregada, só de leitura, de todos os estados de memória por projeto nesta máquina.',
  'egc verify':
    'Roda o comando de verificação do projeto e registra um comprovante para o gate de commit.',
  'egc team':
    'Sincronização da memória da equipe por um remoto git: init uma vez por máquina, sync para trazer e enviar lições, status para ver a saúde.',
  'egc telemetry':
    'Telemetria anônima de uso, perguntada uma vez na primeira execução do install, do doctor ou do init: status, on, off.',
  'egc session-inspect':
    'Emite snapshots canônicos de sessões do EGC a partir de históricos do dmux ou do Gemini.',
  'egc loop-status':
    'Examina as transcrições em busca de wakeups de loop parados e resultados de ferramenta pendentes.',
};

interface Copy {
  meta: { title: string; description: string };
  eyebrow: string;
  title: string;
  lead: string;
}

const COPY: Record<Lang, Copy> = {
  en: {
    meta: { title: 'CLI Reference', description: 'All egc CLI commands explained.' },
    eyebrow: 'Reference',
    title: 'CLI Reference',
    lead: 'You never need to type any of these: open your AI tool and just talk, and the auto-intuition protocol maps your intent to the right action. Every command below exists for people who prefer explicit control, and each one is valid on its own.',
  },
  pt: {
    meta: { title: 'Referência da CLI', description: 'Todos os comandos da CLI egc explicados.' },
    eyebrow: 'Referência',
    title: 'Referência da CLI',
    lead: 'Você nunca precisa digitar nenhum destes: abra sua ferramenta de IA e simplesmente converse, e o protocolo de auto-intuição transforma sua intenção na ação certa. Cada comando abaixo existe para quem prefere controle explícito, e cada um funciona sozinho.',
  },
};

export function cliMetadata(lang: Lang) {
  return COPY[lang].meta;
}

export default function Cli({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <DocsShell current="cli" lang={lang}>
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
        <div className="space-y-4">
          {COMMANDS.map((item) => (
            <div
              key={item.cmd}
              className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
            >
              <div className="px-5 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <code className="text-sm font-mono font-bold text-egc-700 dark:text-egc-400">
                  {item.cmd}
                </code>
              </div>
              <div className="p-5">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {lang === 'pt' ? PT_DESC[item.cmd] : item.desc}
                </p>
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <pre className="bg-gray-900 p-4 text-xs font-mono text-gray-300 overflow-x-auto m-0">
                    <code>{item.example}</code>
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </DocsShell>
  );
}
