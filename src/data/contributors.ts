export const OWNER = 'Fmarzochi';
export const REPO = 'EGC';
export const EXCLUDED = new Set([OWNER, 'dependabot[bot]', 'github-actions[bot]']);

export type Tier = 'core' | 'gold' | 'silver' | 'community';

export interface BadgeDef {
  icon: string;
  label: string;
  color: string;
}

export interface HighlightEntry {
  name: string;
  highlight: string;
  since: string;
  prs: number;
  commits: number;
  badges: string[];
  additions?: number;
}

export interface Contributor {
  login: string;
  name: string;
  avatar: string;
  commits: number;
  additions: number;
  highlight: string;
  since: string;
  prs: number;
  badges: string[];
  tier: Tier;
}

export interface MonthlyChampion {
  login: string;
  name: string;
  month: string;
  reason: string;
}

type RawStat = {
  author: { login: string };
  total: number;
  weeks: { w: number; a: number; d: number; c: number }[];
};

export const BADGE_DEFS: Record<string, BadgeDef> = {
  pioneer:       { icon: '🌟', label: 'Pioneer',        color: 'text-yellow-300 bg-yellow-400/10 border border-yellow-400/30' },
  bugHunter:     { icon: '🐛', label: 'Bug Hunter',     color: 'text-green-400 bg-green-400/10 border border-green-400/30' },
  translator:    { icon: '🌍', label: 'Translator',     color: 'text-blue-400 bg-blue-400/10 border border-blue-400/30' },
  speedDemon:    { icon: '⚡', label: 'Speed Demon',    color: 'text-orange-400 bg-orange-400/10 border border-orange-400/30' },
  reliability:   { icon: '🔧', label: 'Reliability',    color: 'text-slate-300 bg-slate-400/10 border border-slate-400/30' },
  crossPlatform: { icon: '🌐', label: 'Cross-Platform', color: 'text-sky-400 bg-sky-400/10 border border-sky-400/30' },
  newFeature:    { icon: '📦', label: 'New Feature',    color: 'text-purple-400 bg-purple-400/10 border border-purple-400/30' },
  codeQuality:   { icon: '✨', label: 'Code Quality',   color: 'text-pink-400 bg-pink-400/10 border border-pink-400/30' },
  coAuthor:      { icon: '🤝', label: 'Co-Author',      color: 'text-gray-400 bg-gray-400/10 border border-gray-400/30' },
  cli:           { icon: '💻', label: 'CLI Expert',     color: 'text-egc-400 bg-egc-400/10 border border-egc-400/30' },
  multiFeature:  { icon: '🚀', label: 'Multi-Feature',  color: 'text-indigo-400 bg-indigo-400/10 border border-indigo-400/30' },
  security:      { icon: '🔒', label: 'Security',       color: 'text-red-400 bg-red-400/10 border border-red-400/30' },
};

export const TIER_CONFIG: Record<Tier, { label: string; minCommits: number; color: string; ring: string; icon: string }> = {
  core:      { label: 'Core Maintainer',    minCommits: 10, color: 'text-yellow-300 bg-yellow-400/20 border-yellow-400/50', ring: 'ring-yellow-400/60', icon: '🏆' },
  gold:      { label: 'Gold Contributor',   minCommits: 4,  color: 'text-amber-400 bg-amber-400/20 border-amber-400/50',   ring: 'ring-amber-400/60',  icon: '🥇' },
  silver:    { label: 'Silver Contributor', minCommits: 2,  color: 'text-slate-300 bg-slate-400/20 border-slate-400/50',   ring: 'ring-slate-400/60',  icon: '🥈' },
  community: { label: 'Community Member',   minCommits: 0,  color: 'text-egc-400 bg-egc-500/20 border-egc-500/50',         ring: 'ring-egc-500/60',    icon: '⭐' },
};

export function getTier(commits: number): Tier {
  if (commits >= TIER_CONFIG.core.minCommits) return 'core';
  if (commits >= TIER_CONFIG.gold.minCommits) return 'gold';
  if (commits >= TIER_CONFIG.silver.minCommits) return 'silver';
  return 'community';
}

