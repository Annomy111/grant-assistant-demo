// Trace test to debug message processing and context detection

const puppeteer = require('puppeteer');

(async () => {
  console.log('Testing workflow progression with detailed tracing...');
  const browser = await puppeteer.launch({ 
    headless: false,
    slowMo: 200
  });
  
  const page = await browser.newPage();
  
  // Capture ALL console logs
  const logs = [];
  page.on('console', msg => {
    const text = msg.text();
    logs.push(text);
    
    // Show important logs immediately
    if (text.includes('=== ') || 
        text.includes('Set ') ||
        text.includes('Updated ') ||
        text.includes('Moving to')) {
      console.log('PAGE:', text);
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
  
  // Select CERV template
  console.log('\n3. Selecting CERV template...');
  await page.evaluate(() => {
    const templateBtn = document.querySelector('button[class*="flex-1"]');
    if (templateBtn) templateBtn.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  // Click on CERV template
  await page.evaluate(() => {
    const templates = Array.from(document.querySelectorAll('div[class*="border rounded-lg p-4 cursor-pointer"]'));
    const cervTemplate = templates.find(el => 
      el.textContent && el.textContent.includes('CERV')
    );
    if (cervTemplate) {
      console.log('Found CERV template, clicking...');
      cervTemplate.click();
    }
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  // Clear logs before starting the actual test
  logs.length = 0;
  
  // Send first message: Organization
  console.log('\n4. Sending FIRST message (Organization)...');
  await page.type('textarea', 'Tech for Good Foundation');
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 4000));
  
  // Check what was captured
  const context1 = await page.evaluate(() => {
    const state = localStorage.getItem('grant-assistant-state');
    if (state) {
      const parsed = JSON.parse(state);
      return {
        org: parsed.projectContext?.organizationName,
        project: parsed.projectContext?.projectTitle,
        call: parsed.projectContext?.call
      };
    }
    return {};
  });
  console.log('After 1st message - Context:', context1);
  
  // Clear textarea and send second message: Project Title
  console.log('\n5. Sending SECOND message (Project Title)...');
  await page.evaluate(() => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.value = '';
      textarea.focus();
    }
  });
  
  await page.type('textarea', 'Democracy Shield: Protecting Civil Society');
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 4000));
  
  // Check what was captured
  const context2 = await page.evaluate(() => {
    const state = localStorage.getItem('grant-assistant-state');
    if (state) {
      const parsed = JSON.parse(state);
      return {
        org: parsed.projectContext?.organizationName,
        project: parsed.projectContext?.projectTitle,
        call: parsed.projectContext?.call
      };
    }
    return {};
  });
  console.log('After 2nd message - Context:', context2);
  
  // Clear textarea and send third message: Call
  console.log('\n6. Sending THIRD message (Call)...');
  await page.evaluate(() => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.value = '';
      textarea.focus();
    }
  });
  
  await page.type('textarea', 'CERV-2025-CITIZENS-CIV');
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 4000));
  
  // Check final state
  const finalState = await page.evaluate(() => {
    const state = localStorage.getItem('grant-assistant-state');
    if (state) {
      const parsed = JSON.parse(state);
      return {
        context: {
          org: parsed.projectContext?.organizationName,
          project: parsed.projectContext?.projectTitle,
          call: parsed.projectContext?.call
        },
        currentStep: parsed.currentStep,
        messageCount: parsed.messages?.length
      };
    }
    return {};
  });
  
  console.log('\n7. FINAL STATE:');
  console.log('   Context:', finalState.context);
  console.log('   Current Step:', finalState.currentStep);
  console.log('   Message Count:', finalState.messageCount);
  
  // Print relevant logs
  console.log('\n8. RELEVANT LOGS FROM PAGE:');
  const relevantLogs = logs.filter(log => 
    log.includes('=== ') || 
    log.includes('Set ') ||
    log.includes('Updated ') ||
    log.includes('Moving to') ||
    log.includes('Checking for next step')
  );
  relevantLogs.forEach(log => console.log('  ', log));
  
  // Check success
  if (finalState.context.org && finalState.context.project && finalState.context.call) {
    if (finalState.currentStep === 'excellence') {
      console.log('\n✅ SUCCESS: All fields captured AND workflow advanced!');
    } else {
      console.log('\n⚠️ PARTIAL: All fields captured but workflow NOT advanced');
      console.log('   Expected step: excellence, Got:', finalState.currentStep);
    }
  } else {
    console.log('\n❌ FAILED: Not all fields captured');
    console.log('   Missing:', {
      org: !finalState.context.org,
      project: !finalState.context.project,
      call: !finalState.context.call
    });
  }
  
  await new Promise(r => setTimeout(r, 3000));
  await browser.close();
})();