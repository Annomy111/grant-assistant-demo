// Full flow test with detailed message tracking

const puppeteer = require('puppeteer');

(async () => {
  console.log('Testing full conversation flow...');
  const browser = await puppeteer.launch({ 
    headless: false,
    slowMo: 500
  });
  
  const page = await browser.newPage();
  
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
  
  console.log('\n3. Getting initial assistant message...');
  const initialMsg = await page.evaluate(() => {
    const messages = document.querySelectorAll('[class*="prose"]');
    if (messages.length > 0) {
      return messages[0].textContent;
    }
    return 'No initial message';
  });
  console.log('Initial assistant says:', initialMsg.substring(0, 200));
  
  console.log('\n4. Sending organization name...');
  await page.type('textarea', 'Tech for Good Foundation');
  await page.keyboard.press('Enter');
  
  // Wait for response
  await page.waitForFunction(() => {
    const spinner = document.querySelector('[class*="animate-spin"]');
    return !spinner;
  }, { timeout: 10000 });
  
  const response1 = await page.evaluate(() => {
    const messages = document.querySelectorAll('[class*="prose"]');
    if (messages.length >= 2) {
      return messages[messages.length - 1].textContent;
    }
    return 'No response';
  });
  console.log('Assistant response:', response1.substring(0, 300));
  
  console.log('\n5. Sending project title...');
  await page.evaluate(() => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.value = '';
      textarea.focus();
    }
  });
  await page.type('textarea', 'Democracy Shield: Protecting Civil Society');
  await page.keyboard.press('Enter');
  
  // Wait for response
  await page.waitForFunction(() => {
    const spinner = document.querySelector('[class*="animate-spin"]');
    return !spinner;
  }, { timeout: 10000 });
  
  const response2 = await page.evaluate(() => {
    const messages = document.querySelectorAll('[class*="prose"]');
    if (messages.length >= 4) {
      return messages[messages.length - 1].textContent;
    }
    return 'No response';
  });
  console.log('Assistant response:', response2.substring(0, 300));
  
  // Check context at this point
  const contextAfter2 = await page.evaluate(() => {
    const state = localStorage.getItem('grant-assistant-state');
    if (state) {
      const parsed = JSON.parse(state);
      return parsed.projectContext;
    }
    return {};
  });
  console.log('Context after project title:', contextAfter2);
  
  console.log('\n6. Sending call identifier...');
  await page.evaluate(() => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.value = '';
      textarea.focus();
    }
  });
  await page.type('textarea', 'CERV-2025-CITIZENS-CIV');
  await page.keyboard.press('Enter');
  
  // Wait for response
  await page.waitForFunction(() => {
    const spinner = document.querySelector('[class*="animate-spin"]');
    return !spinner;
  }, { timeout: 10000 });
  
  const response3 = await page.evaluate(() => {
    const messages = document.querySelectorAll('[class*="prose"]');
    if (messages.length >= 6) {
      return messages[messages.length - 1].textContent;
    }
    return 'No response';
  });
  console.log('Assistant response:', response3.substring(0, 300));
  
  // Final context check
  const finalContext = await page.evaluate(() => {
    const state = localStorage.getItem('grant-assistant-state');
    if (state) {
      const parsed = JSON.parse(state);
      return parsed.projectContext;
    }
    return {};
  });
  
  console.log('\n7. FINAL CONTEXT:', finalContext);
  
  if (finalContext.organizationName && finalContext.projectTitle && finalContext.call) {
    console.log('\n✅ SUCCESS: All context captured!');
  } else {
    console.log('\n❌ FAILED: Missing context fields');
  }
  
  await new Promise(r => setTimeout(r, 5000));
  await browser.close();
})();