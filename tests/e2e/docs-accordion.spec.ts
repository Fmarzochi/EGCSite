import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

// Docs sections as rows of the home FAQ (components/docs/DocsSection.tsx): native <details>,
// the first open, links and hashes open the section they point into, printing opens them all.

const PAGES = [
  ['features/', 4],
  ['docs/memory/', 5],
  ['docs/guardian/', 3],
  ['docs/mcp/', 2],
  ['docs/architecture/', 3],
  ['docs/security/', 4],
] as const;
const ROUTES = PAGES.flatMap(([path, count]) => [
  [path, count],
  [`pt/${path}`, count],
] as const);
const ORIGIN = 'http://127.0.0.1:4173/EGCSite/';

const openStates = (page: Page) =>
  page.$$eval('.docs-content > section.docs-acc > details', (all) => all.map((d) => (d as HTMLDetailsElement).open));
const sectionOpen = (page: Page, id: string) =>
  page.locator(`#${id}`).evaluate((el) => (el.closest('section')!.querySelector('details') as HTMLDetailsElement).open);

test('every section is a row with its heading as the summary, the first open, in the HTML itself', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const [route, count] of ROUTES) {
    await page.goto(`${ORIGIN}${route}`);
    expect(await openStates(page), route).toEqual([true, ...Array(count - 1).fill(false)]);
    await expect(page.locator('.docs-acc__summary > h2'), route).toHaveCount(count);
    // The hero stays outside: title, lead and pills are never folded away.
    await expect(page.locator('.docs-content details h1'), route).toHaveCount(0);
  }
  await context.close();
});

test('without JavaScript a row opens and closes with a click', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${ORIGIN}docs/guardian/`);
  const second = page.locator('.docs-acc__summary').nth(1);
  await second.click();
  expect(await openStates(page)).toEqual([true, true, false]);
  await second.click();
  expect(await openStates(page)).toEqual([true, false, false]);
  await context.close();
});

test.describe('links into a closed section', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('an "On this page" link opens the section and scrolls to it', async ({ page }) => {
    for (const [path, label] of [
      ['docs/memory/', 'Session protocol'],
      ['pt/docs/memory/', 'Protocolo da sessão'],
    ] as const) {
      await page.goto(path);
      expect(await sectionOpen(page, 'protocol')).toBe(false);
      await page.locator('.docs-toc nav a', { hasText: label }).click();
      await expect.poll(() => sectionOpen(page, 'protocol')).toBe(true);
      await expect(page.locator('#protocol .docs-acc__summary')).toBeInViewport();
      // The other sections keep their state.
      expect((await openStates(page))[0]).toBe(true);
    }
  });

  test('a generated "On this page" link opens its section too', async ({ page }) => {
    await page.goto('docs/guardian/');
    const last = page.locator('.docs-toc nav a').last();
    const id = (await last.getAttribute('href'))!.slice(1);
    await last.click();
    await expect.poll(() => sectionOpen(page, id)).toBe(true);
    await expect(page.locator(`#${id}`)).toBeInViewport();
  });

  test('a URL with a hash opens the section, even for an anchor deep inside it', async ({ page }) => {
    for (const [path, id] of [
      ['docs/memory/#tools', 'tools'],
      ['pt/docs/memory/#state-format', 'state-format'],
      ['docs/memory/#methods-history', 'methods-history'],
    ] as const) {
      await page.goto(path);
      await expect.poll(() => sectionOpen(page, id), path).toBe(true);
      await expect(page.locator(`#${id}`), path).toBeInViewport();
    }
  });

  test('back and forward open the section of the hash', async ({ page }) => {
    await page.goto('docs/memory/');
    await page.locator('.docs-toc nav a', { hasText: 'State format' }).click();
    await expect.poll(() => sectionOpen(page, 'state-format')).toBe(true);
    await page.locator('#state-format .docs-acc__summary').click();
    expect(await sectionOpen(page, 'state-format')).toBe(false);
    await page.goBack();
    await page.goForward();
    await expect.poll(() => sectionOpen(page, 'state-format')).toBe(true);
    await expect(page.locator('#state-format .docs-acc__summary')).toBeInViewport();
  });
});

