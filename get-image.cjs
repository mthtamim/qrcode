const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:8081');

  await page.waitForTimeout(1000);
  await page.fill('textarea', 'Hello World');
  await page.waitForTimeout(2000);
  await page.click('button:has-text("Scan Me Frame")');
  await page.waitForTimeout(1000);

  const downloadPromise = page.waitForEvent('download');
  await page.click('button:has-text("Download PNG")');
  const download = await downloadPromise;

  const path = await download.path();
  fs.copyFileSync(path, 'test-frame-download.png');
  console.log("downloaded PNG");

  await browser.close();
})();
