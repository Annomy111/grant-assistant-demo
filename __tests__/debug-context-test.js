// Debug test to see exactly what's happening with context detection

const puppeteer = require('puppeteer');

(async () => {
  console.log('Debug test for context detection...');
  const browser = await puppeteer.launch({ 
    headless: false,
    slowMo: 300
  });
  
  const page = await browser.newPage();
  
  // Capture console logs
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('Checking conditions:') || 
        text.includes('Has org?') ||
        text.includes('Has project?') ||
        text.includes('Assistant asking') ||
        text.includes('Set ') ||
        text.includes('Last assistant message snippet:')) {
      console.log('DEBUG:', text);
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
  
  // Don't select template, just test basic flow
  console.log('\n3. Testing basic introduction flow...');
  
  // Send organization
  console.log('\n=== MESSAGE 1: Organization ===');
  await page.type('textarea', 'Tech for Good Foundation');
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 5000));
  
  // Get assistant response
  const response1 = await page.evaluate(() => {
    const messages = document.querySelectorAll('[class*="prose"]');
    if (messages.length >= 2) {
      return messages[messages.length - 1].textContent;
    }
    return 'No response';
  });
  console.log('Assistant response snippet:', response1.substring(0, 150));
  
  // Send project title
  console.log('\n=== MESSAGE 2: Project Title ===');
  await page.evaluate(() => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.value = '';
      textarea.focus();
    }
  });
  await page.type('textarea', 'Democracy Shield: Protecting Civil Society');
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 5000));
  
  // Get assistant response
  const response2 = await page.evaluate(() => {
    const messages = document.querySelectorAll('[class*="prose"]');
    if (messages.length >= 4) {
      return messages[messages.length - 1].textContent;
    }
    return 'No response';
  });
  console.log('Assistant response snippet:', response2.substring(0, 150));
  
  // Send call
  console.log('\n=== MESSAGE 3: Call ===');
  await page.evaluate(() => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.value = '';
      textarea.focus();
    }
  });
  await page.type('textarea', 'CERV-2025-CITIZENS-CIV');
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 5000));
  
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
  
  console.log('\n=== FINAL STATE ===');
  console.log('Organization:', finalState.org);
  console.log('Project:', finalState.project);
  console.log('Call:', finalState.call);
  console.log('Step:', finalState.step);
  
  if (finalState.org && finalState.project && finalState.call) {
    console.log('\n✅ SUCCESS: All context captured!');
  } else {
    console.log('\n❌ FAILED: Context incomplete');
  }
  
  await new Promise(r => setTimeout(r, 5000));
  await browser.close();
})();