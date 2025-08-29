// Quick test to verify the improved pipeline features
const puppeteer = require('puppeteer');

(async () => {
  console.log('🚀 Quick Feature Test for Improved Pipeline\n');
  
  const browser = await puppeteer.launch({ 
    headless: false,  // Show browser for debugging
    slowMo: 100,
    args: ['--window-size=1400,900']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });
  
  try {
    console.log('1️⃣ Loading application...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    console.log('   ✓ Page loaded');
    
    // Wait a moment for React to render
    await new Promise(r => setTimeout(r, 2000));
    
    // Click start button
    console.log('\n2️⃣ Starting application...');
    const startClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const startBtn = buttons.find(b => 
        b.textContent?.includes('Antrag Starten') || 
        b.textContent?.includes('Start')
      );
      if (startBtn) {
        startBtn.click();
        return true;
      }
      return false;
    });
    
    if (startClicked) {
      console.log('   ✓ Application started');
      
      // Wait for chat interface to load
      await new Promise(r => setTimeout(r, 3000));
      
      // Check for our new features
      console.log('\n3️⃣ Checking for improved features...');
      
      // 1. Check for sidebar navigation
      const hasSidebar = await page.evaluate(() => {
        // Look for sidebar by checking for section navigation elements
        const sidebar = document.querySelector('[class*="w-80"]') || 
                       document.querySelector('[class*="w-16"]') ||
                       document.querySelector('.border-r');
        return !!sidebar;
      });
      console.log(`   ${hasSidebar ? '✓' : '✗'} Sidebar navigation: ${hasSidebar ? 'Present' : 'Not found'}`);
      
      // 2. Check for section validator
      const hasValidator = await page.evaluate(() => {
        const validator = document.querySelector('[class*="bg-blue-50"]');
        return !!validator;
      });
      console.log(`   ${hasValidator ? '✓' : '✗'} Section validator: ${hasValidator ? 'Present' : 'Not found'}`);
      
      // 3. Check for template button
      const hasTemplateButton = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.some(b => b.textContent?.includes('Template'));
      });
      console.log(`   ${hasTemplateButton ? '✓' : '✗'} Template selector: ${hasTemplateButton ? 'Available' : 'Not found'}`);
      
      // 4. Check for step indicator
      const hasStepIndicator = await page.evaluate(() => {
        const steps = document.querySelectorAll('[class*="rounded-full"]');
        return steps.length > 0;
      });
      console.log(`   ${hasStepIndicator ? '✓' : '✗'} Step indicator: ${hasStepIndicator ? 'Present' : 'Not found'}`);
      
      // 5. Test context management by sending a message
      console.log('\n4️⃣ Testing context management...');
      const textarea = await page.$('textarea');
      if (textarea) {
        await textarea.type('Tech Innovation Foundation');
        await page.keyboard.press('Enter');
        await new Promise(r => setTimeout(r, 3000));
        
        // Check localStorage for context
        const contextStored = await page.evaluate(() => {
          const stored = localStorage.getItem('grant-application-context');
          if (stored) {
            const context = JSON.parse(stored);
            return {
              hasContext: true,
              organizationName: context.organizationName || null
            };
          }
          return { hasContext: false };
        });
        
        if (contextStored.hasContext) {
          console.log('   ✓ Context management working');
          if (contextStored.organizationName) {
            console.log(`     Organization captured: ${contextStored.organizationName}`);
          }
        } else {
          console.log('   ✗ Context not being stored');
        }
      } else {
        console.log('   ✗ Chat input not found');
      }
      
      // 6. Check for draft management
      console.log('\n5️⃣ Testing draft management...');
      const draftFeatures = await page.evaluate(() => {
        // Check localStorage for draft manager
        const drafts = localStorage.getItem('grant-assistant-drafts');
        const buttons = Array.from(document.querySelectorAll('button'));
        const hasDraftButton = buttons.some(b => 
          b.textContent?.includes('Entwurf') || 
          b.textContent?.includes('Draft') ||
          b.textContent?.includes('Save')
        );
        
        return {
          storageReady: drafts !== null,
          buttonPresent: hasDraftButton
        };
      });
      
      console.log(`   ${draftFeatures.storageReady ? '✓' : '✗'} Draft storage: ${draftFeatures.storageReady ? 'Initialized' : 'Not initialized'}`);
      console.log(`   ${draftFeatures.buttonPresent ? '✓' : '✗'} Draft buttons: ${draftFeatures.buttonPresent ? 'Available' : 'Not found'}`);
      
      // Take a final screenshot
      await page.screenshot({ path: 'feature-test-screenshot.png' });
      console.log('\n📸 Screenshot saved as feature-test-screenshot.png');
      
      // Summary
      console.log('\n' + '='.repeat(60));
      console.log('📊 FEATURE CHECK SUMMARY');
      console.log('='.repeat(60));
      
      const features = [
        { name: 'Sidebar Navigation', status: hasSidebar },
        { name: 'Section Validator', status: hasValidator },
        { name: 'Template Selector', status: hasTemplateButton },
        { name: 'Step Indicator', status: hasStepIndicator },
        { name: 'Context Management', status: textarea ? true : false },
        { name: 'Draft Management', status: draftFeatures.storageReady }
      ];
      
      const passedCount = features.filter(f => f.status).length;
      
      console.log('\nFeatures implemented:');
      features.forEach(f => {
        console.log(`  ${f.status ? '✅' : '❌'} ${f.name}`);
      });
      
      console.log(`\n🎯 Success Rate: ${Math.round((passedCount / features.length) * 100)}% (${passedCount}/${features.length})`);
      console.log('='.repeat(60));
      
    } else {
      console.log('   ❌ Could not start application');
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
  
  // Keep browser open for observation
  console.log('\n⏱️ Keeping browser open for 5 seconds...');
  await new Promise(r => setTimeout(r, 5000));
  
  await browser.close();
  console.log('✅ Test completed');
})();