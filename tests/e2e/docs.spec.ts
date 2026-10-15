import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

// Section 11.2 of the brief (section focus on /docs/memory/), plus the docs widgets.

const visibleSections = (page: Page) =>
  page.$$eval('.docs-content > section[id]', (sections) =>
    sections.filter((s) => !(s as HTMLElement).hidden).map((s) => s.id),
  );

const ALL = ['overview', 'workflow', 'tools', 'state-format', 'protocol'];

test.describe('section focus on /docs/memory/', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('without a hash the whole page shows', async ({ page }) => {
    await page.goto('docs/memory/');
    expect(await visibleSections(page)).toEqual(ALL);
    await expect(page.locator('.docs-section-bar')).toHaveCount(0);
  });

  test('a TOC click shows only that section, with the bar under the header', async ({ page }) => {
    await page.goto('docs/memory/');
    await page.locator('.docs-toc nav a', { hasText: 'Tool reference' }).click();
    await expect(page).toHaveURL(/#tools$/);
    expect(await visibleSections(page)).toEqual(['tools']);
    const bar = page.locator('.docs-section-bar');
    await expect(bar.locator('.eyebrow')).toHaveText('MCP SERVERS / MEMORY · 3 / 5');
    await expect(bar.getByRole('button', { name: 'Show full page' })).toBeVisible();
    // Measure once the scroll to the section has settled; under load it can still be moving.
    let lastY = Number.NaN;
    await expect
      .poll(async () => {
        const y = (await bar.boundingBox())!.y;
        const settled = y === lastY;
        lastY = y;
        return settled;
      })
      .toBe(true);
    const header = await page.locator('#site-header').boundingBox();
    const barBox = await bar.boundingBox();
    expect(barBox!.y).toBeGreaterThanOrEqual(header!.y + header!.height - 1);
    expect(barBox!.y).toBeLessThan(900);
    await expect(page.locator('.docs-toc a[aria-current="location"]')).toHaveText('Tool reference');
  });

  test('previous and next lead to the neighbour sections', async ({ page }) => {
    await page.goto('docs/memory/#tools');
    const nav = page.locator('.docs-section-nav');
    await expect(nav.locator('[rel="prev"] strong')).toHaveText('How it works');
    await expect(nav.locator('[rel="next"] strong')).toHaveText('State format');
    await nav.locator('[rel="next"]').click();
    expect(await visibleSections(page)).toEqual(['state-format']);
    await expect(page.locator('.docs-section-bar .eyebrow')).toHaveText(/· 4 \/ 5$/);
  });

  test('back and forward move between the views', async ({ page }) => {
    await page.goto('docs/memory/');
    await page.locator('.docs-toc nav a', { hasText: 'Tool reference' }).click();
    expect(await visibleSections(page)).toEqual(['tools']);
    await page.goBack();
    await expect.poll(() => visibleSections(page)).toEqual(ALL);
    await page.goForward();
    await expect.poll(() => visibleSections(page)).toEqual(['tools']);
  });

  test('"Show full page" keeps the place and the focus', async ({ page }) => {
    await page.goto('docs/memory/#tools');
    await page.getByRole('button', { name: 'Show full page' }).click();
    expect(await visibleSections(page)).toEqual(ALL);
    await expect(page).not.toHaveURL(/#/);
    const focused = page.locator(':focus');
    await expect(focused).toHaveText('Tool reference');
    const top = await focused.evaluate((el) => el.getBoundingClientRect().top);
    expect(top).toBeGreaterThanOrEqual(0);
    expect(top).toBeLessThan(300);
  });

  test('the keyboard opens a section with Enter', async ({ page }) => {
    await page.goto('docs/memory/');
    await page.locator('.docs-toc nav a', { hasText: 'Session protocol' }).focus();
    await page.keyboard.press('Enter');
    await expect.poll(() => visibleSections(page)).toEqual(['protocol']);
  });

  test('an inner anchor opens the section that holds it', async ({ page }) => {
    await page.goto('docs/memory/#methods-history');
    expect(await visibleSections(page)).toEqual(['tools']);
    await expect(page.locator('#methods-history')).toBeFocused();
  });

  test('the active TOC item follows the scroll', async ({ page }) => {
    await page.goto('docs/memory/');
    await page.locator('#state-format').evaluate((el) => el.scrollIntoView({ block: 'start' }));
    await expect(page.locator('.docs-toc a[aria-current="location"]')).toHaveText('State format');
  });

  test('/docs/guardian/ has no section focus', async ({ page }) => {
    await page.goto('docs/guardian/');
    const first = page.locator('.docs-toc nav a').first();
    await first.click();
    await expect(page.locator('.docs-section-bar')).toHaveCount(0);
    await expect(page.locator('.docs-content > section[hidden]')).toHaveCount(0);
  });
});

test('without JavaScript the memory page shows whole', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/EGCSite/docs/memory/#tools');
  expect(await visibleSections(page)).toEqual(ALL);
  await context.close();
});

test.describe('section picker on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('the picker opens the section, closes and causes no horizontal scroll', async ({ page }) => {
    await page.goto('docs/memory/');
    const picker = page.locator('.docs-section-picker');
    await picker.locator('summary').click();
    await picker.locator('nav a[href="#tools"]').click();
    await expect.poll(() => visibleSections(page)).toEqual(['tools']);
    await expect(picker).not.toHaveAttribute('open', '');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });
});

test.describe('docs widgets', () => {
  test('install tabs follow the WAI-ARIA pattern', async ({ page }) => {
    await page.goto('get-started/');
    const tabs = page.getByRole('tab');
    await expect(tabs).toHaveCount(4);
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
    await tabs.nth(0).focus();
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(1)).toBeFocused();
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#panel-linux')).toBeVisible();
    await expect(page.locator('#panel-npm')).toBeHidden();
    await page.keyboard.press('End');
    await expect(tabs.nth(3)).toBeFocused();
    await expect(page.locator('#panel-windows')).toBeVisible();
    await page.keyboard.press('Home');
    await expect(tabs.nth(0)).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await expect(tabs.nth(3)).toBeFocused();
  });

  test('code blocks copy and announce it', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('docs/cli/');
    const button = page.locator('.docs-copy-code').first();
    await expect(button).toHaveAttribute('aria-live', 'polite');
    await button.click();
    await expect(button).toHaveText(/Copied/);
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied.length).toBeGreaterThan(0);
  });
});
