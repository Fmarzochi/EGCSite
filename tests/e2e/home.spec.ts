import { expect, test } from './fixtures';

// Sections 11.1 (language by time zone) and 11.3 (home) of the brief.

const PT_ZONES = [
  'America/Sao_Paulo',
  'America/Manaus',
  'America/Noronha',
  'Europe/Lisbon',
  'Atlantic/Azores',
  'Africa/Luanda',
  'Africa/Maputo',
  'Atlantic/Cape_Verde',
  'Asia/Dili',
];
const EN_ZONES = [
  'America/New_York',
  'Europe/Berlin',
  'America/Argentina/Buenos_Aires',
  'Asia/Tokyo',
  'Europe/London',
];
const LANGUAGE_SWITCH =
  '[data-lang], .lang-switch, .lang, [aria-label*="idioma" i], [aria-label*="language" i]';

const heroTitle = async (page: import('@playwright/test').Page) =>
  (await page.locator('#hero-title').innerText()).replace(/\s+/g, ' ').trim();

test.describe('language follows the device time zone', () => {
  for (const timezoneId of PT_ZONES) {
    test.describe(timezoneId, () => {
      test.use({ timezoneId });
      test('opens in Portuguese', async ({ page }) => {
        await page.goto('en/');
        await expect(page).toHaveURL(/\/EGCSite\/$/);
        await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
        expect(await heroTitle(page)).toBe('Contexto que nunca zera.');
      });
    });
  }

  for (const timezoneId of EN_ZONES) {
    test.describe(timezoneId, () => {
      test.use({ timezoneId });
      test('opens in English', async ({ page }) => {
        await page.goto('./');
        await expect(page).toHaveURL(/\/EGCSite\/en\/$/);
        await expect(page.locator('html')).toHaveAttribute('lang', 'en');
        expect(await heroTitle(page)).toBe('Context that never resets.');
      });
    });
  }

  test('an old saved "en" is ignored and deleted', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('egc-lang', 'en'));
    await page.goto('./');
    await expect(page).toHaveURL(/\/EGCSite\/$/);
    expect(await heroTitle(page)).toBe('Contexto que nunca zera.');
    expect(await page.evaluate(() => localStorage.getItem('egc-lang'))).toBeNull();
  });

  test('there is no language switch', async ({ page }) => {
    await page.goto('./');
    await expect(page.locator(LANGUAGE_SWITCH)).toHaveCount(0);
  });

  test.describe('phone menu', () => {
    test.use({ viewport: { width: 390, height: 844 } });
    test('opens without a language row', async ({ page }) => {
      await page.goto('./');
      await page.locator('.burger').click();
      await expect(page.locator('#mnav')).toBeVisible();
      await expect(page.locator('#mnav').locator(LANGUAGE_SWITCH)).toHaveCount(0);
      await expect(page.locator('#mnav a').first()).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(page.locator('.burger')).toBeFocused();
      await expect(page.locator('#mnav')).toBeHidden();
    });
  });
});

test.describe('home', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('install tabs work with the keyboard', async ({ page }) => {
    await page.goto('./');
    const tabs = page.locator('.term__tab');
    await tabs.first().focus();
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(1)).toBeFocused();
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('End');
    await expect(tabs.last()).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('.term__panel:not([hidden])')).toHaveCount(1);
    await page.keyboard.press('Home');
    await expect(tabs.first()).toBeFocused();
  });

  test('demo steps work with the keyboard', async ({ page }) => {
    await page.goto('./');
    const steps = page.locator('[data-demo] .step');
    await expect(steps).toHaveCount(5);
    await steps.nth(2).click();
    await expect(steps.nth(2)).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('ArrowRight');
    await expect(steps.nth(3)).toBeFocused();
    await expect(steps.nth(3)).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('.demo__panel').nth(3)).not.toHaveAttribute('aria-hidden', 'true');
  });

  test('FAQ accordions open and close, the first starts open', async ({ page }) => {
    await page.goto('./');
    const items = page.locator('.faq details');
    await expect(items.first()).toHaveAttribute('open', '');
    await items.nth(1).locator('summary').click();
    await expect(items.nth(1)).toHaveAttribute('open', '');
  });

  test('the install command copies', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('./');
    const button = page.locator('.hero [data-copy]');
    await button.click();
    await expect(button).toHaveAttribute('data-state', 'done');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      await button.getAttribute('data-copy'),
    );
  });

  test('the header gets a background and links the same pages as the inner menu', async ({
    page,
  }) => {
    await page.goto('./');
    await expect(page.locator('.hdr')).toHaveAttribute('data-scrolled', 'false');
    await page.locator('#funcoes').evaluate((el) => el.scrollIntoView({ block: 'start' }));
    await expect(page.locator('.hdr')).toHaveAttribute('data-scrolled', 'true');
    await expect(page.locator('.nav a[aria-current="page"]')).toHaveText('Início');

    const targets = (selector: string) =>
      page.$$eval(selector, (links) =>
        links.map((a) => (a as HTMLAnchorElement).pathname + (a as HTMLAnchorElement).host),
      );
    const home = await targets('.nav a');
    await page.goto('features/');
    const inner = await targets('header nav[aria-label="Main navigation"] a');
    expect(home.slice(1)).toEqual(inner.slice(1));
  });

  test.describe('with reduced motion', () => {
    test.use({ reducedMotion: 'reduce' });
    test('everything is visible', async ({ page }) => {
      await page.goto('./');
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      const hidden = await page.$$eval(
        '.rv, .metric',
        (els) => els.filter((el) => getComputedStyle(el).opacity !== '1').length,
      );
      expect(hidden).toBe(0);
    });
  });
});

test('without JavaScript the home is fully visible', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    timezoneId: 'America/Sao_Paulo',
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/EGCSite/');
  const hidden = await page.$$eval(
    '.rv, .metric',
    (els) => els.filter((el) => getComputedStyle(el).opacity !== '1').length,
  );
  expect(hidden).toBe(0);
  await expect(page.locator('.faq details').first()).toHaveAttribute('open', '');
  await context.close();
});
