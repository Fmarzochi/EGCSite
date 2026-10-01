#!/usr/bin/env node
// Appends last month's Hall of Fame champion to src/data/champion-history.json once that
// month has fully rolled past (i.e. once computeMonthlyChampion in contributors.ts has moved
// on to a newer month). Safe to run on every build: it no-ops once the current month is
// already recorded. Existing entries are never modified or removed.
//
// Mirrors the tie-break rule (commits, then lines added) used by computeMonthlyChampion in
// src/data/contributors.ts. Kept as a standalone script (not a TS import) so it can run under
// plain Node in CI without a TypeScript loader.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HISTORY_PATH = path.join(__dirname, '..', 'src', 'data', 'champion-history.json');

const OWNER = 'Fmarzochi';
const REPO = 'EGC';
const EXCLUDED = new Set([OWNER, 'dependabot[bot]', 'github-actions[bot]']);

// GitHub answers 202 while it computes the stats, and the first request of a
// month on a repository this size can take minutes. Waits grow from 3 s to
// 15 s, about two minutes in all; null means the stats are still not ready.
const STATS_ATTEMPTS = 10;
const STATS_MAX_WAIT_MS = 15000;

async function fetchStats() {
  const headers = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  for (let attempt = 1; attempt <= STATS_ATTEMPTS; attempt++) {
    const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/stats/contributors`, { headers });
    if (res.status === 202) {
      await new Promise(r => setTimeout(r, Math.min(3000 * attempt, STATS_MAX_WAIT_MS)));
      continue;
    }
    if (!res.ok) throw new Error(`GitHub API error ${res.status}`);
    return res.json();
  }
  return null;
}

function prevMonthWindow(now) {
  const prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevEnd = new Date(now.getFullYear(), now.getMonth(), 1);
  const label = prevStart.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  return { prevStart, prevEnd, label };
}

function computeChampion(rawStats, prevStart, prevEnd) {
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
  return { login: topLogin, commits: topCommits, additions: topAdditions };
}

async function main() {
  const history = JSON.parse(readFileSync(HISTORY_PATH, 'utf8'));
  const { prevStart, prevEnd, label } = prevMonthWindow(new Date());

  if (history.some(entry => entry.month === label)) {
    console.log(`champion-history.json already has an entry for ${label}. Nothing to do.`);
    return;
  }

  const rawStats = await fetchStats();
  if (!rawStats) {
    // The archive is not part of the build: skip it rather than block the
    // deploy, and the next deploy records the month.
    console.log(`::warning::GitHub is still computing contributor stats; the ${label} champion will be archived on the next deploy.`);
    return;
  }
  const champion = computeChampion(rawStats, prevStart, prevEnd);
  if (!champion) {
    console.log(`No qualifying champion found for ${label}. Nothing to do.`);
    return;
  }

  history.push({ login: champion.login, month: label, commits: champion.commits, additions: champion.additions });
  writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2) + '\n');
  console.log(`Recorded ${champion.login} as champion of ${label} (${champion.commits} commits, +${champion.additions} lines).`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
