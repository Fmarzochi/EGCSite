import rss from '@astrojs/rss';
import type { APIContext } from 'astro';

const releases = [
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
