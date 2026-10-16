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
  type MonthlyChampion,
} from '@/data/contributors';
import { withBase } from '@/lib/base';
import { HALL_LABELS_PT, hallText, type HallText } from '@/lib/hall-i18n';
import type { Lang } from '@/lib/lang';

// The Hall of Fame in both languages: one markup, texts per language. Ported from
// src/pages/contributors.astro (English); the Portuguese texts are a translation of it, and each
// contributor's own highlight stays as written, in English. Every element carries data-hof, the
// stand-in for Astro's data-astro-cid, so styles/contributors.css stays scoped to this page.

const EM_DASH = String.fromCharCode(0x2014);
const PAGE_SIZE = 10;
const MEDAL_CLASS = (rank: number) => (rank === 1 ? 'gold' : rank === 2 ? 'silver' : 'bronze');

type TierKey = keyof typeof TIER_CONFIG;
type BadgeKey = keyof typeof BADGE_DEFS;

const tiers = Object.entries(TIER_CONFIG) as [TierKey, (typeof TIER_CONFIG)[TierKey]][];

const external = (login: string) => !Object.hasOwn(highlights, login);
const target = (login: string) => (external(login) ? '_blank' : undefined);
const rel = (login: string) => (external(login) ? 'noopener noreferrer' : undefined);
const initials = (name: string) => {
  const words = name.match(/[\p{L}\p{N}]+/gu) ?? [];
  return ((words[0]?.[0] ?? '?') + (words[1]?.[0] ?? words[0]?.[1] ?? '')).toUpperCase();
};

export function contributorsMetadata(lang: Lang) {
  return hallText(lang).meta;
}

/** Labels, links and the champion reason in one language. */
function labels(lang: Lang, t: HallText) {
  const tierLabel = (key: TierKey) =>
    lang === 'pt' ? HALL_LABELS_PT.tiers[key] : TIER_CONFIG[key].label;
  const badgeLabel = (key: BadgeKey) =>
    lang === 'pt' ? HALL_LABELS_PT.badges[key] : BADGE_DEFS[key]?.label;
  const profileHref = (login: string) =>
    Object.hasOwn(highlights, login)
      ? withBase(`${lang === 'pt' ? 'pt/' : ''}contributors/${encodeURIComponent(login)}/`)
      : `https://github.com/${encodeURIComponent(login)}`;
  const areas = (c: Contributor) =>
    c.badges
      .map((key) => (BADGE_DEFS[key] ? badgeLabel(key) : undefined))
      .filter(Boolean)
      .join(', ');
  /** English keeps the reason as data/contributors.ts words it; Portuguese words the numbers itself. */
  const reason = (h: MonthlyChampion) => {
    if (lang === 'en' || h.commits === undefined) return h.reason;
    const highlight = highlights[h.login]?.highlight;
    const stats = t.championStats(h.commits, h.additions ?? 0, h.month);
    return highlight ? (
      <>
        <span lang="en" data-hof="">
          {highlight.replace(/\.$/, '')}.
        </span>{' '}
        {stats}
      </>
    ) : (
      stats
    );
  };
  return { tierLabel, badgeLabel, profileHref, areas, reason };
}

