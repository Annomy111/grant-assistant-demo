#!/usr/bin/env node

const puppeteer = require('puppeteer');

const URL = 'https://grant-assistant-demo.netlify.app';

async function testSite() {
  console.log('🧪 Testing Grant Assistant Application\n');
  console.log('URL:', URL);
  console.log('='.repeat(60) + '\n');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const results = [];
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    
    // Test 1: Landing Page Loads
    console.log('📋 Test 1: Landing Page');
    let testPassed = false;
    try {
      await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 });
      const title = await page.title();
      testPassed = title.includes('KI-Antragsassistent') || title.includes('Grant Assistant');
      results.push({ name: 'Landing Page Load', passed: testPassed });
      console.log(testPassed ? '✅ PASS' : '❌ FAIL');
    } catch (error) {
      results.push({ name: 'Landing Page Load', passed: false, error: error.message });
      console.log('❌ FAIL:', error.message);
    }
    
    // Test 2: Main Elements Present
    console.log('\n📋 Test 2: UI Elements');
    try {
      const heading = await page.$eval('h1', el => el.textContent);
      const hasButton = await page.$('button');
      testPassed = heading && hasButton;
      results.push({ name: 'UI Elements Present', passed: testPassed });
      console.log(testPassed ? '✅ PASS' : '❌ FAIL');
      if (heading) console.log('  - Heading:', heading);
    } catch (error) {
      results.push({ name: 'UI Elements Present', passed: false });
      console.log('❌ FAIL');
    }
    
    // Test 3: Start Button Works
    console.log('\n📋 Test 3: Start Application Button');
    try {
      const buttons = await page.$$('button');
      let startButton = null;
      
      for (const button of buttons) {
        const text = await page.evaluate(el => el.textContent, button);
        if (text && (text.includes('Antrag') || text.includes('Application') || text.includes('Start'))) {
          startButton = button;
          break;
        }
      }
      
      if (startButton) {
        await startButton.click();
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Check if we're in the chat interface
        const chatInput = await page.$('textarea');
        testPassed = chatInput !== null;
        results.push({ name: 'Start Button Navigation', passed: testPassed });
        console.log(testPassed ? '✅ PASS' : '❌ FAIL');
      } else {
        results.push({ name: 'Start Button Navigation', passed: false });
        console.log('❌ FAIL: Start button not found');
      }
    } catch (error) {
      results.push({ name: 'Start Button Navigation', passed: false });
      console.log('❌ FAIL:', error.message);
    }
    
    // Test 4: Chat Interface
    console.log('\n📋 Test 4: Chat Interface');
    try {
      const chatInput = await page.$('textarea');
      const hasStepIndicator = await page.$('.step-indicator, [class*="StepIndicator"], div:has-text("Grundlagen")');
      testPassed = chatInput !== null || hasStepIndicator !== null;
      results.push({ name: 'Chat Interface Loaded', passed: testPassed });
      console.log(testPassed ? '✅ PASS' : '❌ FAIL');
    } catch (error) {
      results.push({ name: 'Chat Interface Loaded', passed: false });
      console.log('❌ FAIL');
    }
    
    // Test 5: Language Support
    console.log('\n📋 Test 5: Language Support');
    try {
      // Go back to landing
      await page.goto(URL, { waitUntil: 'networkidle2' });
      
      // Check for German text
      const pageText = await page.evaluate(() => document.body.innerText);
      const hasGerman = pageText.includes('Unterstützung') || pageText.includes('Organisation');
      testPassed = hasGerman;
      results.push({ name: 'Language Support', passed: testPassed });
      console.log(testPassed ? '✅ PASS' : '❌ FAIL');
    } catch (error) {
      results.push({ name: 'Language Support', passed: false });
      console.log('❌ FAIL');
    }
    
    // Test 6: Responsive Design
    console.log('\n📋 Test 6: Responsive Design');
    try {
      // Test mobile view
      await page.setViewport({ width: 375, height: 667 });
      await page.goto(URL, { waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if page adapts
      const mobileLayout = await page.evaluate(() => {
        const width = document.body.offsetWidth;
        return width <= 400;
      });
      
      testPassed = mobileLayout;
      results.push({ name: 'Mobile Responsive', passed: testPassed });
      console.log(testPassed ? '✅ PASS' : '❌ FAIL');
    } catch (error) {
      results.push({ name: 'Mobile Responsive', passed: false });
      console.log('❌ FAIL');
    }
    
    // Test 7: Performance
    console.log('\n📋 Test 7: Page Performance');
    try {
      const startTime = Date.now();
      await page.goto(URL, { waitUntil: 'networkidle2' });
      const loadTime = Date.now() - startTime;
      
      testPassed = loadTime < 10000; // Under 10 seconds
      results.push({ name: 'Page Load Performance', passed: testPassed, time: loadTime });
      console.log(testPassed ? '✅ PASS' : '❌ FAIL');
      console.log('  - Load time:', loadTime, 'ms');
    } catch (error) {
      results.push({ name: 'Page Load Performance', passed: false });
      console.log('❌ FAIL');
    }
    
    // Test 8: No Console Errors
    console.log('\n📋 Test 8: Console Errors');
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto(URL, { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    testPassed = errors.length === 0;
    results.push({ name: 'No Console Errors', passed: testPassed, errors });
    console.log(testPassed ? '✅ PASS' : '❌ FAIL');
    if (!testPassed) {
      console.log('  - Errors found:', errors.length);
    }
    
  } catch (error) {
    console.error('\n❌ Test execution failed:', error.message);
  } finally {
    await browser.close();
  }
  
  // Print Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY\n');
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  
  results.forEach(r => {
    const status = r.passed ? '✅' : '❌';
    const time = r.time ? ` (${r.time}ms)` : '';
    console.log(`${status} ${r.name}${time}`);
  });
  
  console.log('\n' + '-'.repeat(60));
  console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`);
  console.log('='.repeat(60));
  
  return results;
}

// Run the tests
testSite().then(results => {
  const allPassed = results.every(r => r.passed);
  process.exit(allPassed ? 0 : 1);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});