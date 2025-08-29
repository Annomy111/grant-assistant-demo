const puppeteer = require('puppeteer');

describe('Basic Session Validation Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: process.env.HEADLESS !== 'false',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  });

  afterEach(async () => {
    await page.close();
  });

  test('should load landing page', async () => {
    const title = await page.title();
    expect(title).toBeTruthy();
    
    // Check for main heading
    const heading = await page.$eval('h1', el => el.textContent);
    expect(heading).toContain('KI-Antragsassistent');
  });

  test('should navigate to chat interface', async () => {
    // Find CTA button
    const ctaButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      return buttons.find(btn => btn.textContent?.includes('Jetzt starten'));
    });
    
    expect(ctaButton).toBeTruthy();
    
    // Click to navigate
    await ctaButton.click();
    await new Promise(r => setTimeout(r, 2000));
    
    // Check for chat elements
    const hasTextarea = await page.$('textarea');
    expect(hasTextarea).toBeTruthy();
  });

  test('should reject generic input "Legen wir los"', async () => {
    // Navigate to chat
    const ctaButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      return buttons.find(btn => btn.textContent?.includes('Jetzt starten'));
    });
    await ctaButton.click();
    await new Promise(r => setTimeout(r, 2000));
    
    // Type generic phrase
    await page.type('textarea', 'Legen wir los');
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 2000));
    
    // Check context - should not store this as organization
    const context = await page.evaluate(() => {
      try {
        const stored = localStorage.getItem('grant-application-context');
        return stored ? JSON.parse(stored) : {};
      } catch (e) {
        return {};
      }
    });
    
    // Should not store generic phrase
    expect(context.organizationName).not.toBe('Legen wir los');
  });

  test('should accept valid organization name', async () => {
    // Navigate to chat
    const ctaButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      return buttons.find(btn => btn.textContent?.includes('Jetzt starten'));
    });
    await ctaButton.click();
    await new Promise(r => setTimeout(r, 2000));
    
    // Type valid organization
    await page.type('textarea', 'Open Society Foundations');
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 3000));
    
    // Check context
    const context = await page.evaluate(() => {
      try {
        const stored = localStorage.getItem('grant-application-context');
        return stored ? JSON.parse(stored) : {};
      } catch (e) {
        return {};
      }
    });
    
    // Should store valid organization
    expect(context.organizationName).toBe('Open Society Foundations');
  });

  test('should validate input length requirements', async () => {
    // Navigate to chat
    const ctaButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      return buttons.find(btn => btn.textContent?.includes('Jetzt starten'));
    });
    await ctaButton.click();
    await new Promise(r => setTimeout(r, 2000));
    
    // Try very short input
    await page.type('textarea', 'AB');
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 1000));
    
    const shortContext = await page.evaluate(() => {
      try {
        const stored = localStorage.getItem('grant-application-context');
        return stored ? JSON.parse(stored) : {};
      } catch (e) {
        return {};
      }
    });
    
    // Should not store too short names
    expect(shortContext.organizationName).not.toBe('AB');
    
    // Clear textarea
    await page.click('textarea', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    
    // Try valid length
    await page.type('textarea', 'Valid Organization Name');
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 2000));
    
    const validContext = await page.evaluate(() => {
      try {
        const stored = localStorage.getItem('grant-application-context');
        return stored ? JSON.parse(stored) : {};
      } catch (e) {
        return {};
      }
    });
    
    expect(validContext.organizationName).toBe('Valid Organization Name');
  });

  test('should sanitize HTML/script tags', async () => {
    // Navigate to chat
    const ctaButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      return buttons.find(btn => btn.textContent?.includes('Jetzt starten'));
    });
    await ctaButton.click();
    await new Promise(r => setTimeout(r, 2000));
    
    // Try to inject script
    await page.type('textarea', '<script>alert("XSS")</script>Test Organization');
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 2000));
    
    const context = await page.evaluate(() => {
      try {
        const stored = localStorage.getItem('grant-application-context');
        return stored ? JSON.parse(stored) : {};
      } catch (e) {
        return {};
      }
    });
    
    // Should sanitize dangerous content
    if (context.organizationName) {
      expect(context.organizationName).not.toContain('<script>');
      expect(context.organizationName).not.toContain('</script>');
    }
  });
});