const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err));
  await page.goto('http://127.0.0.1:8081');

  await page.waitForTimeout(1000);
  await page.fill('textarea', 'Hello World');
  await page.waitForTimeout(2000);

  // click Download PDF
  const downloadPromise = page.waitForEvent('download');
  await page.click('button:has-text("PDF")');
  const download = await downloadPromise;
  console.log("PDF downloaded to", await download.path());

  await browser.close();
})();
