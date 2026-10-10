const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err));
  await page.goto('http://127.0.0.1:8081');

  await page.waitForTimeout(1000);
  await page.fill('textarea', 'Hello World');
  await page.waitForTimeout(2000);

  await page.click('button:has-text("Twitter")');
  await page.waitForTimeout(1000);

  const downloadPromise = page.waitForEvent('download');
  await page.click('button:has-text("Download PNG")');
  const download = await downloadPromise;

  const path = await download.path();
  fs.copyFileSync(path, '/app/test-twitter-logo-download.png');
  console.log("PNG downloaded to", path);

  await browser.close();
})();
