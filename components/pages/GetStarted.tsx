import type { ReactNode } from 'react';
import Link from 'next/link';
import '@/styles/get-started.css';
import DocsShell from '@/components/docs/DocsShell';
import InstallTabsBehavior from '@/components/docs/InstallTabsBehavior';
import type { Lang } from '@/lib/lang';
import { localePath } from '@/lib/site-i18n';

// The Get Started page in both languages: one markup, texts per language. Ported from
// src/pages/get-started.astro (English); the Portuguese texts are a translation of it.
// Terminal output stays in English in both, as the CLI prints it.

const codeClass = 'text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono';

interface Copy {
  meta: { title: string; description: string };
  eyebrow: string;
  title: string;
  lead: string;
  steps: {
    prepare: string;
    choose: string;
    understand: string;
    expect: string;
    verify: string;
    next: string;
  };
  requirements: string;
  scrollHint: string;
  requirementsLabel: string;
  columns: [string, string, string];
  any: string;
  os: string;
  chooseTitle: string;
  chooseLead: string;
  run: string;
  methodLabel: string;
  recommended: string;
  fastest: string;
  npmWorks: ReactNode;
  versionManagers: ReactNode;
  permissions: ReactNode;
  wakeUp: ReactNode;
  needNode: (link: ReactNode) => ReactNode;
  needNodeWindows: (link: ReactNode) => ReactNode;
  downloadNode: string;
  upgrading: ReactNode;
  installerTitle: string;
  installerSteps: { title: string; desc: string }[];
  expectedTitle: string;
  verifyTitle: string;
  notFound: ReactNode;
  nextTitle: string;
  cards: { href: string; title: string; desc: string }[];
}

