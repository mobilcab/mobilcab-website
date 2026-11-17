import { defineConfig, devices } from '@playwright/test';

/**
 * Live smoke only (`tests/smoke`). Defaults hit production marketing + app.
 * Override with SITE_URL / APP_URL (e.g. web-develop + staging app).
 */
export default defineConfig({
  testDir: './tests/smoke',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 90_000,
  reporter: process.env.CI ? 'list' : [['list'], ['html', { open: 'never' }]],
  use: {
    ...devices['Desktop Chrome'],
    // Desktop viewport so MobileHandoffModal does not intercept app CTAs.
    viewport: { width: 1280, height: 800 },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { channel: undefined } }],
});
