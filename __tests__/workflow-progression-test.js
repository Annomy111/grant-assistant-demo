const puppeteer = require('puppeteer');

(async () => {
  console.log('Testing workflow progression with CERV template...');
  const browser = await puppeteer.launch({ 
    headless: false,
    slowMo: 100
  });
  
  const page = await browser.newPage();
  
  // Enable detailed console logging
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('context') || 
        text.includes('step') ||
        text.includes('Checking') ||
        text.includes('Moving') ||
        text.includes('Has org') ||
        text.includes('Has project') ||
        text.includes('Has call')) {
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
  
  // Select CERV template
  console.log('3. Selecting CERV template...');
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
  
  await new Promise(r => setTimeout(r, 1000));
  
  // Get current step
  const getStep = async () => {
    return await page.evaluate(() => {
      const steps = document.querySelectorAll('.w-10.h-10.rounded-full');
      for (let i = 0; i < steps.length; i++) {
        const style = window.getComputedStyle(steps[i]);
        if (style.backgroundColor === 'rgb(48, 73, 69)') {
          const stepTitles = ['Grundlagen', 'Excellence', 'Impact', 'Implementation', 'Überprüfung'];
          return { step: stepTitles[i] || 'Unknown', index: i };
        }
      }
      return { step: 'Unknown', index: -1 };
    });
  };
  
  const initialStep = await getStep();
  console.log('4. Initial step:', initialStep);
  
  // Send organization name
  console.log('5. Sending organization name...');
  await page.type('textarea', 'Tech for Good Foundation');
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 4000));
  
  // Check context
  const context1 = await page.evaluate(() => {
    const state = localStorage.getItem('grant-assistant-state');
    if (state) {
      const parsed = JSON.parse(state);
      return parsed.projectContext;
    }
    return {};
  });
  console.log('Context after org:', context1);
  
  // Send project title - wait for AI response first
  console.log('6. Waiting for AI response, then sending project title...');
  await new Promise(r => setTimeout(r, 2000)); // Wait for AI to respond
  
  // Clear and type project title
  const projectSent = await page.evaluate(async () => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      // Clear the textarea
      textarea.value = '';
      textarea.focus();
      
      // Simulate typing the project title
      const event = new Event('input', { bubbles: true });
      textarea.value = 'Democracy Shield: Protecting Civil Society';
      textarea.dispatchEvent(event);
      
      // Find and click send button or press Enter
      const sendBtn = document.querySelector('button[type="submit"]');
      if (sendBtn) {
        sendBtn.click();
        return true;
      }
    }
    return false;
  });
  
  if (!projectSent) {
    console.log('   Falling back to keyboard entry...');
    await page.type('textarea', 'Democracy Shield: Protecting Civil Society');
    await page.keyboard.press('Enter');
  }
  
  console.log('   Sent project title, waiting for response...');
  await new Promise(r => setTimeout(r, 4000));
  
  // Check context
  const context2 = await page.evaluate(() => {
    const state = localStorage.getItem('grant-assistant-state');
    if (state) {
      const parsed = JSON.parse(state);
      return parsed.projectContext;
    }
    return {};
  });
  console.log('Context after project:', context2);
  
  // Send call identifier
  console.log('7. Sending CERV call...');
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
  
  // Check final context
  const context3 = await page.evaluate(() => {
    const state = localStorage.getItem('grant-assistant-state');
    if (state) {
      const parsed = JSON.parse(state);
      return parsed.projectContext;
    }
    return {};
  });
  console.log('Context after call:', context3);
  
  // Check if step changed
  const finalStep = await getStep();
  console.log('8. Step after providing all info:', finalStep);
  
  // Get the last assistant message
  const lastMessage = await page.evaluate(() => {
    const messages = document.querySelectorAll('[class*="prose"]');
    if (messages.length > 0) {
      return messages[messages.length - 1].textContent;
    }
    return 'No messages found';
  });
  
  console.log('\n9. Last AI message snippet:', lastMessage.substring(0, 200));
  
  // Check what the API thinks
  const apiCheck = await page.evaluate(() => {
    const state = localStorage.getItem('grant-assistant-state');
    if (state) {
      const parsed = JSON.parse(state);
      return {
        hasOrg: !!parsed.projectContext?.organizationName,
        hasProject: !!parsed.projectContext?.projectTitle,
        hasCall: !!parsed.projectContext?.call,
        currentStep: parsed.currentStep,
        templateId: parsed.projectContext?.templateId,
        fullContext: parsed.projectContext
      };
    }
    return null;
  });
  
  console.log('\n10. Final check:', apiCheck);
  
  if (finalStep.step === 'Excellence' || lastMessage.includes('Excellence')) {
    console.log('\n✅ SUCCESS: Workflow progressed to Excellence!');
  } else {
    console.log('\n❌ FAILED: Still stuck at:', finalStep.step);
    console.log('Context has all required fields:', {
      org: !!apiCheck?.hasOrg,
      project: !!apiCheck?.hasProject,
      call: !!apiCheck?.hasCall
    });
  }
  
  await new Promise(r => setTimeout(r, 5000));
  await browser.close();
})();