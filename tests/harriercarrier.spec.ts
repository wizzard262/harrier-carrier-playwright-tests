import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'https://www.harriercarrier.com/';

// Wait until the page has moved to an address that contains the expected one.
// (Waiting for 'networkidle' timed out on busy pages like YouTube and the games.)
async function expectRedirectTo(page: Page, expectedStart: string) {
  // Wait for the browser to start showing the new page (not for it to finish loading), up to 20 seconds
  await page.waitForURL(url => url.href.includes(expectedStart), { waitUntil: 'commit', timeout: 20000 });
  // Check the address we ended up on
  expect(page.url()).toContain(expectedStart);
}

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
    await expectRedirectTo(page, "https://play.google.com/store/apps/details?id=com.harriercarrier.coldwar");
  });

  test('Clicking YouTube button redirects correctly', async ({ page }) => {
    await page.click("a[href*='www.youtube.com']");
    await expectRedirectTo(page, "https://www.youtube.com/watch?v=cYc7CPjA33A&list=PLuCq6bBAV6WcZgNZGCp9w08pJYjjWH9J3");
  });

  test('Clicking Play Now redirects correctly', async ({ page }) => {
    // The game lives on its own GitHub Pages
    await page.click("a[href*='harrier-carrier-cold-war']");
    await expectRedirectTo(page, "https://wizzard262.github.io/harrier-carrier-cold-war/");
  });

  test('Clicking Poster redirects correctly', async ({ page }) => {
    await page.click("a[href*='assets/harrier_carrier_poster.png']");
    await expectRedirectTo(page, "https://www.harriercarrier.com/assets/harrier_carrier_poster.png");
  });

  test('Clicking BattleOfHoth redirects correctly', async ({ page }) => {
    await page.click("a[href*='battle-of-hoth']");
    await expectRedirectTo(page, "https://wizzard262.github.io/battle-of-hoth/");
  });

  // Every game lives on its own GitHub Pages: each banner on the home page links there and the page is up
  const GAMES = ['swooping-simulator', 'future-city-battle', 'railhead', 'beachhead-normandy', 'harrier-carrier-cold-war', 'battle-of-hoth', 'skittle-scramble', 'darwins-finches', 'quake_house'];
  for (const game of GAMES) {
    test(`${game} link points to a live GitHub Pages game`, async ({ page, request }) => {
      const url = `https://wizzard262.github.io/${game}/`;
      await expect(page.locator(`a[href="${url}"]`).first()).toBeAttached();
      const response = await request.get(url);
      expect(response.status()).toBe(200);
    });
  }

});
