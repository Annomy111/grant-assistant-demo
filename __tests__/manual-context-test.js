// Manual test - directly set context and trigger workflow check

const puppeteer = require('puppeteer');

(async () => {
  console.log('Testing manual context setting...');
  const browser = await puppeteer.launch({ 
    headless: false,
    slowMo: 100
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
  
  console.log('\n3. Manually setting complete context via React devtools simulation...');
  
  // Directly manipulate the context through localStorage and trigger an update
  await page.evaluate(() => {
    // Get current state
    const state = localStorage.getItem('grant-assistant-state');
    if (state) {
      const parsed = JSON.parse(state);
      
      // Set all required fields
      parsed.projectContext = {
        organizationName: 'Tech for Good Foundation',
        projectTitle: 'Democracy Shield: Protecting Civil Society',
        call: 'CERV-2025-CITIZENS-CIV',
        callIdentifier: 'CERV-2025-CITIZENS-CIV'
      };
      
      // Save back
      localStorage.setItem('grant-assistant-state', JSON.stringify(parsed));
      
      console.log('Context manually set:', parsed.projectContext);
    }
  });
  
  // Navigate back to start the chat with the pre-set context
  console.log('\n4. Navigating to apply context...');
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });
  
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const targetBtn = buttons.find(btn => 
      btn.textContent && btn.textContent.includes('Antrag Starten')
    );
    if (targetBtn) targetBtn.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  console.log('\n5. Sending a test message to trigger workflow check...');
  await page.type('textarea', 'Please continue');
  await page.keyboard.press('Enter');
  
  await new Promise(r => setTimeout(r, 8000));
  
  // Check final state
  const finalState = await page.evaluate(() => {
    const state = localStorage.getItem('grant-assistant-state');
    if (state) {
      const parsed = JSON.parse(state);
      return {
        context: parsed.projectContext,
        step: parsed.currentStep,
        lastMessage: parsed.messages?.[parsed.messages.length - 1]?.content?.substring(0, 200)
      };
    }
    return {};
  });
  
  console.log('\n6. FINAL STATE:');
  console.log('   Context:', finalState.context);
  console.log('   Current step:', finalState.step);
  console.log('   Last message snippet:', finalState.lastMessage);
  
  if (finalState.step === 'excellence') {
    console.log('\n✅ SUCCESS: Workflow advanced to Excellence!');
  } else if (finalState.lastMessage?.includes('Excellence')) {
    console.log('\n✅ PARTIAL SUCCESS: Assistant mentions Excellence section!');
  } else {
    console.log('\n❌ FAILED: Workflow did not advance');
  }
  
  await new Promise(r => setTimeout(r, 5000));
  await browser.close();
})();