import { test, expect, Page } from '@playwright/test';

// The live game, unless GAME_URL points at a local copy (python -m http.server 8765 in harrier-carrier-cold-war)
const GAME_URL = process.env.GAME_URL ?? 'https://wizzard262.github.io/harrier-carrier-cold-war/';

// Load the game and wait until its scene is built and the canvas has its final size
async function openGame(page: Page) {
  // The game only draws with WebGL; Firefox on the GitHub Actions machine (no graphics card) can't make it, so skip there
  const canDrawWebGL = await browserHasWebGL(page);
  test.skip(!canDrawWebGL, 'This browser cannot make a WebGL context (no graphics card), and the game needs one');
  await page.goto(GAME_URL);
  await page.waitForFunction(() => {
    const game = (window as any).game;
    return !!(game && game.state && game.state.created); // the game sets its scaling when its scene is built
  }, undefined, { timeout: 20000 });
  await page.waitForTimeout(1500);
}

// Ask the browser whether it can make a WebGL drawing surface
async function browserHasWebGL(page: Page) {
  return page.evaluate(() => {
    // Make a spare canvas and try to get WebGL from it
    const canvas = document.createElement('canvas');
    const webgl = canvas.getContext('webgl') ?? canvas.getContext('experimental-webgl');
    // Yes only if a context came back
    return webgl !== null;
  });
}

// Where the canvas is on screen, where Phaser thinks it is, and the page colour around it
async function readLayout(page: Page) {
  return page.evaluate(() => {
    const game = (window as any).game;
    const canvasBox = game.canvas.getBoundingClientRect();
    const bodyColour = getComputedStyle(document.body).backgroundColor;
    return {
      top: canvasBox.top,
      bottom: canvasBox.bottom,
      width: canvasBox.width,
      phaserTop: game.scale.offset.y,
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      pageScrolls: document.documentElement.scrollHeight > window.innerHeight,
      bodyColour,
    };
  });
}

test.describe('Harrier Carrier game on a tall phone', () => {

  test.use({ viewport: { width: 412, height: 915 } }); // Galaxy A51 shape

  test('Game at the bottom, sky above, no black', async ({ page }) => {
    await openGame(page);

    const layout = await readLayout(page);

    // The game fills the width and sits on the bottom edge
    expect(layout.width).toBe(layout.windowWidth);
    expect(Math.round(layout.bottom)).toBe(layout.windowHeight);
    expect(layout.top).toBeGreaterThan(0);

    // Above it is sky, not black
    expect(layout.bodyColour).toBe('rgb(184, 231, 255)');

    // Taps land in the right place only if Phaser knows the canvas moved down
    expect(Math.round(layout.phaserTop)).toBe(Math.round(layout.top));

    expect(layout.pageScrolls).toBe(false);
  });

});

test.describe('Harrier Carrier game on a desktop screen', () => {

  test.use({ viewport: { width: 1280, height: 800 } });

  test('The game stays at the top on black, as before', async ({ page }) => {
    await openGame(page);

    const layout = await readLayout(page);

    expect(layout.top).toBe(0);
    expect(layout.bodyColour).toBe('rgb(0, 0, 0)');
  });

});
