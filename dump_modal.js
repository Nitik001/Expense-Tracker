import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    console.log('Navigating...');
    await page.goto('http://localhost:5173/plan', { waitUntil: 'networkidle0' });
    
    // Click the budget plus button
    await page.evaluate(() => {
      const btns = document.querySelectorAll('button');
      for (let btn of btns) {
        if (btn.closest('.section-title') && btn.closest('.section-title').textContent.includes('Budgets')) {
          btn.click();
          break;
        }
      }
    });

    // Wait a bit for modal animation
    await new Promise(r => setTimeout(r, 1000));

    // Get modal HTML
    const html = await page.evaluate(() => {
      const modal = document.querySelector('.modal-content');
      return modal ? modal.outerHTML : 'MODAL NOT FOUND';
    });

    console.log('MODAL HTML:', html);
    await browser.close();
  } catch (err) {
    console.error('Script Error:', err);
    process.exit(1);
  }
})();
