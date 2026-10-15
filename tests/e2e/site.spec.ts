import type { APIRequestContext } from '@playwright/test';
import { expect, test } from './fixtures';

// Section 11.5 of the brief (no broken internal link under /EGCSite) and the layout and
// accessibility basics of section 10, over every page listed in the sitemap.

const ORIGIN = 'http://127.0.0.1:4173';
const PRODUCTION = 'https://fmarzochi.github.io';

async function sitemapPaths(request: APIRequestContext) {
  const xml = await (await request.get('sitemap-0.xml')).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => loc!.replace(PRODUCTION, ''));
}

test('every internal link, image and stylesheet resolves', async ({ page, request }) => {
  test.setTimeout(300_000);
  const pages = await sitemapPaths(request);
  expect(pages.length).toBeGreaterThan(80);
  const targets = new Map<string, string>();
  for (const path of pages) {
    await page.goto(`${ORIGIN}${path}`, { waitUntil: 'domcontentloaded' });
    const urls = await page.$$eval('a[href], img[src], link[href], script[src]', (els) =>
      els.map((el) => (el as HTMLAnchorElement).href || (el as HTMLImageElement).src).filter(Boolean),
    );
    for (const url of urls) {
      const parsed = new URL(url);
      if (parsed.origin !== ORIGIN) continue;
      parsed.hash = '';
      if (!targets.has(parsed.href)) targets.set(parsed.href, path);
    }
  }
  const broken: string[] = [];
  for (const [url, from] of targets) {
    const response = await request.get(url, { maxRedirects: 0 });
    if (response.status() !== 200) broken.push(`${response.status()} ${url} (from ${from})`);
  }
  expect(broken).toEqual([]);
});

test('every page has one h1, a title, a skip link and lang', async ({ page, request }) => {
  test.setTimeout(300_000);
  for (const path of await sitemapPaths(request)) {
    await page.goto(`${ORIGIN}${path}`, { waitUntil: 'domcontentloaded' });
    const info = await page.evaluate(() => ({
      h1: document.querySelectorAll('h1').length,
      title: document.title,
      skip: Boolean(document.querySelector('a[href="#main-content"], a[href="#conteudo"]')),
      lang: document.documentElement.lang,
    }));
    expect.soft(info.h1, `${path} h1 count`).toBe(1);
    expect.soft(info.title, `${path} title`).not.toBe('');
    expect.soft(info.skip, `${path} skip link`).toBe(true);
    expect.soft(info.lang, `${path} lang`).toMatch(/^(en|pt-BR)$/);
  }
});

const LAYOUT_ROUTES = ['', 'en/', 'get-started/', 'features/', 'docs/memory/', 'docs/cli/', 'integrations/', 'integrations/claude-code/', 'contributors/', 'privacy/'];

for (const width of [320, 390, 768, 1024, 1440, 1920]) {
  test(`no horizontal scroll at ${width}px`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width, height: 900 }, timezoneId: 'America/Sao_Paulo' });
    const page = await context.newPage();
    await page.route(/gc\.zgo\.at|goatcounter\.com|abacus\.jasoncameron\.dev/, (route) => route.abort());
    for (const route of LAYOUT_ROUTES) {
      await page.goto(`${ORIGIN}/EGCSite/${route}`, { waitUntil: 'domcontentloaded' });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect.soft(overflow, `/${route} at ${width}px`).toBe(0);
    }
    await context.close();
  });
}

test('html and body clip horizontal overflow instead of hiding it', async ({ page }) => {
  for (const route of ['', 'docs/memory/', 'contributors/']) {
    await page.goto(route);
    const values = await page.evaluate(() => [getComputedStyle(document.documentElement).overflowX, getComputedStyle(document.body).overflowX]);
    expect(values).not.toContain('hidden');
  }
});
