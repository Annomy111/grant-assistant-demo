const puppeteer = require('puppeteer');

(async () => {
  console.log('Testing memory and context persistence...');
  const browser = await puppeteer.launch({ 
    headless: false,
    slowMo: 50
  });
  
  const page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('context') || 
        text.includes('State saved') ||
        text.includes('Restoring saved state')) {
      console.log('PAGE LOG:', text);
    }
  });
  
  console.log('1. Navigating to localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  
  console.log('2. Clicking "Antrag Starten"...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const targetBtn = buttons.find(btn => 
      btn.textContent && btn.textContent.includes('Antrag Starten')
    );
    if (targetBtn) targetBtn.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  // Check localStorage before refresh
  const stateBefore = await page.evaluate(() => {
    const state = localStorage.getItem('grant-assistant-state');
    if (state) {
      const parsed = JSON.parse(state);
      return {
        hasMessages: parsed.messages?.length > 0,
        hasContext: !!parsed.projectContext,
        messageCount: parsed.messages?.length
      };
    }
    return null;
  });
  
  console.log('3. State before refresh:', stateBefore);
  
  // Send a message
  console.log('4. Sending test message...');
  await page.type('textarea', 'Test Organization Name');
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 3000));
  
  // Check localStorage after message
  const stateAfter = await page.evaluate(() => {
    const state = localStorage.getItem('grant-assistant-state');
    if (state) {
      const parsed = JSON.parse(state);
      return {
        hasMessages: parsed.messages?.length > 0,
        hasContext: Object.keys(parsed.projectContext || {}).length > 0,
        messageCount: parsed.messages?.length,
        context: parsed.projectContext
      };
    }
    return null;
  });
  
  console.log('5. State after message:', stateAfter);
  
  // Refresh page
  console.log('6. Refreshing page...');
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  
  // Check if state was restored
  const stateRestored = await page.evaluate(() => {
    const messages = document.querySelectorAll('[class*="message"]');
    const state = localStorage.getItem('grant-assistant-state');
    if (state) {
      const parsed = JSON.parse(state);
      return {
        visibleMessages: messages.length,
        storedMessageCount: parsed.messages?.length,
        context: parsed.projectContext
      };
    }
    return { visibleMessages: messages.length };
  });
  
  console.log('7. State after refresh:', stateRestored);
  
  if (stateRestored.storedMessageCount > 1) {
    console.log('✅ SUCCESS: State persisted and restored!');
  } else {
    console.log('❌ FAILED: State not properly persisted');
  }
  
  // Test reset button
  console.log('8. Testing reset button...');
  const resetButton = await page.$('button:has-text("Neu")');
  if (resetButton) {
    await page.evaluate(() => {
      // Override confirm to automatically accept
      window.confirm = () => true;
    });
    await resetButton.click();
    await new Promise(r => setTimeout(r, 1000));
    
    const stateAfterReset = await page.evaluate(() => {
      const state = localStorage.getItem('grant-assistant-state');
      return state ? JSON.parse(state) : null;
    });
    
    console.log('9. State after reset:', stateAfterReset?.messages?.length || 0, 'messages');
  }
  
  await new Promise(r => setTimeout(r, 3000));
  await browser.close();
})();