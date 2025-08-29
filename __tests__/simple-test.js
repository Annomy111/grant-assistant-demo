const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting Puppeteer test...');
  const browser = await puppeteer.launch({ 
    headless: false,
    slowMo: 50
  });
  
  const page = await browser.newPage();
  
  // Log console messages
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  console.log('1. Navigating to localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  
  console.log('2. Waiting for page to stabilize...');
  await new Promise(r => setTimeout(r, 3000));
  
  console.log('3. Looking for button...');
  
  // Find all buttons and their text
  const buttons = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.map(btn => ({
      text: btn.textContent?.trim(),
      disabled: btn.disabled,
      onclick: !!btn.onclick
    }));
  });
  
  console.log('4. Found buttons:', buttons);
  
  // Try to click the first button with "Antrag" or "Starten"
  const clicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const targetBtn = btns.find(btn => 
      btn.textContent && (
        btn.textContent.includes('Antrag') || 
        btn.textContent.includes('Starten')
      ) && !btn.disabled
    );
    
    if (targetBtn) {
      console.log('Clicking button:', targetBtn.textContent);
      targetBtn.click();
      return true;
    }
    return false;
  });
  
  console.log('5. Button clicked:', clicked);
  
  await new Promise(r => setTimeout(r, 3000));
  
  // Check if we're on the chat page
  const isOnChat = await page.evaluate(() => {
    const header = document.querySelector('header');
    return header && header.textContent.includes('Grant Assistant');
  });
  
  console.log('6. Is on chat page:', isOnChat);
  
  if (isOnChat) {
    console.log('SUCCESS: Chat interface is showing!');
  } else {
    console.log('FAILED: Still on landing page');
    
    // Take screenshot
    await page.screenshot({ path: 'failed-state.png' });
    console.log('Screenshot saved to failed-state.png');
  }
  
  await new Promise(r => setTimeout(r, 5000));
  await browser.close();
})();