export const highlights: Record<string, HighlightEntry> = {
  Kunall7890:           { name: 'Kunal Jaiswal',     highlight: 'Zed editor support, compress_observations MCP tool, multiple runtime fixes, dashboard cost widget with time-range filter, team memory sync via git backend, session budget guardian with token and cost limits, and plugin registry with npm and local path support', since: 'Jun 11, 2026', prs: 12, commits: 15, badges: ['pioneer', 'multiFeature', 'newFeature', 'reliability'], additions: 3597 },
  gaoflow:              { name: 'Vincent Gao',        highlight: 'Fixed critical bugs across all AI providers (OpenAI, Claude, Gemini, Ollama) in a single day', since: 'Jun 22, 2026', prs: 5, commits: 5, badges: ['bugHunter', 'speedDemon'],                    additions: 203  },
  muhammadhasnain3031:  { name: 'Muhammad Husnain',   highlight: 'OpenRouter model mappings (DeepSeek, Qwen, Llama), Arabic and Hindi README translations', since: 'Jun 19, 2026', prs: 3, commits: 3, badges: ['translator', 'multiFeature'],                 additions: 406  },
  'NITESH-DTU':         { name: 'Nitesh Kumar',       highlight: 'Fixed two critical egc-memory bugs back to back',                           since: 'Jun 16, 2026', prs: 2, commits: 2, badges: ['bugHunter', 'reliability'],                   additions: 164  },
  'vasu-sachdeva':      { name: 'Vasu Sachdeva',      highlight: 'Null safety fixes across Claude and Ollama providers',                      since: 'Jun 23, 2026', prs: 1, commits: 2, badges: ['reliability'],                               additions: 5    },
  shekar50:             { name: 'Shekar',              highlight: 'Usage analytics heatmap and per-provider token/cost breakdown in the dashboard Cost Summary panel',   since: 'Jun 25, 2026', prs: 2, commits: 2, badges: ['newFeature'],                                additions: 374  },
  shantoshdurai:        { name: 'Santosh Durai',       highlight: 'Added --version/-v flag to the EGC CLI',                                    since: 'Jun 10, 2026', prs: 1, commits: 1, badges: ['pioneer', 'cli'],                           additions: 23   },
  koteshyelamati:       { name: 'Kotesh Yelamati',     highlight: 'Windows HOME/USERPROFILE environment variable fix',                         since: 'Jun 17, 2026', prs: 1, commits: 1, badges: ['crossPlatform'],                            additions: 16   },
  'Om-Beast':           { name: 'Om Kesharwani',      highlight: 'JetBrains Junie install target, opening EGC to the JetBrains IDE family', since: 'Jul 18, 2026', prs: 1, commits: 1, badges: ['newFeature'],                               additions: 51   },
  lesbass:              { name: 'Stefano Maffeis',     highlight: 'JSONDecodeError fix in OpenAI and OpenRouter providers',                    since: 'Jun 22, 2026', prs: 1, commits: 1, badges: ['bugHunter'],                               additions: 12   },
  'srivastava-prakhar': { name: 'Prakhar Srivastava',  highlight: 'Narrowed overly broad exception handling in model selector',               since: 'Jun 23, 2026', prs: 1, commits: 1, badges: ['codeQuality'],                             additions: 1    },
  ayushikaul02:         { name: 'Ayushi Kaul',         highlight: 'Co-authored fix for bare except in Gemini provider',                       since: 'Jun 22, 2026', prs: 1, commits: 2, badges: ['coAuthor'],                               additions: 12   },
  krishna3554:          { name: 'Krishna Lokhande',    highlight: 'Co-authored fix for AttributeError in Claude provider',                    since: 'Jun 22, 2026', prs: 1, commits: 1, badges: ['coAuthor'],                               additions: 100  },
  vaishnavidesai09:     { name: 'Vaishnavi Desai',     highlight: 'Co-authored Ollama usage token fix in the provider layer',                 since: 'Jun 22, 2026', prs: 1, commits: 1, badges: ['coAuthor'],                               additions: 8    },
  minus43:              { name: 'minus43',              highlight: 'First Korean README translation, bringing EGC to Korean-speaking developers', since: 'Jun 29, 2026', prs: 1, commits: 1, badges: ['translator', 'pioneer'],                additions: 193  },
  Maqbool61:            { name: 'Maqbool Ahmed',        highlight: 'Fixed /stats overcounting, cost gate for unsupported IDEs, chmod 600 hardening, aider-watcher reset on file truncation, hybrid debounce with extension filtering, Continue.dev MCP registration, audit-log.ts with recursive secret redaction and 5 MB rotation, egc replay with timeline scrubbing, HMAC-SHA256 integrity check on state files, native Zed IDE integration via template-driven mcp-register.js, AES-256-GCM encryption for .md state files at rest with backward-compatible migration, native DeepSeek provider integration, post-merge hardening (temperature normalization, exception retagging, provider resolution), and Mistral/DeepSeek model registry cleanup (vision capability fix, dead test stub removal, native DeepSeek model ID resolution)', since: 'Jun 29, 2026', prs: 14, commits: 14, badges: ['bugHunter', 'reliability', 'newFeature', 'multiFeature', 'security'], additions: 3028 },
  'Ap-0007':            { name: 'vanta.nox',            highlight: 'Proposed 4 security hardening improvements: state file permission hardening, path traversal guard, dedicated audit log, and MCP rate limiter', since: 'Jun 30, 2026', prs: 1, commits: 1, badges: ['coAuthor', 'codeQuality'], additions: 30 },
  BlackPool25:          { name: 'Shreyas S Joshi',      highlight: 'Guard clause + factory pattern for accumulateEvent with 8 regression tests, closing a telemetry state corruption bug',                           since: 'Jun 30, 2026', prs: 1, commits: 1, badges: ['bugHunter', 'codeQuality'],              additions: 224 },
  Vile93:               { name: 'Vile',                  highlight: 'Fixed path traversal vulnerability in dashboard static file server, full Russian README translation, and VS Code Copilot log detection by newest modification time', since: 'Jun 30, 2026', prs: 3, commits: 3, badges: ['bugHunter', 'codeQuality', 'translator'], additions: 215 },
  developmentwithparth1311: { name: 'Parth',            highlight: 'Scoped rate limiter per project path in egc-guardian; capped POST /event body at 256 KB to prevent memory exhaustion DoS; strict CLI flag validation in egc replay rejecting unrecognized options; native Mistral AI provider integration', since: 'Jun 30, 2026', prs: 4, commits: 4, badges: ['newFeature', 'reliability', 'bugHunter', 'codeQuality'], additions: 436 },
  'VIUK-XV':            { name: 'VIUK-XV',               highlight: 'First Japanese README translation, bringing EGC to Japanese-speaking developers', since: 'Jul 3, 2026', prs: 1, commits: 0, badges: ['translator', 'pioneer'], additions: 199 },
  fuentes71:            { name: 'Mateus Fuentes',         highlight: 'Security audit and reliability sweep across 12 PRs: shell-injection fix (spawnSync), atomic SQLite migrations, SEC-05 byte-load limits, Zod schema enforcement, TOCTOU getDb fix, JSON parse crash guard, hook dispatcher, stdin leak, SQLITE_FULL handling, async trace log, path traversal guard in egc-memory, db-adapter persist error handling, and arbitration queue invariant documentation with stress test', since: 'Jul 3, 2026', prs: 12, commits: 14, badges: ['bugHunter', 'crossPlatform', 'security'], additions: 295 },
};

