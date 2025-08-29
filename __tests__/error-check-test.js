// Test to check for errors during message sending

const puppeteer = require('puppeteer');

(async () => {
  console.log('Testing for errors...');
  const browser = await puppeteer.launch({ 
    headless: false,
    slowMo: 100
  });
  
  const page = await browser.newPage();
  
  // Capture errors
  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error);
  });
  
  page.on('requestfailed', request => {
    console.log('REQUEST FAILED:', request.url());
  });
  
  page.on('response', response => {
    if (!response.ok() && response.url().includes('/api/')) {
      console.log('API ERROR:', response.status(), response.url());
    }
  });
  
  // Capture console logs
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    }
    if (msg.text().includes('Error') || msg.text().includes('error')) {
      console.log('ERROR LOG:', msg.text());
    }
  });
  
  console.log('\n1. Navigating to localhost:3001...');
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });
  
  console.log('\n2. Clicking "Antrag Starten"...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const targetBtn = buttons.find(btn => 
      btn.textContent && btn.textContent.includes('Antrag Starten')
    );
    if (targetBtn) targetBtn.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  console.log('\n3. Sending messages...');
  
  // Send organization
  console.log('   Sending org...');
  await page.type('textarea', 'Tech for Good Foundation');
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 5000));
  
  // Check for loading state
  const isLoading1 = await page.evaluate(() => {
    return !!document.querySelector('[class*="animate-spin"]');
  });
  console.log('   Still loading after org:', isLoading1);
  
  // Send project title
  console.log('   Sending project...');
  await page.evaluate(() => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.value = '';
      textarea.focus();
    }
  });
  await page.type('textarea', 'Democracy Shield');
  await page.keyboard.press('Enter');
  
  // Check for loading immediately
  const loadingStates = [];
  for (let i = 0; i < 10; i++) {
    await new Promise(r => setTimeout(r, 500));
    const isLoading = await page.evaluate(() => {
      return !!document.querySelector('[class*="animate-spin"]');
    });
    loadingStates.push(isLoading);
    if (!isLoading && i > 2) break;
  }
  console.log('   Loading states after project:', loadingStates);
  
  // Check messages count
  const messageCount = await page.evaluate(() => {
    return document.querySelectorAll('[class*="prose"]').length;
  });
  console.log('   Total messages visible:', messageCount);
  
  // Check if error message appeared
  const hasError = await page.evaluate(() => {
    const messages = Array.from(document.querySelectorAll('[class*="prose"]'));
    return messages.some(m => m.textContent.includes('Fehler') || m.textContent.includes('error'));
  });
  console.log('   Error message found:', hasError);
  
  // Send call
  console.log('   Sending call...');
  await page.evaluate(() => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.value = '';
      textarea.focus();
    }
  });
  await page.type('textarea', 'CERV-2025-TEST');
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 5000));
  
  // Final check
  const finalState = await page.evaluate(() => {
    const state = localStorage.getItem('grant-assistant-state');
    if (state) {
      const parsed = JSON.parse(state);
      return {
        messages: parsed.messages?.length,
        org: !!parsed.projectContext?.organizationName,
        project: !!parsed.projectContext?.projectTitle,
        call: !!parsed.projectContext?.call
      };
    }
    return {};
  });
  
  console.log('\n4. Final state:', finalState);
  
  await new Promise(r => setTimeout(r, 3000));
  await browser.close();
})();