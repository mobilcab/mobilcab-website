import { expect, test, type Page } from '@playwright/test';
import { APP_URL, FOUNDING_PARTNER_URL } from '../../src/config';

/**
 * Smoke: marketing site → app Founding Partner waitlist.
 * Proves a visitor can open the FP form from the site CTA and submit a request.
 *
 * Defaults: https://mobilcab.com + https://app.mobilcab.com
 * Override: SITE_URL, APP_URL
 */
const SITE_URL = (process.env.SITE_URL ?? 'https://mobilcab.com').replace(/\/$/, '');
const APP = (process.env.APP_URL ?? APP_URL).replace(/\/$/, '');

const fpModal = (page: Page) => page.locator('app-auth-modal .modal-container');

async function openFpFormFromSite(page: Page) {
  await page.goto(`${SITE_URL}/ro/founding-partner/`, { waitUntil: 'domcontentloaded' });

  const cta = page.locator('a[data-cta="founding_partner"][data-cta-location="fp_hero"]');
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute('href', FOUNDING_PARTNER_URL);

  await Promise.all([
    page.waitForURL((url) => url.origin === APP && url.searchParams.get('founding') === '1'),
    cta.click(),
  ]);

  await fpModal(page).waitFor({ state: 'visible', timeout: 30_000 });
  await expect(page.locator('[data-testid="auth-fp-benefits"]')).toBeVisible({ timeout: 15_000 });
  await expect(page.locator('[data-testid="fp-workshop"]')).toBeVisible();
  await expect(page.locator('[data-testid="fp-cui"]')).toBeVisible();
  await expect(page.locator('[data-testid="fp-submit"]')).toBeVisible();
}

test.describe('website → app Partener Fondator', () => {
  test('RO FP page CTA opens the app waitlist form', async ({ page }) => {
    expect(FOUNDING_PARTNER_URL).toBe(`${APP}/?founding=1`);
    await openFpFormFromSite(page);
  });

  test('from the site CTA, a visitor can submit an FP request in the app', async ({ page }) => {
    await openFpFormFromSite(page);

    const stamp = Date.now().toString(36);
    await page.locator('[data-testid="fp-name"]').fill('Smoke Website FP');
    await page.locator('[data-testid="fp-email"]').fill(`smoke.web.fp.${stamp}@mobilcab.test`);
    // Prod form requires phone + city; workshop/CUI are optional there.
    const phone = page.locator('[data-testid="fp-phone"]');
    if (await phone.count()) await phone.fill('0700000000');
    await page.locator('[data-testid="fp-workshop"]').fill('Atelier Smoke Web');
    const city = page.locator('[data-testid="fp-city"]');
    if (await city.count()) await city.fill('Cluj-Napoca');
    await page.locator('[data-testid="fp-cui"]').fill('RO12345678');
    await page.locator('[data-testid="fp-consent"]').check();
    await page.locator('[data-testid="fp-terms-accepted"]').check();

    const submit = page.locator('[data-testid="fp-submit"]');
    await expect(submit).toBeEnabled({ timeout: 5_000 });
    await submit.click();

    await expect(
      page.locator('[data-testid="auth-fp-waitlist-sent"], [data-testid="fp-waitlist-done"]'),
    ).toBeVisible({ timeout: 25_000 });
  });
});