function prevMonthLabel(): string {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

function computeMonthlyChampion(rawStats: RawStat[]): MonthlyChampion | null {
  const now = new Date();
  const prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevEnd = new Date(now.getFullYear(), now.getMonth(), 1);

  let topLogin = '';
  let topCommits = 0;
  let topAdditions = 0;

  for (const c of rawStats) {
    if (EXCLUDED.has(c.author.login) || c.author.login.includes('[bot]')) continue;
    let monthCommits = 0;
    let monthAdditions = 0;
    for (const w of c.weeks) {
      const weekDate = new Date(w.w * 1000);
      if (weekDate >= prevStart && weekDate < prevEnd) {
        monthCommits += w.c;
        monthAdditions += w.a;
      }
    }
    if (monthCommits > topCommits || (monthCommits === topCommits && monthAdditions > topAdditions)) {
      topCommits = monthCommits;
      topAdditions = monthAdditions;
      topLogin = c.author.login;
    }
  }

  if (!topLogin || topCommits === 0) return null;

  const info = highlights[topLogin];
  const month = prevMonthLabel();
  const stats = `${topCommits} commit${topCommits !== 1 ? 's' : ''}${topAdditions > 0 ? ` and +${topAdditions.toLocaleString('en')} lines` : ''} in ${month}.`;
  const reason = info?.highlight ? `${info.highlight} -- ${stats}` : stats;

  return {
    login: topLogin,
    name: info?.name ?? topLogin,
    month,
    reason,
  };
}

export async function fetchContributors(githubToken?: string): Promise<{
  contributors: Contributor[];
  champion: MonthlyChampion | null;
}> {
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
  if (githubToken) headers['Authorization'] = `Bearer ${githubToken}`;

  let statsRes: Response | undefined;
  for (let attempt = 0; attempt < 4; attempt++) {
    statsRes = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/stats/contributors`,
      { headers }
    );
    if (statsRes.status !== 202) break;
    await new Promise(r => setTimeout(r, 3000));
  }

  if (!statsRes || statsRes.status === 202 || !statsRes.ok) throw new Error('GitHub API not ready');

  const statsData = await statsRes.json() as RawStat[];

  const contributors = statsData
    .filter(c => !EXCLUDED.has(c.author.login) && !c.author.login.includes('[bot]'))
    .sort((a, b) => b.total - a.total)
    .map(c => {
      const additions = c.weeks.reduce((sum, w) => sum + w.a, 0);
      const info = highlights[c.author.login];
      const commits = c.total;
      return {
        login: c.author.login,
        name: info?.name ?? c.author.login,
        avatar: `https://github.com/${c.author.login}.png`,
        commits,
        additions,
        highlight: info?.highlight ?? 'Contributed to EGC',
        since: info?.since ?? '',
        prs: info?.prs ?? 1,
        badges: info?.badges ?? [],
        tier: getTier(commits),
      };
    });

  if (contributors.length === 0) throw new Error('Empty contributor list');

  return { contributors, champion: computeMonthlyChampion(statsData) };
}

export function buildFallback(): Contributor[] {
  return Object.entries(highlights)
    .sort((a, b) => b[1].commits - a[1].commits)
    .map(([login, info]) => ({
      login,
      name: info.name,
      avatar: `https://github.com/${login}.png`,
      commits: info.commits,
      additions: info.additions ?? 0,
      highlight: info.highlight,
      since: info.since,
      prs: info.prs,
      badges: info.badges,
      tier: getTier(info.commits),
    }));
}
