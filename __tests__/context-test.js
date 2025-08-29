// Test to verify context detection is working correctly
const puppeteer = require('puppeteer');

(async () => {
  console.log('🔍 Testing Context Detection Fix\n');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    slowMo: 200,
    args: ['--window-size=1400,900']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });
  
  // Enable console logging
  page.on('console', msg => {
    if (msg.text().includes('context') || msg.text().includes('Context')) {
      console.log('Browser console:', msg.text());
    }
  });
  
  try {
    console.log('1️⃣ Loading application...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    // Clear any existing localStorage
    await page.evaluate(() => {
      localStorage.clear();
      console.log('Cleared localStorage');
    });
    
    await page.reload({ waitUntil: 'networkidle2' });
    
    // Click start button
    console.log('\n2️⃣ Starting application...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.textContent?.includes('Antrag Starten'));
      if (btn) btn.click();
    });
    
    await new Promise(r => setTimeout(r, 2000));
    
    // Test 1: Send "Legen wir los" and verify it's NOT captured as organization
    console.log('\n3️⃣ Testing generic prompt detection...');
    const textarea = await page.$('textarea');
    if (textarea) {
      await textarea.type('Legen wir los');
      await page.keyboard.press('Enter');
      await new Promise(r => setTimeout(r, 3000));
      
      const context1 = await page.evaluate(() => {
        const stored = localStorage.getItem('grant-application-context');
        return stored ? JSON.parse(stored) : null;
      });
      
      if (context1?.organizationName === 'Legen wir los') {
        console.log('   ❌ ERROR: "Legen wir los" incorrectly captured as organization!');
      } else {
        console.log('   ✅ Correctly ignored generic prompt');
      }
      
      // Clear textarea
      await page.evaluate(() => {
        const ta = document.querySelector('textarea');
        if (ta) ta.value = '';
      });
      
      // Test 2: Send structured organization data
      console.log('\n4️⃣ Testing structured data parsing...');
      const structuredInput = `Open Society Foundations: Impact for society under threat
• Call-Identifikation: HORIZON-CL2-2025-DEMOCRACY-01`;
      
      await textarea.type(structuredInput);
      await page.keyboard.press('Enter');
      await new Promise(r => setTimeout(r, 3000));
      
      const context2 = await page.evaluate(() => {
        const stored = localStorage.getItem('grant-application-context');
        return stored ? JSON.parse(stored) : null;
      });
      
      console.log('\n📊 Context after structured input:');
      console.log('   Organization:', context2?.organizationName || 'Not captured');
      console.log('   Call:', context2?.call || 'Not captured');
      
      if (context2?.organizationName === 'Open Society Foundations') {
        console.log('   ✅ Organization correctly captured');
      } else {
        console.log('   ❌ Organization not properly extracted');
      }
      
      if (context2?.call === 'HORIZON-CL2-2025-DEMOCRACY-01') {
        console.log('   ✅ Call ID correctly captured');
      } else {
        console.log('   ❌ Call ID not properly extracted');
      }
      
      // Test 3: Verify AI doesn't repeat questions
      console.log('\n5️⃣ Checking AI response...');
      await page.evaluate(() => {
        const ta = document.querySelector('textarea');
        if (ta) ta.value = '';
      });
      
      await textarea.type('sehr gut, weiter');
      await page.keyboard.press('Enter');
      await new Promise(r => setTimeout(r, 5000));
      
      // Get last AI message
      const lastMessage = await page.evaluate(() => {
        const messages = document.querySelectorAll('[class*="bg-gray-50"]');
        const lastMsg = messages[messages.length - 1];
        return lastMsg?.textContent || '';
      });
      
      console.log('\n📝 Last AI response snippet:', lastMessage.substring(0, 150) + '...');
      
      if (lastMessage.toLowerCase().includes('organisation') && 
          lastMessage.toLowerCase().includes('name')) {
        console.log('   ❌ AI is still asking for organization (should not!)');
      } else {
        console.log('   ✅ AI not repeating organization question');
      }
      
      // Final context check
      const finalContext = await page.evaluate(() => {
        const stored = localStorage.getItem('grant-application-context');
        return stored ? JSON.parse(stored) : null;
      });
      
      console.log('\n📋 Final Context State:');
      console.log('   Organization:', finalContext?.organizationName || 'Missing');
      console.log('   Project:', finalContext?.projectTitle || 'Missing');  
      console.log('   Call:', finalContext?.call || 'Missing');
      console.log('   Template:', finalContext?.templateId || 'None');
      
    } else {
      console.log('❌ Could not find chat textarea');
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
  
  console.log('\n⏱️ Test complete. Browser will close in 5 seconds...');
  await new Promise(r => setTimeout(r, 5000));
  await browser.close();
})();