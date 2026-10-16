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

// The address decides, as on the inner pages: English at /, Portuguese at /pt/, whatever the
// device time zone, and the old English address /en/ leads to /.
test.describe('the address decides the home language', () => {
  for (const timezoneId of [...PT_ZONES, ...EN_ZONES]) {
    test.describe(timezoneId, () => {
      test.use({ timezoneId });
      test('/ is English and /pt/ is Portuguese', async ({ page }) => {
        await page.goto('./');
        await page.waitForTimeout(300);
        await expect(page).toHaveURL(/\/EGCSite\/$/);
        await expect(page.locator('html')).toHaveAttribute('lang', 'en');
        expect(await heroTitle(page)).toBe('Context that never resets.');
        await page.goto('pt/');
        await page.waitForTimeout(300);
        await expect(page).toHaveURL(/\/EGCSite\/pt\/$/);
        await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
        expect(await heroTitle(page)).toBe('Contexto que nunca zera.');
      });
    });
  }

  test('the old /en/ address leads to /, keeping the hash', async ({ page }) => {
    await page.goto('en/#instalar');
    await expect(page).toHaveURL(/\/EGCSite\/#instalar$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('an old saved "en" is ignored and deleted', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('egc-lang', 'en'));
    await page.goto('pt/');
    await expect(page).toHaveURL(/\/EGCSite\/pt\/$/);
    expect(await heroTitle(page)).toBe('Contexto que nunca zera.');
    expect(await page.evaluate(() => localStorage.getItem('egc-lang'))).toBeNull();
  });

  test('there is no language switch', async ({ page }) => {
    await page.goto('pt/');
    await expect(page.locator(LANGUAGE_SWITCH)).toHaveCount(0);
  });

  test.describe('phone menu', () => {
    test.use({ viewport: { width: 390, height: 844 } });
    test('opens without a language row', async ({ page }) => {
      await page.goto('pt/');
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
    await page.goto('pt/');
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
    await page.goto('pt/');
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
    await page.goto('pt/');
    const items = page.locator('.faq details');
    await expect(items.first()).toHaveAttribute('open', '');
    await items.nth(1).locator('summary').click();
    await expect(items.nth(1)).toHaveAttribute('open', '');
  });

  test('the install command copies', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('pt/');
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
    await page.goto('pt/');
    await expect(page.locator('.hdr')).toHaveAttribute('data-scrolled', 'false');
    await page.locator('#funcoes').evaluate((el) => el.scrollIntoView({ block: 'start' }));
    await expect(page.locator('.hdr')).toHaveAttribute('data-scrolled', 'true');
    await expect(page.locator('.nav a[aria-current="page"]')).toHaveText('Início');

    const targets = (selector: string) =>
      page.$$eval(selector, (links) =>
        links.map((a) => (a as HTMLAnchorElement).pathname + (a as HTMLAnchorElement).host),
      );
    // The Portuguese home leads to the Portuguese inner pages, so it matches their menu.
    const home = await targets('.nav a');
    await page.goto('pt/features/');
    const inner = await targets('header nav[aria-label="Navegação principal"] a');
    expect(home.slice(1)).toEqual(inner.slice(1));
  });

  test.describe('with reduced motion', () => {
    test.use({ reducedMotion: 'reduce' });
    test('everything is visible', async ({ page }) => {
      await page.goto('pt/');
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
  await page.goto('http://127.0.0.1:4173/EGCSite/pt/');
  const hidden = await page.$$eval(
    '.rv, .metric',
    (els) => els.filter((el) => getComputedStyle(el).opacity !== '1').length,
  );
  expect(hidden).toBe(0);
  await expect(page.locator('.faq details').first()).toHaveAttribute('open', '');
  await context.close();
});

test('the recorded demo plays on the home and loads nothing from YouTube until play', async ({ page }) => {
  const youtube: string[] = [];
  // The player itself is not needed here: stop the requests, but record that they were made.
  await page.route(/youtube(-nocookie)?\.com|ytimg\.com|googlevideo\.com/, (route) => {
    youtube.push(route.request().url());
    return route.fulfill({ body: '' });
  });
  for (const [path, label, captions] of [
    ['./', 'Play the recorded demo', 'en'],
    ['pt/', 'Reproduzir a demonstração gravada', 'pt'],
  ] as const) {
    youtube.length = 0;
    await page.goto(path);
    const media = page.locator('#demo .demo-video__media');
    await media.scrollIntoViewIfNeeded();
    await expect(media.locator('img')).toHaveAttribute('src', '/EGCSite/demo/egc-demo-v2.jpg');
    await expect.poll(() => media.locator('img').evaluate((img: HTMLImageElement) => img.naturalWidth)).toBe(1280);
    // Without JS the still is a link to the video, so it has the same name either way.
    await expect(media).toHaveAttribute('href', 'https://www.youtube.com/watch?v=A8M_98WdI0Q');
    expect(youtube).toEqual([]);

    await page.getByRole('link', { name: label }).click();
    const player = page.locator('#demo .demo-video__media iframe');
    await expect(player).toHaveAttribute('src', new RegExp(`^https://www\\.youtube-nocookie\\.com/embed/A8M_98WdI0Q\\?autoplay=1&cc_load_policy=1&cc_lang_pref=${captions}`));
    await expect(player).toBeFocused();
    await expect(page).toHaveURL(new RegExp(`/EGCSite/${path === './' ? '' : 'pt/'}$`));
    await expect.poll(() => youtube.some((url) => url.startsWith('https://www.youtube-nocookie.com/embed/'))).toBe(true);
  }
});

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]) {
  test(`the play sign sits on the centre of its circle at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    // Distance between the centre of the triangle's box and the centre of the circle, in px.
    const offset = () =>
      page.locator('#demo .demo-video__play').evaluate((circle) => {
        const c = circle.getBoundingClientRect();
        const t = circle.querySelector('path')!.getBoundingClientRect();
        return {
          x: Math.abs(t.x + t.width / 2 - (c.x + c.width / 2)),
          y: Math.abs(t.y + t.height / 2 - (c.y + c.height / 2)),
        };
      });
    for (const path of ['./', 'pt/']) {
      await page.goto(path);
      const media = page.locator('#demo .demo-video__media');
      await media.scrollIntoViewIfNeeded();
      for (const state of ['rest', 'hover']) {
        if (state === 'hover') await media.hover();
        // The hover scale animates; measure once it has settled.
        await expect
          .poll(async () => {
            const { x, y } = await offset();
            return x <= 0.5 && y <= 0.5;
          }, { message: `${path} ${state}: ${JSON.stringify(await offset())}` })
          .toBe(true);
      }
    }
  });
}