export default async function Contributors({ lang }: { lang: Lang }) {
  const t = hallText(lang);
  const { tierLabel, badgeLabel, profileHref, areas, reason } = labels(lang, t);
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
  const totalCommits = contributors.reduce((sum, c) => sum + c.commits, 0);
  const totalAdditions = contributors.reduce((sum, c) => sum + c.additions, 0);
  const totalPrs = contributors.reduce((sum, c) => sum + c.prs, 0);
  const allPrsKnown = contributors.every((c) => Object.hasOwn(highlights, c.login));
  const highlightLang = lang === 'pt' ? 'en' : undefined;
  // One block wraps the page: with a fragment the first nodes are the fixed and sticky header
  // parts, which the Next.js router skips when it restores the scroll on a client-side
  // navigation, and it scrolled the page down to the footer instead of the top.
  return (
    <div>
      <Navbar current="/contributors/" lang={lang} />
      <main id="main-content" className="hall" data-hof="">
        <p id="hype-status" className="sr-only" role="status" aria-live="polite" data-hof="" />
        <div className="wrap intro hall-hero" data-hof="">
          <div className="hall-star" aria-hidden="true" data-hof="">
            ★
          </div>
          <div className="kicker" data-hof="">
            {t.kicker}
          </div>
          <h1 data-hof="">
            {t.titleTop}
            <br data-hof="" />
            <span data-hof="">{t.titleBottom}</span>
          </h1>
          <p className="lead" data-hof="">
            {t.lead(EM_DASH)}
          </p>
          <div className="stats" role="list" data-hof="">
            <div className="stat" role="listitem" data-hof="">
              <b data-hof="">{contributors.length}</b>
              <span data-hof="">{t.stats.contributors}</span>
            </div>
            <div className="stat" role="listitem" data-hof="">
              <b data-hof="">{totalCommits || EM_DASH}</b>
              <span data-hof="">{t.stats.commits}</span>
            </div>
            <div className="stat" role="listitem" data-hof="">
              <b data-hof="">
                {totalAdditions > 0 ? `+${totalAdditions.toLocaleString(t.locale)}` : EM_DASH}
              </b>
              <span data-hof="">{t.stats.lines}</span>
            </div>
            <div className="stat" role="listitem" data-hof="">
              <b data-hof="">{allPrsKnown ? totalPrs : EM_DASH}</b>
              <span data-hof="">{t.stats.prs}</span>
            </div>
          </div>
        </div>
        {podium.length > 0 && (
          <section className="wrap podium-section" aria-labelledby="podium-title" data-hof="">
            <div className="sec-head" data-hof="">
              <div data-hof="">
                <div className="kicker" data-hof="">
                  {t.recognition}
                </div>
                <h2 id="podium-title" data-hof="">
                  {t.topContributors}
                </h2>
              </div>
              <p data-hof="">{t.rankedBy}</p>
            </div>
            <div className="podium" data-hof="">
              {podium.map((c) => {
                const rank = podiumRank(c.login);
                const medal = t.medal(rank);
                return (
                  <div
                    key={c.login}
                    className={`podium-entry podium-${MEDAL_CLASS(rank)}`}
                    data-rank={rank}
                    data-hof=""
                  >
                    <article
                      className="podium-person"
                      aria-label={`${t.position(rank)}: ${c.name}, ${t.medalWord(medal)}`}
                      data-hof=""
                    >
                      <div className="podium-medal" aria-hidden="true" data-hof="">
                        {rank}
                      </div>
                      <p className="podium-rank" data-hof="">
                        {t.position(rank)}{' '}
                        <span aria-hidden="true" data-hof="">
                          ·
                        </span>{' '}
                        {medal}
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
                            {t.position(rank)}, {t.medalWord(medal)}:
                          </span>
                          {c.name}
                          <span className="sr-only" data-hof="">
                            {t.viewProfile}
                            {external(c.login) ? t.onGithubNewTab : ''}
                          </span>
                        </a>
                      </h3>
                      <span className="podium-handle" data-hof="">
                        @{c.login}
                      </span>{' '}
                      <span className={`podium-tier t-${c.tier}`} data-hof="">
                        {tierLabel(c.tier)}
                      </span>{' '}
                      {c.badges.length > 0 && (
                        <div className="podium-badges" aria-label={t.specialtyBadges} data-hof="">
                          {c.badges.map(
                            (key) =>
                              BADGE_DEFS[key] && (
                                <span key={key} className="podium-badge" data-hof="">
                                  {BADGE_DEFS[key].icon} {badgeLabel(key)}
                                </span>
                              ),
                          )}
                        </div>
                      )}{' '}
                      <span className="podium-profile-cue" aria-hidden="true" data-hof="">
                        {t.viewProfileCue}
                      </span>
                      <div className="podium-bottom" data-hof="">
                        <span className="podium-commits" data-hof="">
                          <strong data-hof="">{c.commits}</strong> {t.commits}
                        </span>
                        <button
                          type="button"
                          className="hype-btn"
                          data-hype={c.login}
                          data-name={c.name}
                          aria-label={t.hypeLabel(c.name)}
                          title={t.hypeTitle}
                          data-hof=""
                        >
                          {t.hype}{' '}
                          <span className="hype-count" aria-hidden="true" data-hof="">
                            {EM_DASH}
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
                {t.allContributors}
              </div>
              <h2 id="all-title" data-hof="">
                {t.everyone}
              </h2>
            </div>
            <p id="count" role="status" aria-live="polite" data-hof="">
              {t.countAll(contributors.length)}
            </p>
          </div>
          <div className="tools" data-hof="">
            <label className="sr-only" htmlFor="contributor-search" data-hof="">
              {t.searchLabel}
            </label>
            <input
              className="search"
              id="contributor-search"
              type="search"
              placeholder={t.searchPlaceholder}
              aria-controls="contributor-rows"
              data-hof=""
            />
            <div
              className="seg"
              role="group"
              aria-label={t.filterByTier}
              id="tier-filter"
              data-hof=""
            >
              <button type="button" data-tier="all" aria-pressed="true" data-hof="">
                {t.all}
              </button>{' '}
              {tiers.map(([key]) => (
                <button key={key} type="button" data-tier={key} aria-pressed="false" data-hof="">
                  {t.tierButton(key)}
                </button>
              ))}
            </div>
            <div className="mobile-sort" data-hof="">
              <label htmlFor="mobile-sort-key" data-hof="">
                {t.sortBy}
              </label>
              <select id="mobile-sort-key" aria-controls="contributor-rows" data-hof="">
                <option value="commits" data-hof="">
                  {t.sortKeys.commits}
                </option>
                <option value="prs" data-hof="">
                  {t.sortKeys.prs}
                </option>
                <option value="additions" data-hof="">
                  {t.sortKeys.additions}
                </option>
              </select>
              <button
                type="button"
                id="mobile-sort-direction"
                aria-controls="contributor-rows"
                aria-label={t.sortSwitch(t.descending, t.ascending)}
                data-hof=""
              >
                {t.descending} ↓
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
                  {t.columns.contributor}
                </th>
                <th scope="col" data-hof="">
                  {t.columns.tier}
                </th>
                <th scope="col" data-hof="">
                  {t.columns.areas}
                </th>
                <th
                  scope="col"
                  className="num"
                  data-key="commits"
                  aria-sort="descending"
                  data-hof=""
                >
                  <button type="button" data-hof="">
                    {t.sortKeys.commits}
                  </button>
                </th>
                <th scope="col" className="num" data-key="prs" data-hof="">
                  <button type="button" data-hof="">
                    {t.sortKeys.prs}
                  </button>
                </th>
                <th scope="col" className="num" data-key="additions" data-hof="">
                  <button type="button" data-hof="">
                    {t.sortKeys.additions}
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
                              {t.opensGithub}
                            </span>
                          )}
                        </span>
                      </a>{' '}
                      <button
                        type="button"
                        className="hype-btn"
                        data-hype={c.login}
                        data-name={c.name}
                        aria-label={t.hypeLabel(c.name)}
                        title={t.hypeTitle}
                        data-hof=""
                      >
                        {t.hype}{' '}
                        <span className="hype-count" aria-hidden="true" data-hof="">
                          {EM_DASH}
                        </span>
                      </button>
                    </div>
                  </td>
                  <td data-hof="">
                    <span className={`tier t-${c.tier}`} data-hof="">
                      {tierLabel(c.tier)}
                    </span>
                  </td>
                  <td className="areas" data-hof="">
                    {areas(c) || EM_DASH}
                  </td>
                  <td className="num" data-label={t.sortKeys.commits} data-hof="">
                    {c.commits}
                  </td>
                  <td className="num" data-label={t.sortKeys.prs} data-hof="">
                    {Object.hasOwn(highlights, c.login) ? c.prs : EM_DASH}
                  </td>
                  <td className="num" data-label={t.sortKeys.additions} data-hof="">
                    +{c.additions.toLocaleString(t.locale)}
                  </td>
                </tr>
              ))}
              <tr id="empty-row" hidden data-hof="">
                <td colSpan={7} className="empty" data-hof="">
                  {t.noMatch}
                </td>
              </tr>
            </tbody>
          </table>
          <nav
            className="contributor-pagination"
            id="contributor-pagination"
            data-page-size={PAGE_SIZE}
            aria-label={t.pagination}
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
              {t.previous}
            </button>
            <div className="pagination-pages" data-hof="">
              {Array.from({ length: Math.ceil(contributors.length / PAGE_SIZE) }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  data-page={index + 1}
                  aria-label={t.page(index + 1)}
                  aria-controls="contributor-rows"
                  data-hof=""
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button type="button" id="page-next" aria-controls="contributor-rows" data-hof="">
              {t.next}
            </button>
          </nav>
          <div className="legend" data-hof="">
            {tiers.map(([key, config]) => (
              <div key={key} data-hof="">
                <b className={`tier t-${key}`} data-hof="">
                  {tierLabel(key)}
                </b>
                <p data-hof="">
                  {key === 'community' ? t.fewerThanTwo : t.orMore(config.minCommits)}
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
                  {t.archive}
                </div>
                <h2 id="past-title" data-hof="">
                  {t.pastChampions}
                </h2>
              </div>
              <p data-hof="">{t.pastLead}</p>
            </div>
            <div className="champs" data-hof="">
              {pastChampions.map((h) => (
                <a
                  key={`${h.login}-${h.month}`}
                  className="champ"
                  href={profileHref(h.login)}
                  target={target(h.login)}
                  rel={rel(h.login)}
                  aria-label={`${t.viewChampion(h.name, t.month(h.month))}${external(h.login) ? t.onGithubNewTab : ''}`}
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
                      {t.month(h.month)}
                    </span>
                    <b data-hof="">{h.name}</b>
                    <span
                      className="champ-reason"
                      id={`recognition-${h.login}-${h.month.replace(/\W/g, '-')}`}
                      lang={highlightLang && h.commits === undefined ? highlightLang : undefined}
                      data-hof=""
                    >
                      {reason(h)}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}
        <section className="wrap" data-hof="">
          <div className="cta" data-hof="">
            <h2 data-hof="">{t.ctaTitle}</h2>
            <div data-hof="">
              <p data-hof="">{t.ctaLead}</p>
              <div className="cta-actions" data-hof="">
                <a
                  className="btn btn-light"
                  href="https://github.com/Fmarzochi/EGC/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-hof=""
                >
                  {t.browseIssues}{' '}
                  <span className="sr-only" data-hof="">
                    {t.newTab}
                  </span>
                </a>
                <a
                  className="btn btn-line"
                  href="https://github.com/Fmarzochi/EGC/blob/main/.github/CONTRIBUTING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-hof=""
                >
                  {t.contributingGuide}{' '}
                  <span className="sr-only" data-hof="">
                    {t.newTab}
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
                {t.sponsors}
              </div>
              <h2 id="sponsor-title" data-hof="">
                {t.keepingMoving}
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
                  {t.newTab}
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
                  {t.newTab}
                </span>
              </a>
            </div>
          </div>
          <div className="sponsors" data-hof="">
            <div data-hof="">
              <h3 data-hof="">{t.toolPartners}</h3>
              <a
                href="https://www.pincushion.io/"
                target="_blank"
                rel="noopener noreferrer"
                data-hof=""
              >
                Pincushion{' '}
                <span className="sr-only" data-hof="">
                  {t.newTab}
                </span>
              </a>
            </div>
            <div data-hof="">
              <h3 data-hof="">{t.backers}</h3>
              <a
                href="https://github.com/chizormaangel-commits"
                target="_blank"
                rel="noopener noreferrer"
                data-hof=""
              >
                @chizormaangel-commits{' '}
                <span className="sr-only" data-hof="">
                  {t.newTab}
                </span>
              </a>
            </div>
            <div data-hof="">
              <h3 data-hof="">{t.monthlySponsors}</h3>
              <p data-hof="">
                {t.open}{' '}
                <a
                  href="https://github.com/sponsors/Fmarzochi"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-hof=""
                >
                  {t.becomeFirst}{' '}
                  <span className="sr-only" data-hof="">
                    {t.newTab}
                  </span>
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
      <HallBehavior />
      <Footer lang={lang} />
    </div>
  );
}
