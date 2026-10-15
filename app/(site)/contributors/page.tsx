import type { Metadata } from 'next';
import '@/styles/contributors.css';
import HallBehavior from '@/components/contributors/HallBehavior';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import {
  fetchContributors,
  buildFallback,
  getChampionHistory,
  BADGE_DEFS,
  TIER_CONFIG,
  highlights,
  type Contributor,
} from '@/data/contributors';
import { withBase } from '@/lib/base';
import { pageMetadata } from '@/lib/seo';

// Ported from src/pages/contributors.astro. Every element carries data-hof, the stand-in for
// Astro's data-astro-cid, so styles/contributors.css stays scoped to this page as it was.

export const metadata: Metadata = pageMetadata({
  title: 'Hall of Fame · EGC',
  description:
    'The developers who shaped EGC. Every commit, every bug fix, every translation, permanently recognized.',
  route: 'contributors/',
});

const profileHref = (login: string) =>
  Object.hasOwn(highlights, login)
    ? withBase(`contributors/${encodeURIComponent(login)}/`)
    : `https://github.com/${encodeURIComponent(login)}`;
const external = (login: string) => !Object.hasOwn(highlights, login);
const target = (login: string) => (external(login) ? '_blank' : undefined);
const rel = (login: string) => (external(login) ? 'noopener noreferrer' : undefined);
const areas = (c: Contributor) =>
  c.badges
    .map((key) => BADGE_DEFS[key]?.label)
    .filter(Boolean)
    .join(', ');
const initials = (name: string) => {
  const words = name.match(/[\p{L}\p{N}]+/gu) ?? [];
  return ((words[0]?.[0] ?? '?') + (words[1]?.[0] ?? words[0]?.[1] ?? '')).toUpperCase();
};
const tiers = Object.entries(TIER_CONFIG) as [
  keyof typeof TIER_CONFIG,
  (typeof TIER_CONFIG)[keyof typeof TIER_CONFIG],
][];
const PAGE_SIZE = 10;

