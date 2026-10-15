import championHistory from '../../data/champion-history.json';
import { expect, test } from './fixtures';

// Section 11.4 of the brief: tiers, monthly champion, one hype a day, Abacus failure.

// The empty hype counter shows an em dash; built from its code point so no tool rewrites it.
const EM_DASH = String.fromCharCode(0x2014);

const tierFor = (commits: number) => (commits >= 10 ? 'core' : commits >= 4 ? 'gold' : commits >= 2 ? 'silver' : 'community');

test('every contributor sits in the tier its commit count gives', async ({ page }) => {
  await page.goto('contributors/');
  const rows = await page.$$eval('#contributor-rows tr[data-index]', (trs) =>
    trs.map((tr) => ({ tier: (tr as HTMLElement).dataset.tier, commits: Number((tr as HTMLElement).dataset.commits) })),
  );
  expect(rows.length).toBeGreaterThan(0);
  for (const row of rows) expect(row.tier).toBe(tierFor(row.commits));
  await expect(page.locator('.legend .tier')).toHaveText(['Core Maintainer', 'Gold Contributor', 'Silver Contributor', 'Community Member']);
});

test('the tier filter shows only that tier', async ({ page }) => {
  await page.goto('contributors/');
  await page.locator('#tier-filter button[data-tier="silver"]').click();
  await expect(page.locator('#tier-filter button[data-tier="silver"]')).toHaveAttribute('aria-pressed', 'true');
  const tiers = await page.$$eval('#contributor-rows tr[data-index]:not([hidden])', (trs) => trs.map((tr) => (tr as HTMLElement).dataset.tier));
  expect(new Set(tiers)).toEqual(new Set(['silver']));
});

test('past champions list every archived month, newest first', async ({ page }) => {
  await page.goto('contributors/');
  const months = await page.locator('.champs .champ .m').allInnerTexts();
  expect(months).toEqual([...championHistory].reverse().map((entry) => entry.month));
});

test('a visitor gets one hype a day', async ({ page, abacus }) => {
  await page.goto('contributors/');
  const first = page.locator('.hype-btn:visible').first();
  const login = (await first.getAttribute('data-hype'))!;
  await first.click();
  await expect(first).toHaveAttribute('aria-pressed', 'true');
  await expect(first.locator('.hype-count')).toHaveText('1');
  expect(abacus.hits).toEqual([login]);
  const others = page.locator(`.hype-btn:not([data-hype="${login}"])`);
  await expect(others.first()).toBeDisabled();

  // Same day: the vote stays spent after a reload, and nothing more is sent.
  await page.reload();
  await expect(page.locator(`.hype-btn[data-hype="${login}"]`).first()).toHaveAttribute('aria-pressed', 'true');
  await expect(others.first()).toBeDisabled();
  expect(abacus.hits).toEqual([login]);

  // Next day: a stale vote no longer counts.
  await page.evaluate(() => localStorage.setItem('hype-daily', JSON.stringify({ date: '2000-01-01', vote: 'someone' })));
  await page.reload();
  await expect(others.first()).toBeEnabled();
});

test('the page keeps working when Abacus is unreachable', async ({ page, abacus }) => {
  abacus.fail = true;
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  await page.goto('contributors/');
  await expect(page.locator('#contributor-rows .hype-count').first()).toHaveText(EM_DASH);
  await page.locator('#contributor-search').fill('zzzz-no-match');
  await expect(page.locator('#empty-row')).toBeVisible();
  await page.locator('#contributor-search').fill('');
  const first = page.locator('.hype-btn:visible').first();
  await first.click();
  await expect(first).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#hype-status')).toHaveText(/could not confirm/);
  expect(errors).toEqual([]);
});

test('profiles link back to the Hall of Fame', async ({ page }) => {
  await page.goto('contributors/');
  const profile = page.locator('.podium-link').first();
  await profile.click();
  await expect(page).toHaveURL(/\/contributors\/[^/]+\/$/);
  await expect(page.locator('h1')).toBeVisible();
  await page.getByRole('link', { name: 'Back to Hall of Fame' }).click();
  await expect(page).toHaveURL(/\/contributors\/$/);
});
