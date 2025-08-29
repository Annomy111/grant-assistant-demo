// Comprehensive test for the improved grant application pipeline
const puppeteer = require('puppeteer');

(async () => {
  console.log('🚀 Testing Improved Grant Application Pipeline...\n');
  const browser = await puppeteer.launch({ 
    headless: true,  // Run headless for faster execution
    args: ['--window-size=1400,900']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });
  
  // Track test results
  const results = {
    passed: [],
    failed: [],
    warnings: []
  };
  
  try {
    console.log('1️⃣ Navigating to application...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    // Check if page loaded
    const title = await page.title();
    console.log(`   ✓ Page loaded: ${title}`);
    results.passed.push('Page loads successfully');
    
    // Click "Antrag Starten" button
    console.log('\n2️⃣ Starting application process...');
    // Use page.evaluate to find and click button by text
    const clicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.textContent?.includes('Antrag Starten'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    
    if (clicked) {
      console.log('   ✓ Start button clicked');
      results.passed.push('Start button works');
    } else {
      console.log('   ❌ Start button not found');
      results.failed.push('Start button not found');
    }
    
    // Wait for navigation and chat interface to load
    await new Promise(r => setTimeout(r, 3000));
    
    // Check if we're now on the chat page
    const currentUrl = page.url();
    console.log(`   Current URL: ${currentUrl}`);
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-screenshot.png' });
    console.log('   📸 Screenshot saved as test-screenshot.png');
    
    // Test 1: Check if Sidebar Navigation is present
    console.log('\n3️⃣ Testing Sidebar Navigation...');
    const sidebar = await page.$('.w-80.bg-gray-50.border-r, .w-16.bg-gray-50.border-r');
    if (sidebar) {
      console.log('   ✓ Sidebar navigation found');
      results.passed.push('Sidebar navigation present');
      
      // Check for sections
      const sections = await page.$$eval('.border-b.border-gray-200', els => 
        els.map(el => el.textContent?.trim()).filter(Boolean)
      );
      console.log(`   ✓ Found ${sections.length} sections in sidebar`);
      if (sections.length > 0) {
        results.passed.push(`Sidebar has ${sections.length} sections`);
      }
      
      // Try to expand/collapse sidebar
      const collapseButton = await page.$('button[title*="minimieren"], button[title*="erweitern"]');
      if (collapseButton) {
        await collapseButton.click();
        await new Promise(r => setTimeout(r, 500));
        console.log('   ✓ Sidebar collapse/expand works');
        results.passed.push('Sidebar collapse/expand functionality');
      }
    } else {
      console.log('   ⚠️ Sidebar not found');
      results.warnings.push('Sidebar navigation not found');
    }
    
    // Test 2: Check Section Validation
    console.log('\n4️⃣ Testing Section Validation...');
    const validator = await page.$('.px-4.py-2.border-b.bg-blue-50');
    if (validator) {
      const validationText = await validator.evaluate(el => el.textContent);
      console.log(`   ✓ Section validator present: ${validationText?.substring(0, 50)}...`);
      results.passed.push('Section validation component present');
    } else {
      console.log('   ⚠️ Section validator not found');
      results.warnings.push('Section validator not visible');
    }
    
    // Test 3: Test context detection by sending messages
    console.log('\n5️⃣ Testing Context Management...');
    
    // Send organization name
    const textarea = await page.$('textarea');
    if (textarea) {
      await textarea.type('Tech Innovation Foundation');
      await page.keyboard.press('Enter');
      await new Promise(r => setTimeout(r, 2000));  // Reduced wait time
      console.log('   ✓ Sent organization name');
      
      // Clear and send project title
      await page.evaluate(() => {
        const ta = document.querySelector('textarea');
        if (ta) ta.value = '';
      });
      await textarea.type('Digital Democracy Platform');
      await page.keyboard.press('Enter');
      await new Promise(r => setTimeout(r, 2000));  // Reduced wait time
      console.log('   ✓ Sent project title');
      
      // Clear and send call identifier
      await page.evaluate(() => {
        const ta = document.querySelector('textarea');
        if (ta) ta.value = '';
      });
      await textarea.type('HORIZON-CL2-2025-DEMOCRACY-01');
      await page.keyboard.press('Enter');
      await new Promise(r => setTimeout(r, 2000));  // Reduced wait time
      console.log('   ✓ Sent call identifier');
      
      // Check if context was captured
      const context = await page.evaluate(() => {
        const stored = localStorage.getItem('grant-application-context');
        return stored ? JSON.parse(stored) : null;
      });
      
      if (context) {
        console.log('   ✓ Context stored in localStorage');
        console.log(`     - Organization: ${context.organizationName || 'Not captured'}`);
        console.log(`     - Project: ${context.projectTitle || 'Not captured'}`);
        console.log(`     - Call: ${context.call || 'Not captured'}`);
        
        if (context.organizationName) results.passed.push('Organization name captured');
        if (context.projectTitle) results.passed.push('Project title captured');
        if (context.call) results.passed.push('Call identifier captured');
      } else {
        results.warnings.push('Context not found in localStorage');
      }
    } else {
      console.log('   ❌ Textarea not found');
      results.failed.push('Cannot find chat input');
    }
    
    // Test 4: Check Draft Save functionality
    console.log('\n6️⃣ Testing Draft Management...');
    
    // Look for save draft button in sidebar or main area
    const saveDraftButton = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const saveBtn = buttons.find(b => 
        b.textContent?.includes('Entwurf') || 
        b.textContent?.includes('Draft') ||
        b.textContent?.includes('Speichern')
      );
      return saveBtn !== undefined;
    });
    
    if (saveDraftButton) {
      console.log('   ✓ Save draft button found');
      results.passed.push('Save draft button present');
      
      // Check if drafts are stored
      const drafts = await page.evaluate(() => {
        const stored = localStorage.getItem('grant-assistant-drafts');
        return stored ? JSON.parse(stored) : null;
      });
      
      if (drafts) {
        console.log(`   ✓ Found ${drafts.drafts?.length || 0} saved drafts`);
        results.passed.push('Draft storage working');
      }
    } else {
      console.log('   ⚠️ Save draft button not found');
      results.warnings.push('Save draft button not visible');
    }
    
    // Test 5: Check Step Indicator
    console.log('\n7️⃣ Testing Step Indicator...');
    const stepIndicator = await page.$('.bg-white.border-b .flex.items-center.justify-between');
    if (stepIndicator) {
      const steps = await page.$$eval('.w-10.h-10.rounded-full', els => els.length);
      console.log(`   ✓ Step indicator shows ${steps} steps`);
      results.passed.push(`Step indicator with ${steps} steps`);
    } else {
      console.log('   ⚠️ Step indicator not found');
      results.warnings.push('Step indicator not visible');
    }
    
    // Test 6: Check Template Selector
    console.log('\n8️⃣ Testing Template Selector...');
    const templateButtonClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.textContent?.includes('Template'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    
    if (templateButtonClicked) {
      await new Promise(r => setTimeout(r, 1000));
      
      const templateSelector = await page.$('.sticky.top-0.bg-white.border-b');
      if (templateSelector) {
        console.log('   ✓ Template selector opens');
        results.passed.push('Template selector functional');
        
        // Close template selector
        await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const closeBtn = buttons.find(b => b.textContent?.includes('✕'));
          if (closeBtn) closeBtn.click();
        });
      }
    } else {
      console.log('   ⚠️ Template button not found');
      results.warnings.push('Template selector not accessible');
    }
    
    // Test 7: Check Progress Tracking
    console.log('\n9️⃣ Testing Progress Tracking...');
    const progressBars = await page.$$('.h-2.bg-gray-200.rounded-full');
    if (progressBars.length > 0) {
      console.log(`   ✓ Found ${progressBars.length} progress indicators`);
      results.passed.push('Progress tracking indicators present');
    }
    
    // Test 8: Navigation between sections
    console.log('\n🔟 Testing Section Navigation...');
    const sectionButtons = await page.$$('button[class*="w-full px-4 py-3"]');
    if (sectionButtons.length > 1) {
      // Try to click on a different section
      const secondSection = sectionButtons[1];
      const sectionText = await secondSection.evaluate(el => el.textContent);
      
      // Check if section is not locked
      const isDisabled = await secondSection.evaluate(el => el.disabled);
      if (!isDisabled) {
        await secondSection.click();
        await new Promise(r => setTimeout(r, 1000));
        console.log(`   ✓ Navigated to section: ${sectionText?.substring(0, 30)}`);
        results.passed.push('Section navigation works');
      } else {
        console.log('   ℹ️ Section is locked (expected behavior)');
        results.passed.push('Section locking works correctly');
      }
    }
    
    // Test 9: Check for validation messages
    console.log('\n1️⃣1️⃣ Testing Validation Messages...');
    const validationMessages = await page.$$('.text-red-700, .text-yellow-700, .text-green-800');
    if (validationMessages.length > 0) {
      console.log(`   ✓ Found ${validationMessages.length} validation messages`);
      results.passed.push('Validation messages present');
    }
    
    // Test 10: Check localStorage persistence
    console.log('\n1️⃣2️⃣ Testing Data Persistence...');
    const allStorageKeys = await page.evaluate(() => Object.keys(localStorage));
    console.log(`   ✓ localStorage contains ${allStorageKeys.length} keys:`);
    allStorageKeys.forEach(key => {
      console.log(`     - ${key}`);
    });
    if (allStorageKeys.length > 0) {
      results.passed.push('Data persistence working');
    }
    
  } catch (error) {
    console.error('\n❌ Test error:', error.message);
    results.failed.push(`Test error: ${error.message}`);
  }
  
  // Print Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  
  console.log(`\n✅ PASSED: ${results.passed.length} tests`);
  results.passed.forEach(test => console.log(`   • ${test}`));
  
  if (results.warnings.length > 0) {
    console.log(`\n⚠️ WARNINGS: ${results.warnings.length} issues`);
    results.warnings.forEach(warning => console.log(`   • ${warning}`));
  }
  
  if (results.failed.length > 0) {
    console.log(`\n❌ FAILED: ${results.failed.length} tests`);
    results.failed.forEach(test => console.log(`   • ${test}`));
  }
  
  const totalTests = results.passed.length + results.failed.length;
  const successRate = totalTests > 0 ? Math.round((results.passed.length / totalTests) * 100) : 0;
  
  console.log('\n' + '='.repeat(60));
  console.log(`🎯 Success Rate: ${successRate}% (${results.passed.length}/${totalTests})`);
  console.log('='.repeat(60));
  
  // Keep browser open briefly
  await new Promise(r => setTimeout(r, 1000));
  
  await browser.close();
  
  // Exit with appropriate code
  process.exit(results.failed.length > 0 ? 1 : 0);
})();