test('the keyboard opens and closes a row, with a visible focus ring', async ({ page }) => {
  await page.goto('pt/docs/architecture/');
  const summary = page.locator('.docs-acc__summary').nth(1);
  await page.keyboard.press('Shift');
  await summary.focus();
  await expect(summary).toBeFocused();
  expect(await summary.evaluate((el) => getComputedStyle(el).outlineStyle)).not.toBe('none');
  await page.keyboard.press('Enter');
  expect(await openStates(page)).toEqual([true, true, false]);
  await page.keyboard.press('Space');
  expect(await openStates(page)).toEqual([true, false, false]);
});

test('printing opens every section and closes them again afterwards', async ({ page }) => {
  await page.goto('docs/security/');
  const before = await page.$$eval('.docs-content details', (all) => all.map((d) => (d as HTMLDetailsElement).open));
  await page.evaluate(() => window.dispatchEvent(new Event('beforeprint')));
  expect(await page.$$eval('.docs-content details', (all) => all.every((d) => (d as HTMLDetailsElement).open))).toBe(true);
  await page.evaluate(() => window.dispatchEvent(new Event('afterprint')));
  expect(await page.$$eval('.docs-content details', (all) => all.map((d) => (d as HTMLDetailsElement).open))).toEqual(before);
});

test('without JavaScript the print stylesheet still shows closed sections', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${ORIGIN}docs/guardian/`);
  const inner = page.locator('.docs-acc').last().locator('.docs-acc__body > *').first();
  expect(await inner.evaluate((el) => el.checkVisibility())).toBe(false);
  await page.emulateMedia({ media: 'print' });
  expect(await inner.evaluate((el) => el.checkVisibility())).toBe(true);
  await context.close();
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('the chevron turns without animating', async ({ page }) => {
    await page.goto('docs/mcp/');
    const durations = await page.locator('.docs-acc__icon svg').first().evaluate((el) => getComputedStyle(el).transitionDuration);
    expect(Math.max(...durations.split(',').map((d) => parseFloat(d)))).toBeLessThan(0.001);
  });
});

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]) {
  test(`the chevron sits on the centre of its circle, closed and open, at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('docs/memory/');
    const offset = (index: number) =>
      page.locator('.docs-acc__icon').nth(index).evaluate((circle) => {
        const c = circle.getBoundingClientRect();
        const t = circle.querySelector('path')!.getBoundingClientRect();
        return {
          x: Math.abs(t.x + t.width / 2 - (c.x + c.width / 2)),
          y: Math.abs(t.y + t.height / 2 - (c.y + c.height / 2)),
        };
      });
    // The first row starts open (chevron turned), the second closed.
    for (const index of [0, 1]) {
      await expect
        .poll(async () => {
          const { x, y } = await offset(index);
          return x <= 0.5 && y <= 0.5;
        }, { message: `row ${index}: ${JSON.stringify(await offset(index))}` })
        .toBe(true);
    }
  });
}

for (const width of [320, 390, 768, 1024, 1440, 1920]) {
  test(`no horizontal scroll with every section open at ${width}px`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    await page.route(/gc\.zgo\.at|goatcounter\.com|abacus\.jasoncameron\.dev/, (route) => route.abort());
    for (const [route] of ROUTES) {
      await page.goto(`${ORIGIN}${route}`, { waitUntil: 'domcontentloaded' });
      await page.$$eval('.docs-content details', (all) => all.forEach((d) => ((d as HTMLDetailsElement).open = true)));
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect.soft(overflow, `/${route} at ${width}px`).toBe(0);
    }
    await context.close();
  });
}
