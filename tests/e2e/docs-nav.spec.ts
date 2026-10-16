import { expect, test } from './fixtures';

// The docs sidebar: groups that open and close like the Next.js docs, built on native
// <details name="docs-nav"> so it works without JS; only the current page's group starts open.

const groups = '#docs-sidebar details[name="docs-nav"]';

test.describe('docs sidebar groups', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('only the group of the current page starts open, in the HTML itself', async ({ page, request }) => {
    const html = await (await request.get('docs/cli/')).text();
    expect(html.match(/<details name="docs-nav"[^>]*\sopen=""/g)).toHaveLength(1);

    await page.goto('docs/cli/');
    await expect(page.locator(`${groups}[open]`)).toHaveCount(1);
    await expect(page.locator(`${groups}[open] summary`)).toHaveText('Reference');
    await expect(page.locator('#docs-sidebar a[aria-current="page"]')).toHaveText('CLI Reference');
  });

  test('opening a group closes the others', async ({ page }) => {
    await page.goto('docs/cli/');
    await page.locator(`${groups} summary`, { hasText: 'MCP Servers' }).click();
    await expect(page.locator(`${groups}[open] summary`)).toHaveText('MCP Servers');
    await expect(page.locator('#docs-sidebar a', { hasText: 'egc-memory' })).toBeVisible();
    await expect(page.locator('#docs-sidebar a', { hasText: 'CLI Reference' })).toBeHidden();
  });

  test('a group opens and closes with the keyboard', async ({ page }) => {
    await page.goto('docs/cli/');
    const summary = page.locator(`${groups} summary`, { hasText: 'Getting Started' });
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator(`${groups}[open] summary`)).toHaveText('Getting Started');
    await page.keyboard.press('Space');
    await expect(page.locator(`${groups}[open]`)).toHaveCount(0);
    await page.keyboard.press('Tab');
    await expect(page.locator(`${groups} summary`, { hasText: 'MCP Servers' })).toBeFocused();
  });

  test('single pages sit at the top level, and Integrations keeps its tool count', async ({ page }) => {
    await page.goto('docs/cli/');
    const integrations = page.locator('#docs-sidebar .docs-nav-top-link', { hasText: 'Integrations' });
    await expect(integrations).toHaveAttribute('href', '/EGCSite/integrations/');
    await expect(integrations).toContainText(/All \d+ tools/);
    await expect(page.locator('#docs-sidebar .docs-nav-top-link', { hasText: 'Privacy Policy' })).toBeVisible();
  });

  test('external links keep the new-tab icon', async ({ page }) => {
    await page.goto('docs/cli/');
    await page.locator(`${groups} summary`, { hasText: 'Community' }).click();
    for (const name of ['Discord', 'Contributing', 'Releases']) {
      const link = page.locator('#docs-sidebar a', { hasText: name });
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('aria-label', `${name} (opens in new tab)`);
      await expect(link.locator('svg')).toHaveCount(1);
    }
  });

  test('pagination and the current page keep their order', async ({ page }) => {
    await page.goto('docs/cli/');
    await expect(page.locator('.docs-pagination a[rel="prev"] strong')).toHaveText('Security');
    await expect(page.locator('.docs-pagination a[rel="next"] strong')).toHaveText('FAQ');
    await page.goto('pt/docs/mcp/');
    await expect(page.locator('.docs-pagination a[rel="prev"] strong')).toHaveText('egc-guardian');
    await expect(page.locator('.docs-pagination a[rel="next"] strong')).toHaveText('Integrações');
    await expect(page.locator(`${groups}[open] summary`)).toHaveText('Servidores MCP');
  });
});

test.describe('docs sidebar drawer on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('opens on the first group, keeps Tab inside and closes with Escape', async ({ page }) => {
    await page.goto('docs/memory/');
    const toggle = page.locator('#docs-sidebar-toggle');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator(`${groups} summary`).first()).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(page.locator('#docs-sidebar-close')).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(page.locator('#docs-sidebar .docs-nav-top-link').last()).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toBeFocused();
  });

  test('a link in an opened group navigates and closes the drawer', async ({ page }) => {
    await page.goto('docs/memory/');
    await page.locator('#docs-sidebar-toggle').click();
    await page.locator(`${groups} summary`, { hasText: 'Reference' }).click();
    await page.locator('#docs-sidebar a', { hasText: 'FAQ' }).click();
    await expect(page).toHaveURL(/\/EGCSite\/docs\/faq\/$/);
    await expect(page.locator('#docs-sidebar-toggle')).toHaveAttribute('aria-expanded', 'false');
  });
});
