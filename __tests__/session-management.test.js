const puppeteer = require('puppeteer');

describe('Session Management Tests', () => {
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
    
    // Clear localStorage before each test - handle access issues
    try {
      await page.evaluate(() => {
        if (typeof localStorage !== 'undefined') {
          localStorage.clear();
        }
      });
    } catch (e) {
      // localStorage might not be accessible in some test environments
      console.log('Could not clear localStorage:', e.message);
    }
  });

  afterEach(async () => {
    await page.close();
  });

  test('should validate and reject generic phrases', async () => {
    // Navigate to chat
    // Navigate to chat by clicking the CTA button
    const ctaButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      return buttons.find(btn => btn.textContent?.includes('Jetzt starten'));
    });
    
    if (ctaButton) {
      await ctaButton.click();
    }
    await new Promise(r => setTimeout(r, 2000));
    
    // Try to input generic phrases
    const genericPhrases = [
      'Legen wir los',
      'weiter',
      'ok',
      'test'
    ];
    
    for (const phrase of genericPhrases) {
      // Clear textarea
      await page.click('textarea', { clickCount: 3 });
      await page.keyboard.press('Backspace');
      
      // Type generic phrase
      await page.type('textarea', phrase);
      await page.keyboard.press('Enter');
      
      // Wait for response
      await new Promise(r => setTimeout(r, 1000);
      
      // Check localStorage - should not store generic phrases as context
      const context = await page.evaluate(() => {
        const stored = localStorage.getItem('grant-application-context');
        return stored ? JSON.parse(stored) : {};
      });
      
      // Generic phrases should not be stored as organization name
      expect(context.organizationName).not.toBe(phrase);
    }
  });

  test('should accept valid organization names', async () => {
    // Navigate to chat
    // Navigate to chat by clicking the CTA button
    const ctaButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      return buttons.find(btn => btn.textContent?.includes('Jetzt starten'));
    });
    
    if (ctaButton) {
      await ctaButton.click();
    }
    await new Promise(r => setTimeout(r, 2000));
    
    // Type valid organization name
    const validOrgName = 'Open Society Foundations';
    await page.type('textarea', validOrgName);
    await page.keyboard.press('Enter');
    
    // Wait for processing
    await new Promise(r => setTimeout(r, 2000);
    
    // Check if valid name was stored
    const context = await page.evaluate(() => {
      const stored = localStorage.getItem('grant-application-context');
      return stored ? JSON.parse(stored) : {};
    });
    
    expect(context.organizationName).toBe(validOrgName);
  });

  test('should migrate old localStorage data', async () => {
    // Set up old format data with invalid content
    await page.evaluate(() => {
      const oldData = {
        organizationName: 'Legen wir los', // Invalid
        projectTitle: 'Valid Project Title',
        call: 'HORIZON-CL2-2025-DEMOCRACY-01'
      };
      localStorage.setItem('grant-application-context', JSON.stringify(oldData));
    });
    
    // Reload page to trigger migration
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000);
    
    // Check if data was migrated and cleaned
    const migratedContext = await page.evaluate(() => {
      const stored = localStorage.getItem('grant-application-context');
      return stored ? JSON.parse(stored) : {};
    });
    
    // Invalid data should be removed
    expect(migratedContext.organizationName).not.toBe('Legen wir los');
    // Valid data should be preserved
    expect(migratedContext.projectTitle).toBe('Valid Project Title');
    expect(migratedContext.call).toBe('HORIZON-CL2-2025-DEMOCRACY-01');
  });

  test('should enforce minimum field requirements', async () => {
    // Navigate to chat
    // Navigate to chat by clicking the CTA button
    const ctaButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      return buttons.find(btn => btn.textContent?.includes('Jetzt starten'));
    });
    
    if (ctaButton) {
      await ctaButton.click();
    }
    await new Promise(r => setTimeout(r, 2000));
    
    // Try very short organization name
    await page.type('textarea', 'AB'); // Too short
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 1000);
    
    const shortContext = await page.evaluate(() => {
      const stored = localStorage.getItem('grant-application-context');
      return stored ? JSON.parse(stored) : {};
    });
    
    // Should not store names that are too short
    expect(shortContext.organizationName).not.toBe('AB');
    
    // Try valid length name
    await page.click('textarea', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.type('textarea', 'Valid Organization Name');
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 2000);
    
    const validContext = await page.evaluate(() => {
      const stored = localStorage.getItem('grant-application-context');
      return stored ? JSON.parse(stored) : {};
    });
    
    expect(validContext.organizationName).toBe('Valid Organization Name');
  });

  test('should validate project titles require multiple words', async () => {
    // Navigate to chat
    // Navigate to chat by clicking the CTA button
    const ctaButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      return buttons.find(btn => btn.textContent?.includes('Jetzt starten'));
    });
    
    if (ctaButton) {
      await ctaButton.click();
    }
    await new Promise(r => setTimeout(r, 2000));
    
    // First set a valid org name
    await page.type('textarea', 'Test Organization');
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 2000);
    
    // Try single word project title
    await page.click('textarea', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.type('textarea', 'Project'); // Single word - should be rejected
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 1000);
    
    const singleWordContext = await page.evaluate(() => {
      const stored = localStorage.getItem('grant-application-context');
      return stored ? JSON.parse(stored) : {};
    });
    
    // Single word should not be accepted as project title
    expect(singleWordContext.projectTitle).not.toBe('Project');
    
    // Try multi-word project title
    await page.click('textarea', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.type('textarea', 'Digital Innovation Platform');
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 2000);
    
    const multiWordContext = await page.evaluate(() => {
      const stored = localStorage.getItem('grant-application-context');
      return stored ? JSON.parse(stored) : {};
    });
    
    expect(multiWordContext.projectTitle).toBe('Digital Innovation Platform');
  });

  test('should validate call identifiers', async () => {
    // Navigate to chat
    // Navigate to chat by clicking the CTA button
    const ctaButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      return buttons.find(btn => btn.textContent?.includes('Jetzt starten'));
    });
    
    if (ctaButton) {
      await ctaButton.click();
    }
    await new Promise(r => setTimeout(r, 2000));
    
    // Set up org and project first
    await page.type('textarea', 'Test Organization');
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 2000);
    
    await page.type('textarea', 'Test Project Name');
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 2000);
    
    // Try invalid call format
    await page.type('textarea', 'invalid call');
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 1000);
    
    const invalidCallContext = await page.evaluate(() => {
      const stored = localStorage.getItem('grant-application-context');
      return stored ? JSON.parse(stored) : {};
    });
    
    // Invalid format should not be stored
    expect(invalidCallContext.call).not.toBe('invalid call');
    
    // Try valid call identifier
    await page.click('textarea', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.type('textarea', 'HORIZON-CL2-2025-DEMOCRACY-01');
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 2000);
    
    const validCallContext = await page.evaluate(() => {
      const stored = localStorage.getItem('grant-application-context');
      return stored ? JSON.parse(stored) : {};
    });
    
    expect(validCallContext.call).toBe('HORIZON-CL2-2025-DEMOCRACY-01');
  });

  test('should track invalid attempts in session', async () => {
    // Navigate to chat
    // Navigate to chat by clicking the CTA button
    const ctaButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      return buttons.find(btn => btn.textContent?.includes('Jetzt starten'));
    });
    
    if (ctaButton) {
      await ctaButton.click();
    }
    await new Promise(r => setTimeout(r, 2000));
    
    // Make multiple invalid attempts
    const invalidInputs = ['ok', 'test', '...', 'a', 'xx'];
    
    for (const input of invalidInputs) {
      await page.click('textarea', { clickCount: 3 });
      await page.keyboard.press('Backspace');
      await page.type('textarea', input);
      await page.keyboard.press('Enter');
      await new Promise(r => setTimeout(r, 500);
    }
    
    // Check if session tracks invalid attempts
    const sessionData = await page.evaluate(() => {
      // Look for session data in localStorage or IndexedDB
      const keys = Object.keys(localStorage).filter(k => k.includes('session'));
      if (keys.length > 0) {
        const sessionKey = keys[0];
        const data = localStorage.getItem(sessionKey);
        return data ? JSON.parse(data) : null;
      }
      return null;
    });
    
    // Session should exist and track metadata
    expect(sessionData).toBeTruthy();
    if (sessionData && sessionData.metadata) {
      expect(sessionData.metadata.invalidAttempts).toBeGreaterThan(0);
    }
  });

  test('should sanitize input to prevent XSS', async () => {
    // Navigate to chat
    // Navigate to chat by clicking the CTA button
    const ctaButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      return buttons.find(btn => btn.textContent?.includes('Jetzt starten'));
    });
    
    if (ctaButton) {
      await ctaButton.click();
    }
    await new Promise(r => setTimeout(r, 2000));
    
    // Try to inject script tag
    const xssAttempt = '<script>alert("XSS")</script>Valid Organization';
    await page.type('textarea', xssAttempt);
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 2000);
    
    // Check stored value is sanitized
    const context = await page.evaluate(() => {
      const stored = localStorage.getItem('grant-application-context');
      return stored ? JSON.parse(stored) : {};
    });
    
    // Should remove script tags
    expect(context.organizationName).not.toContain('<script>');
    expect(context.organizationName).not.toContain('</script>');
    
    // Should keep the valid part
    if (context.organizationName) {
      expect(context.organizationName).toContain('Valid Organization');
    }
  });

  test('should handle session expiry', async () => {
    // Set an expired session
    await page.evaluate(() => {
      const expiredSession = {
        id: 'test_session',
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 48 hours ago
        expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Expired 24 hours ago
        context: {
          organizationName: 'Old Organization'
        }
      };
      localStorage.setItem('grant_session_test_session', JSON.stringify(expiredSession));
    });
    
    // Reload page - should clean expired session
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000);
    
    // Check if expired session was cleaned
    const remainingSessions = await page.evaluate(() => {
      const keys = Object.keys(localStorage).filter(k => k.includes('grant_session_'));
      return keys.map(k => {
        const data = localStorage.getItem(k);
        return data ? JSON.parse(data) : null;
      }).filter(Boolean);
    });
    
    // Should not have expired sessions
    const hasExpired = remainingSessions.some(s => 
      new Date(s.expiresAt) < new Date()
    );
    expect(hasExpired).toBe(false);
  });

  test('should persist valid data across page reloads', async () => {
    // Navigate to chat
    // Navigate to chat by clicking the CTA button
    const ctaButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      return buttons.find(btn => btn.textContent?.includes('Jetzt starten'));
    });
    
    if (ctaButton) {
      await ctaButton.click();
    }
    await new Promise(r => setTimeout(r, 2000));
    
    // Enter valid data
    const testData = {
      org: 'Persistent Organization',
      project: 'Persistent Project Title',
      call: 'CERV-2025-CITIZENS-01'
    };
    
    // Enter organization
    await page.type('textarea', testData.org);
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 2000);
    
    // Enter project
    await page.type('textarea', testData.project);
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 2000);
    
    // Enter call
    await page.type('textarea', testData.call);
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 2000);
    
    // Reload page
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000);
    
    // Check if data persisted
    const persistedContext = await page.evaluate(() => {
      const stored = localStorage.getItem('grant-application-context');
      return stored ? JSON.parse(stored) : {};
    });
    
    expect(persistedContext.organizationName).toBe(testData.org);
    expect(persistedContext.projectTitle).toBe(testData.project);
    expect(persistedContext.call).toBe(testData.call);
  });
});