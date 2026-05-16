import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.harriercarrier.com/';

test.describe('Harrier Carrier Homepage', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('Harrier Carrier logo loads correctly', async ({ page }) => {
    const img = page.locator("img[src*='assets/logo.png']");
    await expect(img).toBeVisible();

    // Ensure the browser actually loaded the image
    const naturalWidth = await img.evaluate(e => (e as HTMLImageElement).naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);
  });

  test('Clicking Google Play button redirects correctly', async ({ page }) => {
    await page.click("a[href*='play.google.com']");
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain("https://play.google.com/store/apps/details?id=garmadon.harriercarriercoldwar");
  });

  test('Clicking YouTube button redirects correctly', async ({ page }) => {
    await page.click("a[href*='www.youtube.com']");
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain("https://www.youtube.com/watch?v=cYc7CPjA33A&list=PLuCq6bBAV6WcZgNZGCp9w08pJYjjWH9J3");
  });

  test('Clicking Play Now redirects correctly', async ({ page }) => {
    await page.click("a[href*='game/index.htm']");
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain("https://www.harriercarrier.com/game/index.htm");
  });

  test('Clicking Poster redirects correctly', async ({ page }) => {
    await page.click("a[href*='assets/harrier_carrier_poster.png']");
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain("https://www.harriercarrier.com/assets/harrier_carrier_poster.png");
  });

  test('Clicking BattleOfHoth redirects correctly', async ({ page }) => {
    await page.click("a[href*='battleofhoth/index.html']");
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain("https://www.harriercarrier.com/battleofhoth/index.html");
  });

});
