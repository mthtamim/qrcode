const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  let clipText = null;
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.goto('http://127.0.0.1:8080');

  await page.waitForTimeout(1000);
  await page.fill('textarea', 'Hello World Copy');
  await page.waitForTimeout(2000);

  // Need to grant clipboard permissions
  const context = browser.contexts()[0];
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);

  await page.click('button:has-text("Copy")');
  await page.waitForTimeout(2000);

  await browser.close();
})();
