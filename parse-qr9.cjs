const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:8081');

  await page.waitForTimeout(1000);
  await page.fill('textarea', 'Hello World');
  await page.waitForTimeout(2000);

  // select twitter logo
  await page.click('button:has-text("Twitter")');
  await page.waitForTimeout(1000);

  const downloadPromise = page.waitForEvent('download');
  await page.click('button:has-text("SVG")');
  const download = await downloadPromise;

  const path = await download.path();
  const content = fs.readFileSync(path, 'utf8');
  console.log(content.indexOf('data:image/svg+xml;base64,'));

  await browser.close();
})();
