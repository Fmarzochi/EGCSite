import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

// The docs pages show whole: the sections are accordion rows (docs-accordion.spec.ts), the
// section focus is off. Plus the docs widgets.

const visibleSections = (page: Page) =>
  page.$$eval('.docs-content > section[id]', (sections) =>
    sections.filter((s) => !(s as HTMLElement).hidden).map((s) => s.id),
  );

const ALL = ['overview', 'workflow', 'tools', 'state-format', 'protocol'];

test.describe('/docs/memory/ without section focus', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('without a hash the whole page shows', async ({ page }) => {
    await page.goto('docs/memory/');
    expect(await visibleSections(page)).toEqual(ALL);
    await expect(page.locator('.docs-section-bar')).toHaveCount(0);
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
