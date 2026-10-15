import { defineConfig, devices } from '@playwright/test';

// End-to-end tests against the static export (npm run build first), served under /EGCSite
// like GitHub Pages. The default time zone is a Portuguese one, so / stays in Portuguese
// unless a test asks for another zone.
const PORT = 4173;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: `http://127.0.0.1:${PORT}/EGCSite/`,
    timezoneId: 'America/Sao_Paulo',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `node scripts/serve-out.mjs ${PORT}`,
    url: `http://127.0.0.1:${PORT}/EGCSite/`,
    reuseExistingServer: !process.env.CI,
  },
});
