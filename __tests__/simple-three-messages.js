// Very simple test - just send three messages with proper waiting

const puppeteer = require('puppeteer');

(async () => {
  console.log('Simple three message test...');
  const browser = await puppeteer.launch({ 
    headless: false,
    slowMo: 1000  // Very slow to ensure everything processes
  });
  
  const page = await browser.newPage();
  
  console.log('\n1. Navigating...');
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });
  
  console.log('\n2. Starting chat...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const targetBtn = buttons.find(btn => 
      btn.textContent && btn.textContent.includes('Antrag Starten')
    );
    if (targetBtn) targetBtn.click();
  });
  
  await new Promise(r => setTimeout(r, 3000));
  
  console.log('\n3. Message 1: Organization');
  // Type slowly
  await page.type('textarea', 'Tech for Good Foundation', { delay: 100 });
  await new Promise(r => setTimeout(r, 1000));
  await page.keyboard.press('Enter');
  
  // Wait for response
  console.log('   Waiting for response...');
  await new Promise(r => setTimeout(r, 10000));
  
  console.log('\n4. Message 2: Project Title');
  // Clear textarea
  await page.click('textarea', { clickCount: 3 }); // Select all
  await page.keyboard.press('Backspace');
  await new Promise(r => setTimeout(r, 500));
  
  // Type project title
  await page.type('textarea', 'Democracy Shield: Protecting Civil Society', { delay: 100 });
  await new Promise(r => setTimeout(r, 1000));
  await page.keyboard.press('Enter');
  
  // Wait for response
  console.log('   Waiting for response...');
  await new Promise(r => setTimeout(r, 10000));
  
  console.log('\n5. Message 3: Call');
  // Clear textarea
  await page.click('textarea', { clickCount: 3 });
  await page.keyboard.press('Backspace');
  await new Promise(r => setTimeout(r, 500));
  
  // Type call
  await page.type('textarea', 'CERV-2025-CITIZENS-CIV', { delay: 100 });
  await new Promise(r => setTimeout(r, 1000));
  await page.keyboard.press('Enter');
  
  // Wait for response
  console.log('   Waiting for response...');
  await new Promise(r => setTimeout(r, 10000));
  
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
  
  console.log('\n6. RESULT:');
  console.log('   Organization:', finalState.org);
  console.log('   Project:', finalState.project);  
  console.log('   Call:', finalState.call);
  console.log('   Step:', finalState.step);
  
  if (finalState.org && finalState.project && finalState.call) {
    console.log('\n✅ SUCCESS: All fields captured!');
    if (finalState.step === 'excellence') {
      console.log('   AND workflow advanced!');
    }
  } else {
    console.log('\n❌ FAILED');
  }
  
  await new Promise(r => setTimeout(r, 5000));
  await browser.close();
})();