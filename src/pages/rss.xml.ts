import rss from '@astrojs/rss';
import type { APIContext } from 'astro';

const releases = [
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
      'New: EGC Dashboard (egc dashboard) -- real-time Mission Control at localhost:7890, auto-starts after egc init, WebSocket live feed of tool calls, memory state, token usage and cost. IDE hook emitters for Cursor, Kiro and OpenCode. Security: XSS escaping, CORS restricted to localhost. Bug fixes: OpenAI tool serialization, async ReActAgent, OpenRouter X-Title header, GeminiProvider null content.',
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
