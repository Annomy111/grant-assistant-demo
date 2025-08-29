const puppeteer = require('puppeteer');

describe('Button Click Debug Test', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false, // Show browser for debugging
      devtools: true,  // Open DevTools automatically
      slowMo: 100,     // Slow down actions
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    page = await browser.newPage();
    
    // Listen to console messages
    page.on('console', msg => {
      console.log('PAGE LOG:', msg.text());
    });
    
    // Listen to page errors
    page.on('error', err => {
      console.error('PAGE ERROR:', err);
    });
    
    // Listen to page crashes
    page.on('pageerror', err => {
      console.error('PAGE CRASH:', err);
    });
  });

  afterAll(async () => {
    // Keep browser open for manual inspection
    // await browser.close();
  });

  test('should click Antrag Starten button and show chat', async () => {
    console.log('1. Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    console.log('2. Page loaded, waiting for button...');
    
    // Take screenshot before click
    await page.screenshot({ path: 'before-click.png', fullPage: true });
    console.log('3. Screenshot saved as before-click.png');
    
    // Try to find the button with different selectors
    const buttonSelectors = [
      'button:has-text("Antrag Starten")',
      'button:has-text("Antrag starten")', 
      'button:contains("Antrag")',
      'button.px-8.py-3.text-white',
      'button[style*="background-color"]'
    ];
    
    let button = null;
    for (const selector of buttonSelectors) {
      try {
        button = await page.evaluateHandle((sel) => {
          // Try different methods to find the button
          const buttons = Array.from(document.querySelectorAll('button'));
          
          // Find by text content
          const buttonByText = buttons.find(btn => 
            btn.textContent && (
              btn.textContent.includes('Antrag Starten') ||
              btn.textContent.includes('Antrag starten')
            )
          );
          
          if (buttonByText) {
            console.log('Found button by text:', buttonByText.textContent);
            return buttonByText;
          }
          
          // Find by class
          const buttonByClass = buttons.find(btn => 
            btn.className && btn.className.includes('px-8') && btn.className.includes('py-3')
          );
          
          if (buttonByClass) {
            console.log('Found button by class:', buttonByClass.textContent);
            return buttonByClass;
          }
          
          return null;
        }, selector);
        
        if (button && await button.evaluate(el => el !== null)) {
          console.log(`4. Found button with selector: ${selector}`);
          break;
        }
      } catch (e) {
        // Try next selector
      }
    }
    
    if (!button || !(await button.evaluate(el => el !== null))) {
      // List all buttons on the page for debugging
      const allButtons = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.map(btn => ({
          text: btn.textContent?.trim(),
          className: btn.className,
          onclick: btn.onclick ? 'has onclick' : 'no onclick',
          style: btn.getAttribute('style')
        }));
      });
      console.log('All buttons on page:', JSON.stringify(allButtons, null, 2));
      throw new Error('Could not find the button');
    }
    
    // Get button info before clicking
    const buttonInfo = await button.evaluate(el => ({
      text: el.textContent,
      className: el.className,
      hasOnClick: !!el.onclick,
      hasEventListeners: !!el._reactInternalFiber || !!el.__reactInternalInstance,
      isVisible: el.offsetParent !== null,
      position: el.getBoundingClientRect()
    }));
    console.log('5. Button info:', buttonInfo);
    
    // Scroll button into view
    await button.evaluate(el => el.scrollIntoView({ block: 'center' }));
    await new Promise(r => setTimeout(r, 500));
    
    // Try clicking the button
    console.log('6. Clicking the button...');
    
    // Method 1: Direct click
    try {
      await button.evaluate(el => el.click());
      console.log('7. Clicked using JavaScript click()');
    } catch (e) {
      console.log('JavaScript click failed:', e.message);
    }
    
    // Wait a bit to see if anything happens
    await new Promise(r => setTimeout(r, 2000));
    
    // Check if showChat changed
    const showChatState = await page.evaluate(() => {
      // Try to check React state
      const rootElement = document.getElementById('__next');
      if (rootElement && rootElement._reactRootContainer) {
        console.log('Found React root container');
      }
      
      // Check if chat interface is visible
      const chatInterface = document.querySelector('.chat-interface, [data-testid="chat-interface"], header:has-text("Grant Assistant")');
      return {
        hasChatInterface: !!chatInterface,
        headerText: document.querySelector('header h1')?.textContent,
        bodyHTML: document.body.innerHTML.substring(0, 500)
      };
    });
    
    console.log('8. After click state:', showChatState);
    
    // Take screenshot after click
    await page.screenshot({ path: 'after-click.png', fullPage: true });
    console.log('9. Screenshot saved as after-click.png');
    
    // Try clicking with Puppeteer's click method
    if (!showChatState.hasChatInterface) {
      console.log('10. Chat not visible, trying Puppeteer click...');
      
      const buttonElement = await page.$('button');
      if (buttonElement) {
        await buttonElement.click();
        console.log('11. Clicked using Puppeteer click()');
        
        await new Promise(r => setTimeout(r, 2000));
        
        const finalState = await page.evaluate(() => {
          const chatVisible = document.querySelector('header')?.textContent?.includes('Grant Assistant');
          return {
            chatVisible,
            currentURL: window.location.href,
            pageTitle: document.title
          };
        });
        
        console.log('12. Final state:', finalState);
        await page.screenshot({ path: 'final-state.png', fullPage: true });
      }
    }
    
    // Keep test running for manual inspection
    await new Promise(r => setTimeout(r, 60000));
  });
});