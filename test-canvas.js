const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err));
  await page.goto('http://127.0.0.1:8080');

  await page.fill('textarea[placeholder="https://example.com"]', 'Hello World');
  await page.waitForTimeout(1000); // wait for debounce

  // click Download PNG
  await page.click('button:has-text("Download PNG")');
  await page.waitForTimeout(1000);

  await browser.close();
})();