const COPY: Record<Lang, Copy> = {
  en: {
    meta: {
      title: 'Get Started',
      description:
        'Install EGC in under 2 minutes. Works with Claude Code, Cursor, Codex, Antigravity, and more.',
    },
    eyebrow: 'Getting Started',
    title: 'Installation',
    lead: 'Install EGC once and it works across every AI coding tool you already use.',
    steps: {
      prepare: '01 / PREPARE',
      choose: '02 / CHOOSE',
      understand: '04 / UNDERSTAND',
      expect: '05 / EXPECT',
      verify: '06 / VERIFY',
      next: '07 / CONTINUE',
    },
    requirements: 'Requirements',
    scrollHint: 'Scroll the table horizontally for all columns.',
    requirementsLabel: 'Installation requirements',
    columns: ['Requirement', 'Version', 'Check'],
    any: 'any',
    os: 'OS',
    chooseTitle: 'Choose your method',
    chooseLead:
      'Use npm on any supported system, or select your operating system for the source installer.',
    run: 'Run the installation',
    methodLabel: 'Installation method',
    recommended: 'recommended',
    fastest: 'Fastest',
    npmWorks: (
      <>
        Works on{' '}
        <strong className="text-gray-900 dark:text-white">Linux, macOS, and Windows</strong>. No git
        clone needed.
      </>
    ),
    versionManagers: (
      <>
        Using <strong className="text-gray-700 dark:text-gray-300">mise, nvm, asdf, or fnm</strong>?
        Install EGC under your <em>default</em> Node version, the one active outside any project
        directory, to avoid version conflicts.
      </>
    ),
    permissions: (
      <>
        <strong>Permissions:</strong> if <code>npm install -g</code> fails with <code>EACCES</code>{' '}
        (Node from your distro&apos;s package manager, or any root-owned global prefix), run only
        the <code>npm install -g</code> step with <code>sudo</code> and everything else as your
        normal user. A Node version manager such as nvm, mise or fnm never needs sudo.
      </>
    ),
    wakeUp: (
      <>
        <strong>Then wake up the brain:</strong> the bare install prepares the runtime only. Inside
        a real project, run <code>egc init</code> once so your AI tools restore its memory on their
        very first prompt. <code>egc doctor</code> should end with <code>errors=0</code>.
      </>
    ),
    needNode: (link) => (
      <>
        You need {link}. Not sure? Run <code className={codeClass}>node --version</code>.
      </>
    ),
    needNodeWindows: (link) => (
      <>You need {link} and PowerShell. Run as Administrator if prompted.</>
    ),
    downloadNode: 'Download Node.js 20+ (opens in new tab)',
    upgrading: (
      <>
        <strong>
          Upgrading later with <code>npm install -g @egchq/egc@latest</code>:
        </strong>{' '}
        close the AI tools and terminals that run EGC first. npm renames the package folder during
        the update, and Windows refuses while any process holds a file inside it (an AI tool running
        the EGC MCP servers is enough). The failure reads{' '}
        <code>EBUSY: resource busy or locked</code>; closing the tools clears it, and so does a
        reboot.
      </>
    ),
    installerTitle: 'What the installer does',
    installerSteps: [
      {
        title: 'Prepares the MCP servers',
        desc: 'The npm package ships egc-guardian and egc-memory prebuilt; a clone from source builds them from TypeScript.',
      },
      {
        title: 'Initializes the store',
        desc: 'Creates the local SQLite store under ~/.egc/ for decisions, lessons and the session bus. State documents live under ~/.egc/state/, one per project branch, encrypted at rest.',
      },
      {
        title: 'Cognitive bootstrap',
        desc: 'Writes the memory protocol into the global instruction files for each detected tool (CLAUDE.md, GEMINI.md, cursor.rules, etc.).',
      },
      {
        title: 'Registers MCP servers and hooks',
        desc: 'Writes both servers into the MCP config of the 24 tools that take it (Antigravity, Claude Code, Cursor, Kiro, Codex CLI, OpenCode, Zed, Amp, VS Code Copilot through the Copilot CLI file, Goose, OpenHands, JetBrains Junie, Warp, Qwen Code, Kimi Code CLI, Crush, Auggie, Mistral Vibe, Grok Build, Kilo Code CLI, MiMo Code, Pi, Droid, and Devin Desktop through the project file) and wires native hooks in every tool that has them. For Claude Code, also installs a SessionStart hook (loads state automatically) and a Stop hook (saves state automatically at session end). Runs once per tool, idempotent.',
      },
      {
        title: 'Prompt library (optional)',
        desc: 'Asks whether to install 232 skills, 77 commands, and 61 agents; the default is no. From v1.1.22, egc install --prompt-library answers yes without asking and --no-prompt-library skips the question. Skipped automatically in CI.',
      },
      {
        title: 'Token Crusher binary shim',
        desc: 'Installs a PATH-level shim (git, npm, gh, and more) under ~/.egc/bin as a best-effort step. Covers a known gap where the automatic hook never fires for commands the AI assistant itself issues on Claude Code.',
      },
    ],
    expectedTitle: 'Expected output',
    verifyTitle: 'Verify the installation',
    notFound: (
      <>
        If a tool shows <code className={codeClass}>not found</code>, it either isn&apos;t installed
        or wasn&apos;t detected. You can re-run <code className={codeClass}>egc install</code> (or{' '}
        <code className={codeClass}>egc init</code> inside a project) after installing the tool.
      </>
    ),
    nextTitle: 'Next steps',
    cards: [
      {
        href: '/docs/memory/',
        title: 'egc-memory',
        desc: 'Learn how get_state and update_state work.',
      },
      {
        href: '/docs/guardian/',
        title: 'egc-guardian',
        desc: 'Understand the validation and safety layer.',
      },
      {
        href: '/features/',
        title: 'Features',
        desc: 'Full feature overview and prompt library details.',
      },
      { href: '/docs/cli/', title: 'CLI Reference', desc: 'All egc commands explained.' },
    ],
  },
  pt: {
    meta: {
      title: 'Primeiros passos',
      description:
        'Instale o EGC em menos de 2 minutos. Funciona com Claude Code, Cursor, Codex, Antigravity e mais.',
    },
    eyebrow: 'Primeiros passos',
    title: 'Instalação',
    lead: 'Instale o EGC uma vez e ele funciona em todas as ferramentas de IA para programação que você já usa.',
    steps: {
      prepare: '01 / PREPARAR',
      choose: '02 / ESCOLHER',
      understand: '04 / ENTENDER',
      expect: '05 / RESULTADO',
      verify: '06 / CONFERIR',
      next: '07 / CONTINUAR',
    },
    requirements: 'Requisitos',
    scrollHint: 'Role a tabela para o lado para ver todas as colunas.',
    requirementsLabel: 'Requisitos de instalação',
    columns: ['Requisito', 'Versão', 'Como conferir'],
    any: 'qualquer',
    os: 'Sistema',
    chooseTitle: 'Escolha o método',
    chooseLead:
      'Use o npm em qualquer sistema compatível, ou escolha o seu sistema operacional para instalar a partir do código-fonte.',
    run: 'Rode a instalação',
    methodLabel: 'Método de instalação',
    recommended: 'recomendado',
    fastest: 'Mais rápido',
    npmWorks: (
      <>
        Funciona em{' '}
        <strong className="text-gray-900 dark:text-white">Linux, macOS e Windows</strong>. Não
        precisa de git clone.
      </>
    ),
    versionManagers: (
      <>
        Usa <strong className="text-gray-700 dark:text-gray-300">mise, nvm, asdf ou fnm</strong>?
        Instale o EGC na sua versão <em>padrão</em> do Node, a que fica ativa fora de qualquer pasta
        de projeto, para evitar conflito de versões.
      </>
    ),
    permissions: (
      <>
        <strong>Permissões:</strong> se o <code>npm install -g</code> falhar com <code>EACCES</code>{' '}
        (Node instalado pelo gerenciador de pacotes da sua distro, ou qualquer prefixo global do
        root), rode só o passo <code>npm install -g</code> com <code>sudo</code> e todo o resto como
        o seu usuário normal. Um gerenciador de versões do Node, como nvm, mise ou fnm, nunca
        precisa de sudo.
      </>
    ),
    wakeUp: (
      <>
        <strong>Depois, acorde o cérebro:</strong> a instalação sozinha só prepara o runtime. Dentro
        de um projeto de verdade, rode <code>egc init</code> uma vez para que as suas ferramentas de
        IA restaurem a memória dele já no primeiro prompt. O <code>egc doctor</code> deve terminar
        com <code>errors=0</code>.
      </>
    ),
    needNode: (link) => (
      <>
        Você precisa do {link}. Não tem certeza? Rode{' '}
        <code className={codeClass}>node --version</code>.
      </>
    ),
    needNodeWindows: (link) => (
      <>Você precisa do {link} e do PowerShell. Rode como Administrador se for pedido.</>
    ),
    downloadNode: 'Baixar o Node.js 20+ (abre em nova aba)',
    upgrading: (
      <>
        <strong>
          Para atualizar depois com <code>npm install -g @egchq/egc@latest</code>:
        </strong>{' '}
        feche antes as ferramentas de IA e os terminais que rodam o EGC. O npm renomeia a pasta do
        pacote durante a atualização, e o Windows recusa enquanto algum processo estiver com um
        arquivo dela aberto (basta uma ferramenta de IA rodando os servidores MCP do EGC). O erro
        aparece como <code>EBUSY: resource busy or locked</code>; fechar as ferramentas resolve, e
        reiniciar também.
      </>
    ),
    installerTitle: 'O que o instalador faz',
    installerSteps: [
      {
        title: 'Prepara os servidores MCP',
        desc: 'O pacote do npm já traz o egc-guardian e o egc-memory compilados; um clone do código-fonte compila os dois a partir do TypeScript.',
      },
      {
        title: 'Inicializa o armazenamento',
        desc: 'Cria o banco SQLite local em ~/.egc/ para decisões, lições e o barramento de sessões. Os documentos de estado ficam em ~/.egc/state/, um por branch do projeto, criptografados em repouso.',
      },
      {
        title: 'Bootstrap cognitivo',
        desc: 'Escreve o protocolo de memória nos arquivos globais de instruções de cada ferramenta detectada (CLAUDE.md, GEMINI.md, cursor.rules etc.).',
      },
      {
        title: 'Registra os servidores MCP e os hooks',
        desc: 'Grava os dois servidores na configuração MCP das 24 ferramentas que aceitam (Antigravity, Claude Code, Cursor, Kiro, Codex CLI, OpenCode, Zed, Amp, VS Code Copilot pelo arquivo da CLI do Copilot, Goose, OpenHands, JetBrains Junie, Warp, Qwen Code, Kimi Code CLI, Crush, Auggie, Mistral Vibe, Grok Build, Kilo Code CLI, MiMo Code, Pi, Droid, e o Devin Desktop pelo arquivo do projeto) e liga os hooks nativos em toda ferramenta que os tem. No Claude Code, instala também um hook SessionStart (carrega o estado automaticamente) e um hook Stop (salva o estado automaticamente no fim da sessão). Roda uma vez por ferramenta e é idempotente.',
      },
      {
        title: 'Biblioteca de prompts (opcional)',
        desc: 'Pergunta se deve instalar 232 skills, 77 comandos e 61 agentes; o padrão é não. A partir da v1.1.22, egc install --prompt-library responde sim sem perguntar e --no-prompt-library pula a pergunta. No CI, ela é pulada automaticamente.',
      },
      {
        title: 'Shim binário do Token Crusher',
        desc: 'Instala, como etapa de melhor esforço, um shim no PATH (git, npm, gh e outros) em ~/.egc/bin. Cobre uma lacuna conhecida: no Claude Code, o hook automático nunca dispara para os comandos que o próprio assistente de IA executa.',
      },
    ],
    expectedTitle: 'Saída esperada',
    verifyTitle: 'Confira a instalação',
    notFound: (
      <>
        Se uma ferramenta aparecer como <code className={codeClass}>not found</code>, ela não está
        instalada ou não foi detectada. Depois de instalar a ferramenta, rode{' '}
        <code className={codeClass}>egc install</code> de novo (ou{' '}
        <code className={codeClass}>egc init</code> dentro de um projeto).
      </>
    ),
    nextTitle: 'Próximos passos',
    cards: [
      {
        href: '/docs/memory/',
        title: 'egc-memory',
        desc: 'Entenda como funcionam o get_state e o update_state.',
      },
      {
        href: '/docs/guardian/',
        title: 'egc-guardian',
        desc: 'Conheça a camada de validação e segurança.',
      },
      {
        href: '/features/',
        title: 'Funções',
        desc: 'Visão completa das funções e detalhes da biblioteca de prompts.',
      },
      {
        href: '/docs/cli/',
        title: 'Referência da CLI',
        desc: 'Todos os comandos do egc explicados.',
      },
    ],
  },
};

