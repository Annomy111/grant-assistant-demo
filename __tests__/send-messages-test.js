// Test to ensure all three messages are sent properly

const puppeteer = require('puppeteer');

async function sendMessage(page, text) {
  console.log(`  Sending: "${text}"`);
  
  // Clear textarea first
  await page.evaluate(() => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.value = '';
      textarea.focus();
    }
  });
  
  // Type the message
  await page.type('textarea', text);
  
  // Press enter
  await page.keyboard.press('Enter');
  
  // Wait for response
  await new Promise(r => setTimeout(r, 5000));
  
  // Check if handleSendMessage was called
  const logs = await page.evaluate(() => {
    return window.lastLogs || [];
  });
  
  const wasCalled = logs.some(log => log.includes('=== handleSendMessage called ==='));
  console.log(`  handleSendMessage called: ${wasCalled}`);
  
  return wasCalled;
}

(async () => {
  console.log('Testing message sending...');
  const browser = await puppeteer.launch({ 
    headless: false,
    slowMo: 100
  });
  
  const page = await browser.newPage();
  
  // Inject log capture
  await page.evaluateOnNewDocument(() => {
    window.lastLogs = [];
    const originalLog = console.log;
    console.log = function(...args) {
      window.lastLogs.push(args.join(' '));
      if (window.lastLogs.length > 100) window.lastLogs.shift();
      originalLog.apply(console, args);
    };
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
  
  // Select CERV template
  console.log('\n3. Selecting CERV template...');
  await page.evaluate(() => {
    const templateBtn = document.querySelector('button[class*="flex-1"]');
    if (templateBtn) templateBtn.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  await page.evaluate(() => {
    const templates = Array.from(document.querySelectorAll('div[class*="border rounded-lg p-4 cursor-pointer"]'));
    const cervTemplate = templates.find(el => 
      el.textContent && el.textContent.includes('CERV')
    );
    if (cervTemplate) cervTemplate.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  // Send three messages
  console.log('\n4. Sending messages...');
  
  const message1Sent = await sendMessage(page, 'Tech for Good Foundation');
  const message2Sent = await sendMessage(page, 'Democracy Shield: Protecting Civil Society');
  const message3Sent = await sendMessage(page, 'CERV-2025-CITIZENS-CIV');
  
  // Check final context
  const finalState = await page.evaluate(() => {
    const state = localStorage.getItem('grant-assistant-state');
    if (state) {
      const parsed = JSON.parse(state);
      return {
        org: parsed.projectContext?.organizationName,
        project: parsed.projectContext?.projectTitle,
        call: parsed.projectContext?.call,
        step: parsed.currentStep
      };
    }
    return {};
  });
  
  console.log('\n5. RESULTS:');
  console.log('   Message 1 sent:', message1Sent);
  console.log('   Message 2 sent:', message2Sent);
  console.log('   Message 3 sent:', message3Sent);
  console.log('\n   Final context:');
  console.log('   - Organization:', finalState.org);
  console.log('   - Project:', finalState.project);
  console.log('   - Call:', finalState.call);
  console.log('   - Step:', finalState.step);
  
  if (message1Sent && message2Sent && message3Sent) {
    if (finalState.org && finalState.project && finalState.call) {
      console.log('\n✅ SUCCESS: All messages sent and context captured!');
    } else {
      console.log('\n⚠️ PARTIAL: All messages sent but context incomplete');
    }
  } else {
    console.log('\n❌ FAILED: Not all messages were sent properly');
  }
  
  await new Promise(r => setTimeout(r, 3000));
  await browser.close();
})();