// Direct test to check if workflow advances with all required info

const puppeteer = require('puppeteer');

(async () => {
  console.log('Testing direct workflow progression...');
  const browser = await puppeteer.launch({ 
    headless: true,
    slowMo: 0
  });
  
  const page = await browser.newPage();
  
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
  
  await new Promise(r => setTimeout(r, 1000));
  
  // Directly set the context in localStorage to test if workflow advances
  console.log('3. Setting complete context directly...');
  await page.evaluate(() => {
    const state = localStorage.getItem('grant-assistant-state');
    if (state) {
      const parsed = JSON.parse(state);
      parsed.projectContext = {
        ...parsed.projectContext,
        organizationName: 'Test Organization',
        projectTitle: 'Test Project Title',
        call: 'CERV-2025-TEST',
        callIdentifier: 'CERV-2025-TEST',
        templateId: 'cerv-child-2025'
      };
      localStorage.setItem('grant-assistant-state', JSON.stringify(parsed));
      console.log('Context set:', parsed.projectContext);
    }
  });
  
  // Now send a message to trigger the API check
  console.log('4. Sending test message to trigger workflow check...');
  await page.type('textarea', 'Check workflow now');
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 5000));
  
  // Check if step advanced
  const result = await page.evaluate(() => {
    const state = localStorage.getItem('grant-assistant-state');
    if (state) {
      const parsed = JSON.parse(state);
      return {
        currentStep: parsed.currentStep,
        context: parsed.projectContext,
        lastMessage: parsed.messages?.[parsed.messages.length - 1]?.content?.substring(0, 100)
      };
    }
    return null;
  });
  
  console.log('\n5. Final result:');
  console.log('   Current step:', result?.currentStep);
  console.log('   Has all context:', {
    org: !!result?.context?.organizationName,
    project: !!result?.context?.projectTitle,
    call: !!result?.context?.call
  });
  console.log('   Last message snippet:', result?.lastMessage);
  
  if (result?.currentStep === 'excellence' || result?.lastMessage?.includes('Excellence')) {
    console.log('\n✅ SUCCESS: Workflow can advance when all info is present!');
  } else {
    console.log('\n❌ FAILED: Workflow stuck even with all required info');
  }
  
  await browser.close();
})();