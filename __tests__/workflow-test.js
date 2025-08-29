const puppeteer = require('puppeteer');

(async () => {
  console.log('Testing workflow progression...');
  const browser = await puppeteer.launch({ 
    headless: false,
    slowMo: 100
  });
  
  const page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    if (msg.text().includes('context') || 
        msg.text().includes('step') || 
        msg.text().includes('Extracted')) {
      console.log('PAGE LOG:', msg.text());
    }
  });
  
  console.log('1. Navigating to localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  
  console.log('2. Waiting for page to load...');
  await new Promise(r => setTimeout(r, 2000));
  
  console.log('3. Clicking "Antrag Starten" button...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const targetBtn = buttons.find(btn => 
      btn.textContent && btn.textContent.includes('Antrag Starten')
    );
    if (targetBtn) targetBtn.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  // Check if we're in chat interface
  const isInChat = await page.evaluate(() => {
    const header = document.querySelector('header');
    return header && header.textContent.includes('Grant Assistant');
  });
  
  if (!isInChat) {
    console.log('ERROR: Not in chat interface');
    await browser.close();
    return;
  }
  
  console.log('4. In chat interface. Testing workflow progression...');
  
  // Get current step
  const getStep = async () => {
    return await page.evaluate(() => {
      const steps = document.querySelectorAll('.w-10.h-10.rounded-full');
      for (let i = 0; i < steps.length; i++) {
        const style = window.getComputedStyle(steps[i]);
        if (style.backgroundColor === 'rgb(48, 73, 69)') {
          const stepTitles = ['Grundlagen', 'Excellence', 'Impact', 'Implementation', 'Überprüfung'];
          return stepTitles[i] || 'Unknown';
        }
      }
      return 'Unknown';
    });
  };
  
  const initialStep = await getStep();
  console.log('Initial step:', initialStep);
  
  // Find the input and send button
  const inputSelector = 'textarea';
  
  // Function to send a message
  const sendMessage = async (text) => {
    console.log(`Sending: "${text}"`);
    
    // Find and clear the textarea first
    await page.evaluate(() => {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.value = '';
        textarea.focus();
      }
    });
    
    // Type the message
    await page.type(inputSelector, text);
    await new Promise(r => setTimeout(r, 500));
    
    // Press Enter to send (or click send button)
    await page.keyboard.press('Enter');
    
    // Wait for response
    await new Promise(r => setTimeout(r, 4000));
  };
  
  // Send organization name
  await sendMessage('Open Society Foundations');
  
  // Send project title
  await sendMessage('RESIST-OCC: Resilient Communities Against Occupation');
  
  // Send call identifier
  await sendMessage('HORIZON-CL2-2025-DEMOCRACY-01');
  
  // Check if step changed
  const newStep = await getStep();
  console.log('Step after providing info:', newStep);
  
  if (newStep === 'Excellence') {
    console.log('✅ SUCCESS: Workflow progressed to Excellence!');
  } else {
    console.log('❌ FAILED: Still on step:', newStep);
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'workflow-stuck.png', fullPage: true });
    console.log('Screenshot saved to workflow-stuck.png');
  }
  
  await new Promise(r => setTimeout(r, 5000));
  await browser.close();
})();