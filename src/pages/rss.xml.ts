import rss from '@astrojs/rss';
import type { APIContext } from 'astro';

const releases = [
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
