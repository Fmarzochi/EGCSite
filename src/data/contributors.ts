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
  Kunall7890:           { name: 'Kunal Jaiswal',     highlight: 'Zed editor support, compress_observations MCP tool, dashboard cost widget with time-range filter', since: 'Jun 11, 2026', prs: 4, badges: ['pioneer', 'multiFeature', 'newFeature'], additions: 1040 },
  gaoflow:              { name: 'Vincent Gao',        highlight: 'Fixed critical bugs across all AI providers in a single day',               since: 'Jun 22, 2026', prs: 2, badges: ['bugHunter', 'speedDemon'],                    additions: 203  },
  muhammadhasnain3031:  { name: 'Muhammad Husnain',   highlight: 'OpenRouter model mappings, Arabic and Hindi README translations',            since: 'Jun 19, 2026', prs: 2, badges: ['translator', 'multiFeature'],                 additions: 406  },
  'NITESH-DTU':         { name: 'Nitesh Kumar',       highlight: 'Fixed two critical egc-memory bugs back to back',                           since: 'Jun 16, 2026', prs: 2, badges: ['bugHunter', 'reliability'],                   additions: 164  },
  'vasu-sachdeva':      { name: 'Vasu Sachdeva',      highlight: 'Null safety fixes across Claude and Ollama providers',                      since: 'Jun 23, 2026', prs: 1, badges: ['reliability'],                               additions: 5    },
  shekar50:             { name: 'Shekar',              highlight: 'Usage analytics heatmap for the dashboard',                                 since: 'Jun 25, 2026', prs: 1, badges: ['newFeature'],                                additions: 275  },
  shantoshdurai:        { name: 'Santosh Durai',       highlight: 'Added --version/-v flag to the EGC CLI',                                    since: 'Jun 10, 2026', prs: 1, badges: ['pioneer', 'cli'],                           additions: 23   },
  koteshyelamati:       { name: 'Kotesh Yelamati',     highlight: 'Windows HOME/USERPROFILE environment variable fix',                         since: 'Jun 17, 2026', prs: 1, badges: ['crossPlatform'],                            additions: 16   },
  lesbass:              { name: 'Stefano Maffeis',     highlight: 'JSONDecodeError fix in OpenAI and OpenRouter providers',                    since: 'Jun 22, 2026', prs: 1, badges: ['bugHunter'],                               additions: 12   },
  'srivastava-prakhar': { name: 'Prakhar Srivastava',  highlight: 'Narrowed overly broad exception handling in model selector',               since: 'Jun 23, 2026', prs: 1, badges: ['codeQuality'],                             additions: 1    },
  ayushikaul02:         { name: 'Ayushi Kaul',         highlight: 'Co-authored fix for bare except in Gemini provider',                       since: 'Jun 22, 2026', prs: 1, badges: ['coAuthor'],                               additions: 12   },
  krishna3554:          { name: 'Krishna Lokhande',    highlight: 'Co-authored fix for AttributeError in Claude provider',                    since: 'Jun 22, 2026', prs: 1, badges: ['coAuthor'],                               additions: 100  },
  vaishnavidesai09:     { name: 'Vaishnavi Desai',     highlight: 'Co-authored Ollama usage token fix in the provider layer',                 since: 'Jun 22, 2026', prs: 1, badges: ['coAuthor'],                               additions: 8    },
};

export const MONTHLY_CHAMPION = {
  login: 'gaoflow',
  month: 'June 2026',
  reason: 'Fixed critical bugs across all AI providers in a single day -- OpenAI, Anthropic, Gemini, and OpenRouter simultaneously.',
};

export async function fetchContributors(githubToken?: string): Promise<Contributor[]> {
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

  const statsData = await statsRes.json() as {
    author: { login: string };
    total: number;
    weeks: { a: number; d: number; c: number }[];
  }[];

  const result = statsData
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

  if (result.length === 0) throw new Error('Empty contributor list');
  return result;
}

export function buildFallback(): Contributor[] {
  return Object.entries(highlights)
    .sort((a, b) => b[1].prs - a[1].prs)
    .map(([login, info]) => ({
      login,
      name: info.name,
      avatar: `https://github.com/${login}.png`,
      commits: info.prs,
      additions: info.additions ?? 0,
      highlight: info.highlight,
      since: info.since,
      prs: info.prs,
      badges: info.badges,
      tier: getTier(info.prs),
    }));
}
