import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { fetchContributors, getChampionHistory, highlights, BADGE_DEFS } from '@/data/contributors';
import { formatContribution } from '@/lib/format-contributor';
import { pageMetadata } from '@/lib/seo';

// Ported from src/pages/contributors/[login].astro: one profile page per contributor listed in
// highlights, with the public GitHub profile fetched at build time.

type Params = Promise<{ login: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(highlights).map((login) => ({ login }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { login } = await params;
  const info = highlights[login];
  if (!info) return {};
  return pageMetadata({
    title: `${info.name}, EGC Hall of Fame`,
    description: `${info.name} (@${login}): ${info.highlight}`,
    route: `contributors/${login}/`,
  });
}

// Champion of the month, as getStaticPaths handed it to every profile in the Astro version.
async function currentChampion() {
  let champion = getChampionHistory()[0] ?? null;
  try {
    const token = process.env.GITHUB_TOKEN;
    const result = await fetchContributors(token);
    champion = result.champion ?? champion;
  } catch {
    // static data only
  }
  return { championLogin: champion?.login ?? '', championMonth: champion?.month ?? '' };
}

export default async function ContributorPage({ params }: { params: Params }) {
  const { login } = await params;
  const { championLogin, championMonth } = await currentChampion();
  const info = highlights[login];
  if (!info) notFound();

  const formattedHighlight = formatContribution(info.highlight);

  const avatar = `https://github.com/${login}.png?size=160`;

  let githubBio = '';
  let githubLocation = '';
  let githubFollowers = 0;
  let githubRepos = 0;

  const userCache = new Map<
    string,
    { bio: string; location: string; followers: number; public_repos: number }
  >();

  const cachedUser = userCache.get(login as string);
  if (cachedUser) {
    githubBio = cachedUser.bio;
    githubLocation = cachedUser.location;
    githubFollowers = cachedUser.followers;
    githubRepos = cachedUser.public_repos;
  } else {
    try {
      const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
      const token = process.env.GITHUB_TOKEN;
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`https://api.github.com/users/${login}`, {
        headers,
        signal: AbortSignal.timeout(1500),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          bio?: string;
          location?: string;
          followers?: number;
          public_repos?: number;
        };
        githubBio = data.bio ?? '';
        githubLocation = data.location ?? '';
        githubFollowers = data.followers ?? 0;
        githubRepos = data.public_repos ?? 0;
        userCache.set(login as string, {
          bio: githubBio,
          location: githubLocation,
          followers: githubFollowers,
          public_repos: githubRepos,
        });
      }
    } catch {
      // static data only
    }
  }

  const isChampion = championLogin === login;

  return (
    <>
      <Navbar current="/contributors/" />

      <main id="main-content">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          {/* Back link */}
          <Link
            href="/contributors/"
            className="inline-flex items-center gap-1.5 py-1 -my-1 text-sm text-[#8E9E96] hover:text-[#3DF69B] transition-colors duration-200 mb-8 font-medium"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>{' '}
            Hall of Fame
          </Link>

          {/* Champion banner */}
          {isChampion && (
            <div className="flex items-center gap-3 rounded-xl px-4 py-3 mb-6 bg-yellow-400/10 border border-yellow-400/30">
              <span className="text-xl">🏅</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-yellow-400">
                  Contributor of the Month
                </p>
                <p className="text-xs text-gray-400">{championMonth}</p>
              </div>
            </div>
          )}

          {/* Profile card */}
          <div className="rounded-2xl bg-[#0D100F] border border-[rgba(226,240,233,0.09)] overflow-hidden mb-6 shadow-xl shadow-black/40">
            <div className="relative">
              <div className="h-24 bg-gradient-to-r from-[#06221A] via-[#0D100F] to-[#0A3D27]" />
              <div className="absolute left-6 -bottom-10">
                <img
                  src={avatar}
                  alt={info.name}
                  width="80"
                  height="80"
                  className={`rounded-full ring-4 ring-[#0D100F] ${isChampion ? 'ring-yellow-400/60' : ''}`}
                />
              </div>
            </div>

            <div className="pt-14 px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-[#F4F6F5] font-sans">
                    {info.name}
                  </h1>
                  <p className="text-sm text-[#8E9E96] mb-3">@{login}</p>
                  {githubBio && (
                    <p className="text-sm text-[#E2E8E4] mb-2 leading-relaxed">{githubBio}</p>
                  )}{' '}
                  {githubLocation && (
                    <p className="flex items-center gap-1 text-xs text-[#8E9E96]">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>{' '}
                      {githubLocation}
                    </p>
                  )}
                </div>
                <a
                  href={`https://github.com/${login}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[rgba(226,240,233,0.12)] bg-[#111614] text-[#F4F6F5] text-sm font-semibold hover:border-[#3DF69B]/40 hover:text-[#3DF69B] active:scale-95 transition-all duration-200"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
                  </svg>{' '}
                  GitHub
                </a>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'PRs merged', value: info.prs },
              { label: 'Badges', value: info.badges.length },
              { label: 'GitHub repos', value: githubRepos || '--' },
              { label: 'Followers', value: githubFollowers || '--' },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl p-4 bg-[#0D100F] border border-[rgba(226,240,233,0.09)] text-center"
              >
                <div className="text-xl sm:text-2xl font-extrabold text-[#3DF69B]">{s.value}</div>
                <div className="font-mono text-[11px] text-[#8E9E96] uppercase tracking-[0.12em] mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Contribution */}
          <div className="rounded-2xl bg-[#0D100F] border border-[rgba(226,240,233,0.09)] p-6 mb-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#8E9E96] mb-3">
              What they built
            </p>
            {formattedHighlight.isStructured ? (
              <ul className="space-y-2.5 text-sm text-[#E2E8E4] leading-relaxed mb-4">
                {formattedHighlight.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="text-[#3DF69B] mt-1 select-none shrink-0 text-xs">✦</span>{' '}
                    <span className="whitespace-pre-line">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[#E2E8E4] leading-relaxed mb-4 whitespace-pre-line">
                {formattedHighlight.cleanText}
              </p>
            )}{' '}
            {formattedHighlight.stats && (
              <p className="text-xs text-[#8E9E96]">
                {formattedHighlight.stats.commits} commit
                {formattedHighlight.stats.commits === 1 ? '' : 's'}{' '}
                {formattedHighlight.stats.additions !== undefined &&
                  ` · +${formattedHighlight.stats.additions.toLocaleString('en')} lines`}{' '}
                {formattedHighlight.stats.period && ` · ${formattedHighlight.stats.period}`}
              </p>
            )}
            <p className="text-xs text-[#8E9E96] mt-4 pt-3 border-t border-[rgba(226,240,233,0.06)]">
              Joined {info.since}
            </p>
          </div>

          {/* Badges */}
          {info.badges.length > 0 && (
            <div className="rounded-2xl bg-[#0D100F] border border-[rgba(226,240,233,0.09)] p-6 mb-6">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#8E9E96] mb-4">
                Badges
              </p>
              <div className="flex flex-wrap gap-2">
                {info.badges.map((key) => {
                  const b = BADGE_DEFS[key];
                  return b ? (
                    <span
                      key={key}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${b.color}`}
                    >
                      {b.icon} {b.label}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`https://github.com/${login}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold transition-colors duration-200 active:scale-95"
            >
              <svg
                className="w-4 h-4 shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
              </svg>{' '}
              View GitHub profile
            </a>{' '}
            <a
              href={`https://github.com/Fmarzochi/EGC/commits?author=${login}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-egc-900/60 hover:bg-egc-800/60 text-egc-400 text-sm font-semibold border border-egc-700/40 transition-colors duration-200 active:scale-95"
            >
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>{' '}
              View commits on EGC
            </a>{' '}
            <Link
              href="/contributors/"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-700 text-gray-400 text-sm font-semibold hover:text-white hover:border-gray-500 transition-colors duration-200 active:scale-95"
            >
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 17l-5-5m0 0l5-5m-5 5h12"
                />
              </svg>{' '}
              Back to Hall of Fame
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