export default async function ContributorsPage() {
  let contributors: Contributor[];
  try {
    const result = await fetchContributors(process.env.GITHUB_TOKEN);
    contributors = result.contributors;
  } catch {
    contributors = buildFallback();
  }
  const pastChampions = getChampionHistory();
  const rankedContributors = [...contributors].sort(
    (a, b) => b.commits - a.commits || b.additions - a.additions,
  );
  const podium = rankedContributors.slice(0, 3);
  const podiumRank = (login: string) => rankedContributors.findIndex((c) => c.login === login) + 1;
  const medal = (rank: number) => (rank === 1 ? 'Gold' : rank === 2 ? 'Silver' : 'Bronze');
  const position = (rank: number) => `${rank}${rank === 1 ? 'st' : rank === 2 ? 'nd' : 'rd'} place`;
  const totalCommits = contributors.reduce((sum, c) => sum + c.commits, 0);
  const totalAdditions = contributors.reduce((sum, c) => sum + c.additions, 0);
  const totalPrs = contributors.reduce((sum, c) => sum + c.prs, 0);
  const allPrsKnown = contributors.every((c) => Object.hasOwn(highlights, c.login));
  return (
    <>
      <Navbar current="/contributors/" />
      <main id="main-content" className="hall" data-hof="">
        <p id="hype-status" className="sr-only" role="status" aria-live="polite" data-hof="" />
        <div className="wrap intro hall-hero" data-hof="">
          <div className="hall-star" aria-hidden="true" data-hof="">
            ★
          </div>
          <div className="kicker" data-hof="">
            The people behind the project
          </div>
          <h1 data-hof="">
            Built by people.
            <br data-hof="" />
            <span data-hof="">Remembered by EGC.</span>
          </h1>
          <p className="lead" data-hof="">
            A permanent place for the contributors who turn ideas into working software — one issue,
            review, and pull request at a time.
          </p>
          <div className="stats" role="list" data-hof="">
            <div className="stat" role="listitem" data-hof="">
              <b data-hof="">{contributors.length}</b>
              <span data-hof="">Contributors</span>
            </div>
            <div className="stat" role="listitem" data-hof="">
              <b data-hof="">{totalCommits || '—'}</b>
              <span data-hof="">Commits</span>
            </div>
            <div className="stat" role="listitem" data-hof="">
              <b data-hof="">
                {totalAdditions > 0 ? `+${totalAdditions.toLocaleString('en-US')}` : '—'}
              </b>
              <span data-hof="">Lines added</span>
            </div>
            <div className="stat" role="listitem" data-hof="">
              <b data-hof="">{allPrsKnown ? totalPrs : '—'}</b>
              <span data-hof="">Pull requests merged</span>
            </div>
          </div>
        </div>
        {podium.length > 0 && (
          <section className="wrap podium-section" aria-labelledby="podium-title" data-hof="">
            <div className="sec-head" data-hof="">
              <div data-hof="">
                <div className="kicker" data-hof="">
                  Recognition
                </div>
                <h2 id="podium-title" data-hof="">
                  Top contributors
                </h2>
              </div>
              <p data-hof="">Ranked by merged commits, then lines added.</p>
            </div>
            <div className="podium" data-hof="">
              {podium.map((c) => {
                const rank = podiumRank(c.login);
                return (
                  <div
                    key={c.login}
                    className={`podium-entry podium-${medal(rank).toLowerCase()}`}
                    data-rank={rank}
                    data-hof=""
                  >
                    <article
                      className="podium-person"
                      aria-label={`${position(rank)}: ${c.name}, ${medal(rank)} medal`}
                      data-hof=""
                    >
                      <div className="podium-medal" aria-hidden="true" data-hof="">
                        {rank}
                      </div>
                      <p className="podium-rank" data-hof="">
                        {position(rank)}{' '}
                        <span aria-hidden="true" data-hof="">
                          ·
                        </span>{' '}
                        {medal(rank)}
                      </p>
                      <span className="av podium-avatar" data-i={initials(c.name)} data-hof="">
                        <img
                          src={c.avatar}
                          alt=""
                          width="80"
                          height="80"
                          loading="lazy"
                          data-hof=""
                        />
                      </span>
                      <h3 className="podium-name" data-hof="">
                        <a
                          className="podium-link"
                          href={profileHref(c.login)}
                          target={target(c.login)}
                          rel={rel(c.login)}
                          data-hof=""
                        >
                          <span className="sr-only" data-hof="">
                            {position(rank)}, {medal(rank)} medal:
                          </span>
                          {c.name}
                          <span className="sr-only" data-hof="">
                            , view contributor profile
                            {external(c.login) ? ' on GitHub (opens in new tab)' : ''}
                          </span>
                        </a>
                      </h3>
                      <span className="podium-handle" data-hof="">
                        @{c.login}
                      </span>{' '}
                      <span className={`podium-tier t-${c.tier}`} data-hof="">
                        {TIER_CONFIG[c.tier].label}
                      </span>{' '}
                      {c.badges.length > 0 && (
                        <div className="podium-badges" aria-label="Specialty badges" data-hof="">
                          {c.badges.map(
                            (key) =>
                              BADGE_DEFS[key] && (
                                <span key={key} className="podium-badge" data-hof="">
                                  {BADGE_DEFS[key].icon} {BADGE_DEFS[key].label}
                                </span>
                              ),
                          )}
                        </div>
                      )}{' '}
                      <span className="podium-profile-cue" aria-hidden="true" data-hof="">
                        View contributor profile ↗
                      </span>
                      <div className="podium-bottom" data-hof="">
                        <span className="podium-commits" data-hof="">
                          <strong data-hof="">{c.commits}</strong> commits
                        </span>
                        <button
                          type="button"
                          className="hype-btn"
                          data-hype={c.login}
                          data-name={c.name}
                          aria-label={`Hype ${c.name}`}
                          title="Hype this contributor (1 hype a day)"
                          data-hof=""
                        >
                          Hype{' '}
                          <span className="hype-count" aria-hidden="true" data-hof="">
                            —
                          </span>
                        </button>
                      </div>
                    </article>
                    <div className="podium-step" aria-hidden="true" data-hof="">
                      {rank}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
        <section className="wrap" aria-labelledby="all-title" data-hof="">
          <div className="sec-head" data-hof="">
            <div data-hof="">
              <div className="kicker" data-hof="">
                All contributors
              </div>
              <h2 id="all-title" data-hof="">
                Everyone who shipped
              </h2>
            </div>
            <p id="count" role="status" aria-live="polite" data-hof="">
              {contributors.length} of {contributors.length} contributors
            </p>
          </div>
          <div className="tools" data-hof="">
            <label className="sr-only" htmlFor="contributor-search" data-hof="">
              Search contributors by name, login or area
            </label>
            <input
              className="search"
              id="contributor-search"
              type="search"
              placeholder="Search by name, handle or area"
              aria-controls="contributor-rows"
              data-hof=""
            />
            <div
              className="seg"
              role="group"
              aria-label="Filter by tier"
              id="tier-filter"
              data-hof=""
            >
              <button type="button" data-tier="all" aria-pressed="true" data-hof="">
                All
              </button>{' '}
              {tiers.map(([key]) => (
                <button key={key} type="button" data-tier={key} aria-pressed="false" data-hof="">
                  {key === 'core' ? 'Core' : key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>
            <div className="mobile-sort" data-hof="">
              <label htmlFor="mobile-sort-key" data-hof="">
                Sort by
              </label>
              <select id="mobile-sort-key" aria-controls="contributor-rows" data-hof="">
                <option value="commits" data-hof="">
                  Commits
                </option>
                <option value="prs" data-hof="">
                  PRs
                </option>
                <option value="additions" data-hof="">
                  Lines
                </option>
              </select>
              <button
                type="button"
                id="mobile-sort-direction"
                aria-controls="contributor-rows"
                aria-label="Currently descending; switch to ascending"
                data-hof=""
              >
                Descending ↓
              </button>{' '}
              <span id="mobile-sort-status" className="sr-only" role="status" data-hof="" />
            </div>
          </div>
          <table data-hof="">
            <thead data-hof="">
              <tr data-hof="">
                <th scope="col" data-hof="">
                  #
                </th>
                <th scope="col" data-hof="">
                  Contributor
                </th>
                <th scope="col" data-hof="">
                  Tier
                </th>
                <th scope="col" data-hof="">
                  Areas
                </th>
                <th
                  scope="col"
                  className="num"
                  data-key="commits"
                  aria-sort="descending"
                  data-hof=""
                >
                  <button type="button" data-hof="">
                    Commits
                  </button>
                </th>
                <th scope="col" className="num" data-key="prs" data-hof="">
                  <button type="button" data-hof="">
                    PRs
                  </button>
                </th>
                <th scope="col" className="num" data-key="additions" data-hof="">
                  <button type="button" data-hof="">
                    Lines
                  </button>
                </th>
              </tr>
            </thead>
            <tbody id="contributor-rows" data-hof="">
              {rankedContributors.map((c, index) => (
                <tr
                  key={c.login}
                  data-index={index}
                  data-tier={c.tier}
                  data-name={c.name.toLocaleLowerCase()}
                  data-login={c.login.toLocaleLowerCase()}
                  data-areas={areas(c).toLocaleLowerCase()}
                  data-commits={c.commits}
                  data-prs={Object.hasOwn(highlights, c.login) ? c.prs : ''}
                  data-additions={c.additions}
                  data-hof=""
                >
                  <td className="rk" data-hof="">
                    {String(index + 1).padStart(2, '0')}
                  </td>
                  <td data-hof="">
                    <div className="who" data-hof="">
                      <a
                        className="who-link"
                        href={profileHref(c.login)}
                        target={target(c.login)}
                        rel={rel(c.login)}
                        data-hof=""
                      >
                        <span className="av row-avatar" data-i={initials(c.name)} data-hof="">
                          <img
                            src={c.avatar}
                            alt=""
                            width="36"
                            height="36"
                            loading="lazy"
                            data-hof=""
                          />
                        </span>{' '}
                        <span className="who-text" data-hof="">
                          <b data-hof="">{c.name}</b>
                          <span className="handle" data-hof="">
                            @{c.login}
                          </span>
                          {external(c.login) && (
                            <span className="sr-only" data-hof="">
                              Opens GitHub in a new tab.
                            </span>
                          )}
                        </span>
                      </a>{' '}
                      <button
                        type="button"
                        className="hype-btn"
                        data-hype={c.login}
                        data-name={c.name}
                        aria-label={`Hype ${c.name}`}
                        title="Hype this contributor (1 hype a day)"
                        data-hof=""
                      >
                        Hype{' '}
                        <span className="hype-count" aria-hidden="true" data-hof="">
                          —
                        </span>
                      </button>
                    </div>
                  </td>
                  <td data-hof="">
                    <span className={`tier t-${c.tier}`} data-hof="">
                      {TIER_CONFIG[c.tier].label}
                    </span>
                  </td>
                  <td className="areas" data-hof="">
                    {areas(c) || '—'}
                  </td>
                  <td className="num" data-label="Commits" data-hof="">
                    {c.commits}
                  </td>
                  <td className="num" data-label="PRs" data-hof="">
                    {Object.hasOwn(highlights, c.login) ? c.prs : '—'}
                  </td>
                  <td className="num" data-label="Lines" data-hof="">
                    +{c.additions.toLocaleString('en-US')}
                  </td>
                </tr>
              ))}
              <tr id="empty-row" hidden data-hof="">
                <td colSpan={7} className="empty" data-hof="">
                  No contributor matches this search.
                </td>
              </tr>
            </tbody>
          </table>
          <nav
            className="contributor-pagination"
            id="contributor-pagination"
            data-page-size={PAGE_SIZE}
            aria-label="Contributor pagination"
            hidden
            data-hof=""
          >
            <button
              type="button"
              id="page-previous"
              aria-controls="contributor-rows"
              disabled
              data-hof=""
            >
              Previous
            </button>
            <div className="pagination-pages" data-hof="">
              {Array.from({ length: Math.ceil(contributors.length / PAGE_SIZE) }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  data-page={index + 1}
                  aria-label={`Page ${index + 1}`}
                  aria-controls="contributor-rows"
                  data-hof=""
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button type="button" id="page-next" aria-controls="contributor-rows" data-hof="">
              Next
            </button>
          </nav>
          <div className="legend" data-hof="">
            {tiers.map(([key, config]) => (
              <div key={key} data-hof="">
                <b className={`tier t-${key}`} data-hof="">
                  {config.label}
                </b>
                <p data-hof="">
                  {key === 'community'
                    ? 'Fewer than two commits.'
                    : `${config.minCommits} or more commits.`}
                </p>
              </div>
            ))}
          </div>
        </section>
        {pastChampions.length > 0 && (
          <section className="wrap past" aria-labelledby="past-title" data-hof="">
            <div className="sec-head" data-hof="">
              <div data-hof="">
                <div className="kicker" data-hof="">
                  A living archive
                </div>
                <h2 id="past-title" data-hof="">
                  Past champions
                </h2>
              </div>
              <p data-hof="">Recognition remains discoverable beyond the current month.</p>
            </div>
            <div className="champs" data-hof="">
              {pastChampions.map((h) => (
                <a
                  key={`${h.login}-${h.month}`}
                  className="champ"
                  href={profileHref(h.login)}
                  target={target(h.login)}
                  rel={rel(h.login)}
                  aria-label={`View ${h.name}, ${h.month}${external(h.login) ? ' on GitHub (opens in new tab)' : ''}`}
                  aria-describedby={`recognition-${h.login}-${h.month.replace(/\W/g, '-')}`}
                  data-hof=""
                >
                  <span className="av champ-avatar" data-i={initials(h.name)} data-hof="">
                    <img
                      src={`https://github.com/${encodeURIComponent(h.login)}.png?size=160`}
                      alt=""
                      width="56"
                      height="56"
                      loading="lazy"
                      data-hof=""
                    />
                  </span>{' '}
                  <span data-hof="">
                    <span className="m" data-hof="">
                      {h.month}
                    </span>
                    <b data-hof="">{h.name}</b>
                    <span
                      className="champ-reason"
                      id={`recognition-${h.login}-${h.month.replace(/\W/g, '-')}`}
                      data-hof=""
                    >
                      {h.reason}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}
        <section className="wrap" data-hof="">
          <div className="cta" data-hof="">
            <h2 data-hof="">Your name belongs on this page.</h2>
            <div data-hof="">
              <p data-hof="">
                Pick an open issue, ship the fix, and you are in the Hall of Fame for good.
              </p>
              <div className="cta-actions" data-hof="">
                <a
                  className="btn btn-light"
                  href="https://github.com/Fmarzochi/EGC/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-hof=""
                >
                  Browse open issues{' '}
                  <span className="sr-only" data-hof="">
                    (opens in new tab)
                  </span>
                </a>
                <a
                  className="btn btn-line"
                  href="https://github.com/Fmarzochi/EGC/blob/main/.github/CONTRIBUTING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-hof=""
                >
                  Contributing guide{' '}
                  <span className="sr-only" data-hof="">
                    (opens in new tab)
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>
        <section className="wrap sponsor-section" aria-labelledby="sponsor-title" data-hof="">
          <div className="sec-head" data-hof="">
            <div data-hof="">
              <div className="kicker" data-hof="">
                Sponsors
              </div>
              <h2 id="sponsor-title" data-hof="">
                Keeping EGC moving
              </h2>
            </div>
            <div className="sponsor-actions" data-hof="">
              <a
                className="btn btn-primary"
                href="https://github.com/sponsors/Fmarzochi"
                target="_blank"
                rel="noopener noreferrer"
                data-hof=""
              >
                GitHub Sponsors{' '}
                <span className="sr-only" data-hof="">
                  (opens in new tab)
                </span>
              </a>
              <a
                className="btn btn-ghost"
                href="https://www.paypal.com/donate/?business=fmarzochi%40gmail.com&currency_code=USD"
                target="_blank"
                rel="noopener noreferrer"
                data-hof=""
              >
                PayPal{' '}
                <span className="sr-only" data-hof="">
                  (opens in new tab)
                </span>
              </a>
            </div>
          </div>
          <div className="sponsors" data-hof="">
            <div data-hof="">
              <h3 data-hof="">Tool partners</h3>
              <a
                href="https://www.pincushion.io/"
                target="_blank"
                rel="noopener noreferrer"
                data-hof=""
              >
                Pincushion{' '}
                <span className="sr-only" data-hof="">
                  (opens in new tab)
                </span>
              </a>
            </div>
            <div data-hof="">
              <h3 data-hof="">Backers</h3>
              <a
                href="https://github.com/chizormaangel-commits"
                target="_blank"
                rel="noopener noreferrer"
                data-hof=""
              >
                @chizormaangel-commits{' '}
                <span className="sr-only" data-hof="">
                  (opens in new tab)
                </span>
              </a>
            </div>
            <div data-hof="">
              <h3 data-hof="">Monthly sponsors</h3>
              <p data-hof="">
                Open.{' '}
                <a
                  href="https://github.com/sponsors/Fmarzochi"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-hof=""
                >
                  Become the first.{' '}
                  <span className="sr-only" data-hof="">
                    (opens in new tab)
                  </span>
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
      <HallBehavior />
      <Footer />
    </>
  );
}
