import { expect, test } from './fixtures';

// Inner pages are bilingual by URL: English at the current addresses, Portuguese under /pt/.
// The address decides; no redirect and no language switch on inner pages.

const PROD = 'https://fmarzochi.github.io/EGCSite/';

test('the Portuguese page is in Portuguese, chrome included', async ({ page }) => {
  await page.goto('pt/get-started/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.locator('h1')).toHaveText('Instalação');
  await expect(page.locator('a[href="#main-content"]')).toHaveText('Pular para o conteúdo');
  await expect(page.locator('header nav').first()).toContainText('Início');
  await expect(page.locator('footer')).toContainText('Guia de instalação');
  await expect(page.locator('.docs-copy-code').first()).toHaveText('Copiar');
});

test('both versions point at each other with hreflang and keep their own canonical', async ({
  page,
}) => {
  for (const [path, canonical] of [
    ['get-started/', `${PROD}get-started/`],
    ['pt/get-started/', `${PROD}pt/get-started/`],
  ] as const) {
    await page.goto(path);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      'href',
      `${PROD}get-started/`,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="pt-BR"]')).toHaveAttribute(
      'href',
      `${PROD}pt/get-started/`,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
      'href',
      `${PROD}get-started/`,
    );
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

test('links stay in Portuguese where a translation exists, English otherwise', async ({ page }) => {
  await page.goto('pt/get-started/');
  const hrefs = await page.$$eval('header a, footer a, aside a, main a', (links) =>
    links.map((a) => a.getAttribute('href') ?? ''),
  );
  expect(hrefs).toContain('/EGCSite/pt/get-started/');
  expect(hrefs).toContain('/EGCSite/features/');
  expect(
    hrefs.filter((href) => href.startsWith('/EGCSite/pt/') && href !== '/EGCSite/pt/get-started/'),
  ).toEqual([]);
});

test('the Portuguese home leads to the Portuguese page', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('footer a', { hasText: 'Guia de instalação' })).toHaveAttribute(
    'href',
    '/EGCSite/pt/get-started/',
  );
});

test('there is no language switch on inner pages', async ({ page }) => {
  for (const path of ['get-started/', 'pt/get-started/']) {
    await page.goto(path);
    await expect(page.locator('[data-lang], .lang-switch, [hreflang]:not(link)')).toHaveCount(0);
  }
});

test('the sitemap lists the Portuguese page with its pair', async ({ request }) => {
  const xml = await (await request.get('sitemap-0.xml')).text();
  const entry =
    xml.match(new RegExp(`<url><loc>${PROD}pt/get-started/</loc>(.*?)</url>`))?.[1] ?? '';
  expect(entry).toContain(`hreflang="en" href="${PROD}get-started/"`);
  expect(entry).toContain(`hreflang="pt-BR" href="${PROD}pt/get-started/"`);
});
