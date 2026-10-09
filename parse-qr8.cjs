const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:8081');

  await page.waitForTimeout(1000);
  await page.fill('textarea', 'Hello World');
  await page.waitForTimeout(2000);

  const downloadPromise = page.waitForEvent('download');
  await page.click('button:has-text("SVG")');
  const download = await downloadPromise;

  const path = await download.path();
  const content = fs.readFileSync(path, 'utf8');
  console.log(content.substring(0, 300));

  await browser.close();
})();