export function getStartedMetadata(lang: Lang) {
  return COPY[lang].meta;
}

const terminalDots = (
  <>
    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />{' '}
    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />{' '}
    <span className="w-2.5 h-2.5 rounded-full bg-green-500" />{' '}
  </>
);

const sourceInstall = (
  <code>
    <span className="text-egc-400">{'$'}</span>
    {' git clone https://github.com/Fmarzochi/EGC.git\n'}
    <span className="text-egc-400">{'$'}</span>
    {' cd EGC\n'}
    <span className="text-egc-400">{'$'}</span>
    {' sh scripts/install.sh'}
  </code>
);

const tabClass =
  'install-tab relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-3 text-sm font-semibold min-h-[44px]';
const preClass =
  'bg-gray-900 p-4 sm:p-5 text-gray-100 text-xs sm:text-sm font-mono overflow-x-auto m-0 rounded-none';
const noteClass =
  'p-4 sm:p-5 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800';

export default function GetStarted({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const nodeLink = (
    <a
      href="https://nodejs.org/en/download"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.downloadNode}
      className="text-egc-600 dark:text-egc-400 underline underline-offset-2"
    >
      Node.js 20+
    </a>
  );

  return (
    <DocsShell current="get-started" lang={lang}>
      <div className="pb-2 mb-8 border-b border-gray-200 dark:border-gray-800">
        <p className="text-xs font-semibold uppercase tracking-widest text-egc-600 dark:text-egc-400 mb-2">
          {t.eyebrow}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          {t.title}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{t.lead}</p>
      </div>

      {/* Requirements */}
      <section className="mb-10 install-step" data-step={t.steps.prepare}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.requirements}</h2>
        <p className="sm:hidden text-xs text-gray-400 mb-2">{t.scrollHint}</p>
        <div
          className="table-scroll rounded-xl border border-gray-200 dark:border-gray-800 w-full"
          role="region"
          aria-label={t.requirementsLabel}
          tabIndex={0}
        >
          <table className="w-full text-sm min-w-[480px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                {t.columns.map((column) => (
                  <th
                    key={column}
                    scope="col"
                    className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              <tr className="bg-white dark:bg-gray-950">
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Node.js</td>
                <td className="px-4 py-3">
                  <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded font-mono">
                    20+
                  </code>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">
                  node --version
                </td>
              </tr>
              <tr className="bg-gray-50/50 dark:bg-gray-900/30">
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Git</td>
                <td className="px-4 py-3">
                  <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded font-mono">
                    {t.any}
                  </code>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">
                  git --version
                </td>
              </tr>
              <tr className="bg-white dark:bg-gray-950">
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{t.os}</td>
                <td className="px-4 py-3">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Linux, macOS, Windows
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400" />
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Install methods */}
      <section className="mb-10 install-step" data-step={t.steps.choose}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.chooseTitle}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t.chooseLead}</p>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
          <span className="text-egc-400 font-mono text-sm mr-2">03 /</span>
          {t.run}
        </h3>

        {/* Method tabs */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          {/* Tab bar: scrollable on mobile, no visible scrollbar */}
          <div
            role="tablist"
            aria-label={t.methodLabel}
            className="install-tab-bar flex border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 overflow-x-auto"
          >
            <button
              id="tab-npm"
              className={`${tabClass} active transition-all duration-150`}
              data-tab="npm"
              role="tab"
              aria-selected="true"
              aria-controls="panel-npm"
              tabIndex={0}
              type="button"
            >
              {/* npm icon */}
              <svg
                className="w-5 h-5 shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323h13.837v13.629h-3.502V8.69h-3.377v10.262H5.13z" />
              </svg>{' '}
              <span className="whitespace-nowrap">npm</span>{' '}
              <span className="hidden xs:inline-flex ml-1 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-egc-100 dark:bg-egc-900/50 text-egc-700 dark:text-egc-400">
                {t.recommended}
              </span>
            </button>{' '}
            <button
              id="tab-linux"
              className={`${tabClass} transition-colors duration-150`}
              data-tab="linux"
              role="tab"
              aria-selected="false"
              aria-controls="panel-linux"
              tabIndex={-1}
              type="button"
            >
              {/* Linux (Tux) icon */}
              <svg
                className="w-5 h-5 shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.022 1.903 1.395.81.401 1.726.57 2.34.467.307-.065.56-.26.713-.552.512-.882.064-1.547-.12-1.792l-.053-.07a2.551 2.551 0 01-.172-.573c-.015-.131.017-.322.076-.451.336-.717.09-1.384-.272-1.845-.298-.378-.667-.6-.91-.727l-.108-.044a1.95 1.95 0 01-.368-.353c-.267-.359-.465-.799-.725-1.159-.122-.169-.376-.479-.553-.652-.4-.398-.646-.654-.646-1.072 0-.412.163-.855.283-1.267.127-.42.243-.805.217-1.133-.063-.79-.512-1.47-.855-2.012l-.07-.106c-.39-.6-.66-.994-.917-1.78-.264-.812-.363-1.725-.31-2.596.035-.475.095-.787.176-1.134l.01-.042c.03-.122.06-.238.07-.36.01-.12.004-.233-.01-.337C14.078 1.147 13.318 0 12.504 0z" />
              </svg>{' '}
              <span className="whitespace-nowrap">Linux</span>
            </button>{' '}
            <button
              id="tab-macos"
              className={`${tabClass} transition-colors duration-150`}
              data-tab="macos"
              role="tab"
              aria-selected="false"
              aria-controls="panel-macos"
              tabIndex={-1}
              type="button"
            >
              {/* Apple icon */}
              <svg
                className="w-5 h-5 shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
              </svg>{' '}
              <span className="whitespace-nowrap">macOS</span>
            </button>{' '}
            <button
              id="tab-windows"
              className={`${tabClass} transition-colors duration-150`}
              data-tab="windows"
              role="tab"
              aria-selected="false"
              aria-controls="panel-windows"
              tabIndex={-1}
              type="button"
            >
              {/* Windows icon */}
              <svg
                className="w-5 h-5 shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
              </svg>{' '}
              <span className="whitespace-nowrap">Windows</span>
            </button>
          </div>

          {/* npm panel (recommended) */}
          <div
            id="panel-npm"
            role="tabpanel"
            aria-labelledby="tab-npm"
            tabIndex={0}
            className="install-panel"
          >
            <div className={noteClass}>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-egc-100 dark:bg-egc-900/30 text-egc-700 dark:text-egc-400">
                  <svg
                    className="w-3 h-3"
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
                  {t.fastest}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t.npmWorks}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.versionManagers}</p>
            </div>
            <div className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-900 border-b border-gray-700">
              {terminalDots}
              <span className="ml-2 text-xs text-gray-400 font-mono">terminal</span>
            </div>
            <pre className={preClass}>
              <code>
                <span className="text-egc-400">{'$'}</span>
                {' npm install -g @egchq/egc\n'}
                <span className="text-egc-400">{'$'}</span>
                {' egc install'}
              </code>
            </pre>
            <div className="p-4 sm:p-5 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">{t.permissions}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t.wakeUp}</p>
            </div>
          </div>

          {/* Linux panel */}
          <div
            id="panel-linux"
            role="tabpanel"
            aria-labelledby="tab-linux"
            tabIndex={0}
            className="install-panel hidden"
          >
            <div className={noteClass}>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t.needNode(nodeLink)}</p>
            </div>
            <div className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-900 border-b border-gray-700">
              {terminalDots}
              <span className="ml-2 text-xs text-gray-400 font-mono">bash</span>
            </div>
            <pre className={preClass}>{sourceInstall}</pre>
          </div>

          {/* macOS panel */}
          <div
            id="panel-macos"
            role="tabpanel"
            aria-labelledby="tab-macos"
            tabIndex={0}
            className="install-panel hidden"
          >
            <div className={noteClass}>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t.needNode(nodeLink)}</p>
            </div>
            <div className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-900 border-b border-gray-700">
              {terminalDots}
              <span className="ml-2 text-xs text-gray-400 font-mono">zsh</span>
            </div>
            <pre className={preClass}>{sourceInstall}</pre>
          </div>

          {/* Windows panel */}
          <div
            id="panel-windows"
            role="tabpanel"
            aria-labelledby="tab-windows"
            tabIndex={0}
            className="install-panel hidden"
          >
            <div className={noteClass}>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t.needNodeWindows(nodeLink)}
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-900 border-b border-gray-700">
              {terminalDots}
              <span className="ml-2 text-xs text-gray-400 font-mono">powershell</span>
            </div>
            <pre className={preClass}>
              <code>
                <span className="text-egc-400">{'PS>'}</span>
                {' git clone https://github.com/Fmarzochi/EGC.git\n'}
                <span className="text-egc-400">{'PS>'}</span>
                {' cd EGC\n'}
                <span className="text-egc-400">{'PS>'}</span>
                {' .\\scripts\\install.ps1'}
              </code>
            </pre>
            <div className="p-4 sm:p-5 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">{t.upgrading}</p>
            </div>
          </div>
        </div>
      </section>

      {/* What the installer does */}
      <section className="mb-10 install-step" data-step={t.steps.understand}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.installerTitle}</h2>
        <div className="space-y-3">
          {t.installerSteps.map((step, i) => (
            <div key={step.title} className="flex gap-3 sm:gap-4">
              <div className="shrink-0 w-7 h-7 rounded-full bg-egc-100 dark:bg-egc-900/30 text-egc-700 dark:text-egc-400 flex items-center justify-center text-sm font-bold">
                {i + 1}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{step.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 break-words">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Expected output */}
      <section className="mb-10 install-step" data-step={t.steps.expect}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.expectedTitle}</h2>
        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-900 border-b border-gray-700">
            <span className="text-xs text-gray-400 font-mono">terminal</span>
          </div>
          <pre className="bg-gray-900 p-4 sm:p-5 text-xs sm:text-sm font-mono overflow-x-auto m-0 rounded-none">
            <code>
              <span className="text-egc-400">{'EGC install'}</span>
              {
                '\n  node v22.0.0\n  building egc-guardian...\n  building egc-memory...\n  initializing database...\n  bootstrapping cognitive protocol...\n  '
              }
              <span className="text-green-400">{'✓'}</span>
              {' ~/.claude/CLAUDE.md updated\n  '}
              <span className="text-green-400">{'✓'}</span>
              {' ~/.gemini/GEMINI.md updated\n  registering MCP servers...\n  '}
              <span className="text-green-400">{'✓'}</span>
              {' registered in Antigravity CLI\n  '}
              <span className="text-green-400">{'✓'}</span>
              {' registered in Claude Code (global)\n  '}
              <span className="text-green-400">{'✓'}</span>
              {' registered in Cursor\n  '}
              <span className="text-green-400">{'✓'}</span>
              {' registered in Codex CLI\n  '}
              <span className="text-green-400">{'✓'}</span>
              {' registered in OpenCode\n  '}
              <span className="text-green-400">{'✓'}</span>
              {
                ' registered in Zed\n\nInstall prompt library? (61 agents, 232 skills, 77 commands) [y/N]:\n\n  Installing Token Crusher binary shim...\n  '
              }
              <span className="text-green-400">{'✓'}</span>
              {' Installed: git, npm, gh, ...\n\n'}
              <span className="text-green-400">{'Installation complete.'}</span>
              {"\nRun 'egc doctor' to verify."}
            </code>
          </pre>
        </div>
      </section>

      {/* Verify */}
      <section className="mb-10 install-step" data-step={t.steps.verify}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.verifyTitle}</h2>
        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 mb-4">
          <pre className="bg-gray-900 p-4 sm:p-5 text-xs sm:text-sm font-mono text-gray-100 overflow-x-auto m-0 rounded-none">
            <code>
              <span className="text-egc-400">{'$'}</span>
              {' egc doctor\n\n'}
              <span className="text-green-400">{'egc-guardian  running'}</span>
              {'\n'}
              <span className="text-green-400">{'egc-memory    running'}</span>
              {'\ndatabase      '}
              <span className="text-green-400">{'ok'}</span>
              {'\nclaude code   '}
              <span className="text-green-400">{'registered'}</span>
              {'\ncursor        '}
              <span className="text-green-400">{'registered'}</span>
            </code>
          </pre>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{t.notFound}</p>
      </section>

      {/* Next steps */}
      <section className="mb-4 install-step" data-step={t.steps.next}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.nextTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {t.cards.map((card) => (
            <Link
              key={card.href}
              href={localePath(lang, card.href)}
              className="block rounded-xl p-4 sm:p-5 hover-lift hover-glow transition-all duration-300 glass min-h-[44px]"
            >
              <p className="font-semibold text-gray-900 dark:text-white mb-1">{card.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{card.desc}</p>
            </Link>
          ))}
        </div>
      </section>
      <InstallTabsBehavior />
    </DocsShell>
  );
}
