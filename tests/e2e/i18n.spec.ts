import { expect, test } from './fixtures';

// Inner pages are bilingual by URL: English at the current addresses, Portuguese under /pt/.
// The address decides; no redirect and no language switch on inner pages.

const PROD = 'https://fmarzochi.github.io/EGCSite/';

/** One page of each kind; every one of them exists in both languages. */
const PAGES = [
  'get-started/',
  'features/',
  'docs/architecture/',
  'docs/cli/',
  'docs/faq/',
  'docs/guardian/',
  'docs/mcp/',
  'docs/memory/',
  'docs/security/',
  'integrations/',
  'integrations/cursor/',
  'privacy/',
  'contributors/',
  'contributors/phaiffer/',
];

/** Same-site addresses a Portuguese page may still link to in English: the homes and files. */
const NOT_PAGES = new Set([
  '/EGCSite/',
  '/EGCSite/en/',
  '/EGCSite/rss.xml',
  '/EGCSite/architecture.svg',
]);

test('the Portuguese pilot page is in Portuguese, chrome included', async ({ page }) => {
  await page.goto('pt/get-started/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.locator('h1')).toHaveText('Instalação');
  await expect(page.locator('a[href="#main-content"]')).toHaveText('Pular para o conteúdo');
  await expect(page.locator('header nav').first()).toContainText('Início');
  await expect(page.locator('footer')).toContainText('Guia de instalação');
  await expect(page.locator('.docs-copy-code').first()).toHaveText('Copiar');
});

for (const path of PAGES) {
  test(`${path} exists in Portuguese with its own text`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    const english = await page.locator('main').innerText();
    await page.goto(`pt/${path}`);
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    await expect(page.locator('a[href="#main-content"]')).toHaveText('Pular para o conteúdo');
    await expect(page.locator('footer')).toContainText('Política de privacidade');
    expect(await page.locator('main').innerText()).not.toBe(english);
  });
}

test('both versions point at each other with hreflang and keep their own canonical', async ({
  page,
}) => {
  for (const path of ['get-started/', 'docs/faq/', 'integrations/cursor/', 'contributors/']) {
    for (const [route, canonical] of [
      [path, `${PROD}${path}`],
      [`pt/${path}`, `${PROD}pt/${path}`],
    ] as const) {
      await page.goto(route);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
      await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
        'href',
        `${PROD}${path}`,
      );
      await expect(page.locator('link[rel="alternate"][hreflang="pt-BR"]')).toHaveAttribute(
        'href',
        `${PROD}pt/${path}`,
      );
      await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
        'href',
        `${PROD}${path}`,
      );
    }
  }
});

test.describe('the address decides, whatever the time zone', () => {
  test.describe('São Paulo on an English page', () => {
    test.use({ timezoneId: 'America/Sao_Paulo' });
    test('stays in English', async ({ page }) => {
      await page.goto('get-started/');
      await page.waitForTimeout(500);
      await expect(page).toHaveURL(/\/EGCSite\/get-started\/$/);
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    });
  });
  test.describe('New York on a Portuguese page', () => {
    test.use({ timezoneId: 'America/New_York' });
    test('stays in Portuguese', async ({ page }) => {
      await page.goto('pt/get-started/');
      await page.waitForTimeout(500);
      await expect(page).toHaveURL(/\/EGCSite\/pt\/get-started\/$/);
      await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    });
  });
});

test('Portuguese pages link to Portuguese pages, and English pages to English ones', async ({
  page,
}) => {
  for (const path of [
    'get-started/',
    'docs/mcp/',
    'integrations/cursor/',
    'contributors/',
    'contributors/phaiffer/',
  ]) {
    await page.goto(`pt/${path}`);
    const pt = await page.$$eval('a[href^="/EGCSite/"]', (links) =>
      links.map((a) => a.getAttribute('href') ?? ''),
    );
    expect(pt.filter((href) => !href.startsWith('/EGCSite/pt/') && !NOT_PAGES.has(href))).toEqual(
      [],
    );

    await page.goto(path);
    const en = await page.$$eval('a[href^="/EGCSite/"]', (links) =>
      links.map((a) => a.getAttribute('href') ?? ''),
    );
    expect(en.filter((href) => href.startsWith('/EGCSite/pt/'))).toEqual([]);
  }
});

test('the Portuguese home leads to the Portuguese pages', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('footer a', { hasText: 'Guia de instalação' })).toHaveAttribute(
    'href',
    '/EGCSite/pt/get-started/',
  );
  await expect(page.locator('.nav a', { hasText: 'Hall of Fame' })).toHaveAttribute(
    'href',
    '/EGCSite/pt/contributors/',
  );
});

test('there is no language switch on inner pages', async ({ page }) => {
  for (const path of ['get-started/', 'pt/get-started/', 'contributors/', 'pt/contributors/']) {
    await page.goto(path);
    await expect(page.locator('[data-lang], .lang-switch, [hreflang]:not(link)')).toHaveCount(0);
  }
});

test('every tool page has its own Portuguese texts', async ({ request }) => {
  const sitemap = await (await request.get('sitemap-0.xml')).text();
  const slugs = [...sitemap.matchAll(/<loc>[^<]*\/EGCSite\/integrations\/([^/<]+)\/<\/loc>/g)].map(
    (m) => m[1],
  );
  expect(slugs.length).toBeGreaterThan(20);
  // The "Files" row of the install table: the tool's own text, translated per tool.
  const filesRow = (html: string) =>
    html.match(
      /<th scope="row"[^>]*>[^<]*<\/th><td class="px-5 py-3 text-gray-600[^>]*>([^<]*)</,
    )?.[1];
  for (const slug of slugs) {
    const en = filesRow(await (await request.get(`integrations/${slug}/`)).text());
    const pt = filesRow(await (await request.get(`pt/integrations/${slug}/`)).text());
    expect(en, slug).toBeTruthy();
    expect(pt, slug).toBeTruthy();
    expect(pt, slug).not.toBe(en);
  }
});

test('the Hall of Fame speaks Portuguese in its behaviour too', async ({ page }) => {
  await page.goto('pt/contributors/');
  await page.locator('#contributor-search').fill('a');
  await expect(page.locator('#count')).toHaveText(/^Mostrando \d+/);
  await page.locator('thead th[data-key="prs"] button').click();
  await expect(page.locator('#mobile-sort-status')).toHaveText('Ordenado por PRs, decrescente.');
  // The contributor's own highlight is kept as written and marked as English.
  await page.goto('pt/contributors/phaiffer/');
  await expect(page.locator('main [lang="en"]').first()).toBeVisible();
  await expect(page.locator('main')).toContainText('O que construiu');
});

test('the sitemap lists every Portuguese page with its pair', async ({ request }) => {
  const xml = await (await request.get('sitemap-0.xml')).text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1] ?? '');
  const inner = locs.filter(
    (loc) => loc !== PROD && loc !== `${PROD}en/` && !loc.startsWith(`${PROD}pt/`),
  );
  const portuguese = locs.filter((loc) => loc.startsWith(`${PROD}pt/`));
  expect(portuguese.length).toBe(inner.length);
  for (const path of ['get-started/', 'integrations/cursor/', 'privacy/']) {
    const entry = xml.match(new RegExp(`<url><loc>${PROD}pt/${path}</loc>(.*?)</url>`))?.[1] ?? '';
    expect(entry).toContain(`hreflang="en" href="${PROD}${path}"`);
    expect(entry).toContain(`hreflang="pt-BR" href="${PROD}pt/${path}"`);
  }
});
