import rss from '@astrojs/rss';
import type { APIContext } from 'astro';

const releases = [
  {
    title: 'EGC v1.1.21',
    pubDate: new Date('2026-09-05'),
    description:
      'The hardening round: an eighteen-step security pass across the memory server, the installer, the hooks and the dashboard, with tighter defaults and stricter checks on what EGC accepts from disk, from the network and from the tools it talks to, each step with its own tests. Plus the September field fixes: egc install on a root-owned npm prefix, MCP servers on older glibc, every egc help exiting 0, Windsurf hooks coexisting, and the EGC Scrubber.',
    link: 'https://github.com/Fmarzochi/EGC/releases/tag/v1.1.21',
  },
  {
    title: 'EGC v1.1.20',
    pubDate: new Date('2026-08-16'),
    description:
      'The Real-Time Session Mesh, hardened: the recommended release of the mesh line. Everything v1.1.19 shipped plus the corrections born from its own release process: the PowerShell install suite adopts the shared Windows subprocess budgets (a hardcoded 30s cap starved a slow cold runner during tag validation while the bit-identical script passed everywhere else), the chaos harness gained cleanup guarantees (workers die with their parent, the temp directory survives no failure path), and the release checklist now codifies the gates that were missing: the tag-ref CI run must finish green, the inbox swept, and the published artifact verified end to end before any announcement. This was the first release shipped under the full protocol.',
  },
  {
    title: 'EGC v1.1.19',
    pubDate: new Date('2026-08-16'),
    description:
      'The Real-Time Session Mesh release. Every open tab of your AI tools now knows what the others are doing, live: wake-on-write transport with session_wait long-polling (push ON by default, EGC_MESH_PUSH=0 opts out), cognitive protocol v4 teaching every install to announce presence, drain events on the [egc-mesh] notice, claim paths before shared edits, and park when idle, plus a native turn-boundary wake signal on Claude Code, Antigravity (project and global), Codex CLI, Trae, Amp, and Kiro. Measured on real machines: 26ms wake, p95 11ms, zero loss or duplication at 1000 events across 10 subscribers, with the per-harness delivery map in the integration-tiers spec kept honest by a parity test. Gemini CLI, Continue.dev, and Roo Code retired after their vendors discontinued them: an honest 20 supported tools, with egc auto-update skipping retired targets instead of crashing. The session bus was proven under fire by the expert chaos audition, which surfaced a real double-delivery race between overlapping readers, fixed in the same PR with a compare-and-swap on the event cursor and hardened in a same-night follow-up. The dashboard gained an operable session bus view.',
  },
  {
    title: 'EGC v1.1.18',
    pubDate: new Date('2026-08-06'),
    description:
      'Production hardening across 20+ pull requests. Root cause of the sandboxed-install crashes fixed: the Token Crusher PATH shim could fork-bomb the host under an isolated HOME; resolution is now anchored to the launcher physical directory with a circuit breaker, covered by POSIX and Windows regression tests. Installers made honest end to end: Claude Code MCP registration goes through the real CLI instead of a dead config file, the bare install merges the project .mcp.json of the invoking directory, one registration list serves all three entry points so Continue.dev and Zed are finally registered everywhere, and the installation guide matches actual behavior. Guardian no longer denies reading paths it only protects against writes, a design approved by two independent security audits. Token Crusher compresses JSON with nested lists, measured 637 KB down to 31 KB on a real payload. egc repair rebuilds what it can instead of abandoning the whole target, MCP server builds are self-contained and cross-platform, Windows sessions no longer drop bridge events on slow cold starts, and neither a repo clone nor the Codex plugin auto-bundles third-party MCP servers any more. Verified before tagging with real end-to-end installs of the packed tarball on physical Linux and macOS machines.',
    link: 'https://github.com/Fmarzochi/EGC/releases/tag/v1.1.18',
  },
  {
    title: 'EGC v1.1.17',
    pubDate: new Date('2026-07-27'),
    description:
      'Bug fix: install.sh was writing Git Bash POSIX-style paths into the MCP config JSON on Windows, which native Windows MCP clients cannot resolve -- the real cause behind unreliable Windows installs. Now detected via uname -s and rewritten through pwd -W. install.ps1 is resynced with install.sh after drifting for several releases: Node version floor, lockfile-aware dependency install, a data-loss bug where a malformed existing MCP config was silently overwritten, Codex CLI TOML path escaping, and a src/ build guard. This release also carries an apology: v1.1.16 shipped with a changelog covering only 2 of the ~25 pull requests actually released, corrected in #1044.',
    link: 'https://github.com/Fmarzochi/EGC/releases/tag/v1.1.17',
  },
  {
    title: 'EGC v1.1.16',
    pubDate: new Date('2026-07-26'),
    description:
      'Security: destructive-CLI hard blocks in the Guardian validator for docker/gh/prisma variants, an absolute-path bypass closed, the bash hook dispatcher now fails closed instead of fail-open on its own errors, and all remaining Dependabot/Scorecard advisories cleared. Fixes: Crowdin translation sync corruption fixed at the root (sync is now one-way, Crowdin to repo only), three runtime bugs from a deep source audit fixed, bare egc install fixed on the published npm package, and the fuzz harness actually fuzzing now instead of running blind. Maintenance: CodeRabbit reviews contributor PRs automatically, and Docker images run as a non-root user via a multi-stage build.',
    link: 'https://github.com/Fmarzochi/EGC/releases/tag/v1.1.16',
  },
  {
    title: 'EGC v1.1.15',
    pubDate: new Date('2026-07-21'),
    description:
      'Current release. Native install targets for Cline, Qwen Code and Roo Code, so egc install wires EGC into three more agents out of the box. Every native LLM provider client now sets an explicit HTTP timeout, and non-streaming providers raise a clear error instead of hanging on stream=True. A French README brings EGC to nine languages. The dashboard serves static files added after startup without a restart and preserves multi-byte UTF-8 split across TCP chunks. High-severity fast-uri and linkify-it advisories patched.',
    link: 'https://github.com/Fmarzochi/EGC/releases/tag/v1.1.15',
  },
  {
    title: 'EGC v1.1.14',
    pubDate: new Date('2026-07-19'),
    description:
      'A full pre-release audit landed 18 hardening PRs in a single day. Guardian validator sealed against glued eval flags, grep pattern-file reads and flag-embedded protected paths; provider errors now redact API keys. The live dashboard starts right after egc install; egc claw (persistent session REPL) and egc harness-audit are first-class CLI commands. First Chinese Simplified README, making eight languages.',
    link: 'https://github.com/Fmarzochi/EGC/releases/tag/v1.1.14',
  },
  {
    title: 'EGC v1.1.13',
    pubDate: new Date('2026-07-18'),
    description:
      'Commit privacy completed: egc init now configures a git clean filter (filter.egc-memory.clean) and binds the four memory propagation files in .git/info/attributes, so git add stages a zeroed blob even when local hooks are bypassed. The working tree keeps the populated memory, the installer prints the action plan before applying it and honors --dry-run, and everything stays local to .git.',
    link: 'https://github.com/Fmarzochi/EGC/releases/tag/v1.1.13',
  },
  {
    title: 'EGC v1.1.12',
    pubDate: new Date('2026-07-18'),
    description:
      'Omnipresent Context: user-wide Global Memory shared across every project (update_state scope global, deduplicated Global Memory section in get_state and the session-start hooks, project always wins), Token Crusher built into the package (egc run compresses noisy shell output up to 90% before it reaches the model, egc saved reports accumulated savings at zero token cost, silent fail-open rewrite in the bash dispatcher), Session Bus MVP (presence, territory and fail-fast cooperative path locks between parallel sessions), commit privacy enforced in three layers with the public baseline scrubbed, multi-session SQLite write arbitration hardened with jitter, and the zero-friction DCO hook finally armed with its executable bit.',
    link: 'https://github.com/Fmarzochi/EGC/releases/tag/v1.1.12',
  },
  {
    title: 'EGC v1.1.11',
    pubDate: new Date('2026-07-16'),
    description:
      'Bug fix: dashboard telemetry and cost showing zero in nearly every session, traced to four root causes -- missing PreToolUse/PostToolUse hook wiring for claude.running, the Stop hook not forwarding the model field, Claude Code omitting token usage from the Stop payload (now read from the session transcript instead), and the /stats regexes never matching the real state-file format (now queried directly from SQLite). Also: cyclomatic complexity reduced in resolveInstallPlan and analyzeRecord, the two largest functions flagged by the EGC-128 security audit, each split into focused single-purpose helpers with the full 2825-test suite kept green.',
    link: 'https://github.com/Fmarzochi/EGC/releases/tag/v1.1.11',
  },
  {
    title: 'EGC v1.1.10',
    pubDate: new Date('2026-07-11'),
    description:
      'Bug fix: egc status always reported "Install health: missing" regardless of actual install state, because upsertInstallState() was never called anywhere in the install pipeline. Both real completion points (a fresh install and repair/auto-update) now sync into the status store right after writing the JSON file.',
    link: 'https://github.com/Fmarzochi/EGC/releases/tag/v1.1.10',
  },
  {
    title: 'EGC v1.1.9',
    pubDate: new Date('2026-07-11'),
    description:
      'Security: TOCTOU race in encryption key generation eliminated (loadOrCreateEncKey now publishes keys atomically). resolveProjectPath cwd/PWD fallback fixed. New: update_state accepts force: true to recover from a state file that fails to decrypt, quarantining the corrupted file instead of blocking forever. Concurrent-access regression tests are now required for changes touching shared files under ~/.egc/.',
    link: 'https://github.com/Fmarzochi/EGC/releases/tag/v1.1.9',
  },
  {
    title: 'EGC v1.1.8',
    pubDate: new Date('2026-07-11'),
    description:
      'New: Continue.dev support as the 14th supported harness. autonomous-lesson-learning skill orchestrates continuous-agent-loop patterns with the egc-memory lesson tools. Security: EGC Guardian credential denylist replaced whole-directory blocks with the specific credential files each AI tool stores. runCommand uses spawnSync with argv tokenization instead of execSync, closing a shell-injection surface.',
    link: 'https://github.com/Fmarzochi/EGC/releases/tag/v1.1.8',
  },
  {
    title: 'EGC v1.1.7',
    pubDate: new Date('2026-07-06'),
    description:
      'Bug fixes: null guards added across stress-test assertions in db-adapter, state-store, and telemetry. telemetry ping() refactored to Promise.resolve().then().catch(), fixing a SonarCloud finding and a subtle test timing issue. Windows libuv crash patch consolidated: idempotent DB close, BOM-safe JSON parsing, async ping() fix, and graceful process exit.',
    link: 'https://github.com/Fmarzochi/EGC/releases/tag/v1.1.7',
  },
  {
    title: 'EGC v1.1.6',
    pubDate: new Date('2026-06-25'),
    description:
      'Usage analytics heatmap in the dashboard (GitHub-style, hour x day-of-week). Node.js < 20 version guard with clear error message. npm install vs git checkout detection in auto-update. Codecov patch check set to informational.',
    link: 'https://github.com/Fmarzochi/EGC/releases/tag/v1.1.6',
  },
  {
    title: 'EGC v1.1.5',
    pubDate: new Date('2026-06-24'),
    description:
      'Bug fixes: SessionStart hook no longer crashes with MODULE_NOT_FOUND (install plan now copies propagate-state and project-detect libs). egc init opens the browser automatically after starting the dashboard. ESLint ignores .claude/worktrees/ and dashboard/ to prevent lint CI failures.',
    link: 'https://github.com/Fmarzochi/EGC/releases/tag/v1.1.5',
  },
  {
    title: 'EGC v1.1.4',
    pubDate: new Date('2026-06-24'),
    description:
      'Hotfix: corrects the npm package to include the dashboard/ directory and the ws dependency, which were missing from the v1.1.3 tarball. Users who installed v1.1.3 and saw "EGC Dashboard not found" should run npm install -g @egchq/egc to get the fix.',
    link: 'https://github.com/Fmarzochi/EGC/releases/tag/v1.1.4',
  },
  {
    title: 'EGC v1.1.3',
    pubDate: new Date('2026-06-24'),
    description:
      'New: EGC Dashboard (egc dashboard) -- real-time Mission Control at localhost:7890, auto-starts after egc install and egc init, WebSocket live feed of tool calls, memory state, token usage and cost. IDE hook emitters for Cursor, Kiro and OpenCode. Security: XSS escaping, CORS restricted to localhost. Bug fixes: OpenAI tool serialization, async ReActAgent, OpenRouter X-Title header, GeminiProvider null content.',
    link: 'https://github.com/Fmarzochi/EGC/releases/tag/v1.1.3',
  },
  {
    title: 'EGC v1.1.2',
    pubDate: new Date('2026-06-20'),
    description:
      'New: egc watch bidirectional sync daemon, auto_learn guardian tool, update_state propagates to 11 tool config files, natural language interface triggers. Guardian pipeline: CacheAligner, ContentRouter, SmartCrusher, Headroom Phase 2. sql.js replaces better-sqlite3 (no native build). GitLab CI mirror, Code of Conduct, undici CVE patch.',
    link: 'https://github.com/Fmarzochi/EGC/releases/tag/v1.1.2',
  },
  {
    title: 'EGC v1.1.1',
    pubDate: new Date('2026-06-19'),
    description:
      'Patch release: FTS5 index on lesson_recall, state DB path via getEGCDir, better-sqlite3 doctor check, harness-aware detect_patterns, bootstrap-state-db test coverage. Community contribution: OpenRouter model mappings for DeepSeek R1/Chat v3, Qwen3 235B/32B, Llama 4 Maverick/Scout, Llama 3.3 70B.',
    link: 'https://github.com/Fmarzochi/EGC/releases/tag/v1.1.1',
  },
  {
    title: 'EGC v1.1.0',
    pubDate: new Date('2026-06-13'),
    description:
      'New tools: compress_observations, detect_patterns, working_memory, lessons, search_history. Branch-aware project state, state consolidation pipeline, deterministic SessionStart hook. Node 20/22/24 CI matrix, SonarCloud, CodeQL, and Dependency Review.',
    link: 'https://github.com/Fmarzochi/EGC/releases/tag/v1.1.0',
  },
  {
    title: 'EGC v1.0.8',
    pubDate: new Date('2024-12-01'),
    description:
      'Initial public release. npx @egchq/egc install flow, ChatMCP catalog entry, OIDC Trusted Publishing for npm, SessionStart and PreCompact hooks for Claude Code.',
    link: 'https://github.com/Fmarzochi/EGC/releases/tag/v1.0.8',
  },
];

export async function GET(context: APIContext) {
  return rss({
    title: 'EGC Releases',
    description: 'New releases of EGC - Extended Global Context. Your AI agents never start from zero again.',
    site: context.site!,
    items: releases.map((r) => ({
      title: r.title,
      pubDate: r.pubDate,
      description: r.description,
      link: r.link,
    })),
    customData: '<language>en-us</language>',
  });
}
