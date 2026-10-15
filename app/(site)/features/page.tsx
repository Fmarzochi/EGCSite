import DocsShell from '@/components/docs/DocsShell';
import { integrations } from '@/data/integrations';
import { docsMetadata } from '@/lib/seo';

// Ported from src/pages/features.astro.

export const metadata = docsMetadata({
  title: 'Features',
  description:
    'Full feature overview: persistent memory, prompt library, multi-tool support, security, and more.',
  route: 'features/',
});

export default function FeaturesPage() {
  return (
    <DocsShell current="features">
      <div className="pb-2 mb-8 border-b border-gray-200 dark:border-gray-800">
        <p className="text-xs font-semibold uppercase tracking-widest text-egc-600 dark:text-egc-400 mb-2">
          Getting Started
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Features
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Everything EGC provides out of the box.
        </p>
      </div>

      {/* Core features */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Core capabilities</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
          The runtime capabilities that keep context, sessions and tool behavior aligned.
        </p>
        <div className="editorial-list grid grid-cols-1 md:grid-cols-2 gap-x-8">
          {[
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
          ].map((card) => (
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
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Prompt library</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
          Optional and off by default: the installer asks (default no), egc install --prompt-library
          adds it later, and the engine works exactly the same without it. Written from real
          experience, not generated.
        </p>
        <p className="sm:hidden text-xs text-gray-400 mb-2">
          Scroll the table horizontally for all columns.
        </p>
        <div
          className="table-scroll rounded-xl border border-gray-200 dark:border-gray-800 w-full mb-5"
          role="region"
          aria-label="Prompt library quantities"
          tabIndex={0}
        >
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <th
                  scope="col"
                  className="px-5 py-3 text-left font-semibold text-gray-700 dark:text-gray-300"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-center font-semibold text-gray-700 dark:text-gray-300"
                >
                  Count
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-left font-semibold text-gray-700 dark:text-gray-300"
                >
                  What it is
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {[
                { type: 'Agents', count: '61', desc: 'Persona and behavior definitions' },
                { type: 'Skills', count: '232', desc: 'Domain-specific workflow runbooks' },
                { type: 'Commands', count: '77', desc: 'Command definitions and lifecycle hooks' },
                { type: 'Rules', count: '109', desc: 'Constraints and governance directives' },
              ].map((row) => (
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
          Organized per harness: works in{' '}
          <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">
            .cursor/
          </code>
          ,{' '}
          <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">
            .claude/
          </code>
          ,{' '}
          <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">
            .gemini/
          </code>
          , and more. Switch tools and the same workflows follow you.
        </p>
      </section>

      {/* Supported tools */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Supported tools</h2>
        <p className="sm:hidden text-xs text-gray-400 mb-2">
          Scroll the table horizontally for all columns.
        </p>
        <div
          className="table-scroll rounded-xl border border-gray-200 dark:border-gray-800 w-full"
          role="region"
          aria-label="Supported tools and bootstrap paths"
          tabIndex={0}
        >
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <th
                  scope="col"
                  className="px-5 py-3 text-left font-semibold text-gray-700 dark:text-gray-300"
                >
                  Tool
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-center font-semibold text-gray-700 dark:text-gray-300"
                >
                  MCP
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-left font-semibold text-gray-700 dark:text-gray-300"
                >
                  Bootstrap
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {[
                { tool: 'Claude Code', mcp: true, bootstrap: '~/.claude/CLAUDE.md' },
                { tool: 'Antigravity CLI', mcp: true, bootstrap: '~/.gemini/GEMINI.md' },
                { tool: 'Cursor', mcp: true, bootstrap: 'project .cursor/rules/' },
                { tool: 'Codex CLI', mcp: true, bootstrap: '~/.codex/config.toml' },
                {
                  tool: 'OpenCode',
                  mcp: true,
                  bootstrap: '~/.config/opencode/ (plugin, instructions, skills)',
                },
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
              ].map((row) => (
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
                      <span className="text-xs text-gray-400 dark:text-gray-300">context</span>
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
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Supported LLM providers
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
          EGC routes to any supported provider via{' '}
          <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">
            ModelResolver
          </code>
          . Fallback chains degrade automatically when a model is unavailable.
        </p>
        <p className="sm:hidden text-xs text-gray-400 mb-2">
          Scroll the table horizontally for all columns.
        </p>
        <div
          className="table-scroll rounded-xl border border-gray-200 dark:border-gray-800 w-full"
          role="region"
          aria-label="Supported LLM providers and models"
          tabIndex={0}
        >
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <th
                  scope="col"
                  className="px-5 py-3 text-left font-semibold text-gray-700 dark:text-gray-300"
                >
                  Provider
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-left font-semibold text-gray-700 dark:text-gray-300"
                >
                  Models
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {[
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
                { provider: 'Vertex AI', models: 'Gemini through Google Cloud' },
                {
                  provider: 'OpenRouter',
                  models:
                    'DeepSeek R1, DeepSeek Chat V3, Qwen3 235B, Qwen3 32B, Llama 4 Maverick, Llama 4 Scout, Llama 3.3 70B, Gemini 2.5 via OR, GPT-4o via OR, and more',
                },
                { provider: 'Ollama', models: 'Llama 3.2, Mistral, CodeLlama (local, offline)' },
              ].map((row) => (
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
