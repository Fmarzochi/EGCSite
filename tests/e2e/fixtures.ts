import { test as base, expect } from '@playwright/test';

// Every test runs with the third parties stubbed: GoatCounter never counts a test visit and
// the Abacus hype counter is an in-memory fake, so no test ever casts a real vote.

export interface AbacusFake {
  /** Counter value per login, as /get returns it. */
  counts: Record<string, number>;
  /** Logins sent to /hit, in order. */
  hits: string[];
  /** Makes every Abacus request fail, like an ad blocker or an outage. */
  fail: boolean;
}

export const test = base.extend<{ abacus: AbacusFake }>({
  abacus: [
    async ({ page }, use) => {
      const fake: AbacusFake = { counts: {}, hits: [], fail: false };
      await page.route(/gc\.zgo\.at|goatcounter\.com/, (route) => route.abort());
      await page.route('https://abacus.jasoncameron.dev/**', async (route) => {
        if (fake.fail) return route.abort('failed');
        const [, action, , login = ''] = new URL(route.request().url()).pathname.split('/');
        const key = decodeURIComponent(login);
        if (action === 'hit') {
          fake.hits.push(key);
          fake.counts[key] = (fake.counts[key] ?? 0) + 1;
        }
        return route.fulfill({ json: { value: fake.counts[key] ?? 0 } });
      });
      await use(fake);
    },
    { auto: true },
  ],
});

export { expect };
