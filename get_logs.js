import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    page.on('console', msg => {
      console.log('CONSOLE:', msg.type(), msg.text());
    });
    
    page.on('pageerror', error => {
      console.log('PAGE ERROR:', error.message);
    });

    console.log('Navigating to https://nitiktracker.vercel.app...');
    await page.goto('https://nitiktracker.vercel.app', { waitUntil: 'networkidle0', timeout: 10000 });
    
    console.log('Done.');
    await browser.close();
  } catch (err) {
    console.error('Script Error:', err);
    process.exit(1);
  }
})();
