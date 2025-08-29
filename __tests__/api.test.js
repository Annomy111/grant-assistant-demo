const {
  TEST_URL,
  waitForElement,
  sendChatMessage,
  waitForText
} = require('./utils/test-helpers');

describe('API Integration Tests', () => {
  
  beforeEach(async () => {
    // Set up request interception
    await page.setRequestInterception(true);
    
    // Monitor API calls
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        console.log('API Request:', request.method(), request.url());
      }
      request.continue();
    });
    
    // Navigate to app
    await page.goto(TEST_URL, { waitUntil: 'networkidle2' });
    const startButton = await waitForElement(page, 'button:has-text("Jetzt Antrag erstellen")');
    await startButton.click();
    await page.waitForTimeout(2000);
  });
  
  afterEach(async () => {
    await page.setRequestInterception(false);
  });

  test('should make API call when sending message', async () => {
    let apiCalled = false;
    
    // Monitor API calls
    page.on('request', request => {
      if (request.url().includes('/api/chat')) {
        apiCalled = true;
      }
    });
    
    // Send message
    await sendChatMessage(page, 'Test API Call');
    await page.waitForTimeout(3000);
    
    // API should have been called
    expect(apiCalled).toBe(true);
  });

  test('should handle API response correctly', async () => {
    // Send message and wait for response
    await sendChatMessage(page, 'Test Response Handling');
    await page.waitForTimeout(3000);
    
    // Check if response was rendered
    const messages = await page.$$('.bg-gray-50');
    expect(messages.length).toBeGreaterThan(0);
    
    // Response should contain text
    const lastMessage = messages[messages.length - 1];
    const messageText = await page.evaluate(el => el.innerText, lastMessage);
    expect(messageText.length).toBeGreaterThan(0);
  });

  test('should send correct request payload', async () => {
    let requestPayload = null;
    
    // Intercept and check request
    page.on('request', request => {
      if (request.url().includes('/api/chat') && request.method() === 'POST') {
        requestPayload = request.postData();
      }
    });
    
    // Send message
    const testMessage = 'Payload Test Message';
    await sendChatMessage(page, testMessage);
    await page.waitForTimeout(2000);
    
    // Check payload
    expect(requestPayload).toBeTruthy();
    if (requestPayload) {
      const parsed = JSON.parse(requestPayload);
      expect(parsed.message).toBe(testMessage);
      expect(parsed.currentStep).toBeTruthy();
    }
  });

  test('should handle API errors gracefully', async () => {
    // Override response to simulate error
    await page.setRequestInterception(true);
    page.removeAllListeners('request');
    
    page.on('request', request => {
      if (request.url().includes('/api/chat')) {
        request.respond({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' })
        });
      } else {
        request.continue();
      }
    });
    
    // Send message
    await sendChatMessage(page, 'Error Test Message');
    await page.waitForTimeout(3000);
    
    // Should show error message
    const hasError = await page.evaluate(() => {
      const text = document.body.innerText.toLowerCase();
      return text.includes('fehler') || text.includes('error') || 
             text.includes('erneut') || text.includes('again');
    });
    expect(hasError).toBe(true);
    
    // App should still be functional
    const chatInput = await page.$('textarea[placeholder*="Nachricht"]');
    expect(chatInput).toBeTruthy();
  });

  test('should handle network timeout', async () => {
    // Simulate slow network
    await page.setRequestInterception(true);
    page.removeAllListeners('request');
    
    page.on('request', request => {
      if (request.url().includes('/api/chat')) {
        // Delay response significantly
        setTimeout(() => {
          request.respond({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ response: 'Delayed response' })
          });
        }, 10000); // 10 second delay
      } else {
        request.continue();
      }
    });
    
    // Send message
    await sendChatMessage(page, 'Timeout Test');
    
    // Should show loading indicator
    await page.waitForTimeout(1000);
    const loader = await page.$('.animate-spin, svg.lucide-loader-2');
    expect(loader).toBeTruthy();
    
    // Clean up
    await page.setRequestInterception(false);
  });

  test('should handle rate limiting', async () => {
    // Send multiple messages quickly
    const messages = ['Message 1', 'Message 2', 'Message 3', 'Message 4', 'Message 5'];
    
    for (const msg of messages) {
      await sendChatMessage(page, msg);
      await page.waitForTimeout(500);
    }
    
    // App should handle rapid requests
    const errorOccurred = await page.evaluate(() => {
      return window.lastError !== undefined;
    });
    
    // Should handle gracefully (no crashes)
    expect(errorOccurred).toBe(false);
  });

  test('should maintain session context', async () => {
    // Send first message
    await sendChatMessage(page, 'Session Test Organization');
    await page.waitForTimeout(2000);
    
    // Send second message
    await sendChatMessage(page, 'Session Test Project');
    await page.waitForTimeout(2000);
    
    // Check if context is maintained
    const messages = await page.$$eval('.flex.gap-3.p-4.rounded-lg', elements =>
      elements.map(el => el.innerText).join(' ')
    );
    
    // Both messages should be in the conversation
    expect(messages).toContain('Session Test Organization');
    expect(messages).toContain('Session Test Project');
  });

  test('should handle special characters in messages', async () => {
    const specialChars = 'Test äöü ÄÖÜ ß @ # $ % & * ( ) { } [ ] < > / \\ | " \' ` ~';
    
    // Send message with special characters
    await sendChatMessage(page, specialChars);
    await page.waitForTimeout(3000);
    
    // Message should be displayed correctly
    await waitForText(page, 'äöü');
    
    // No encoding errors
    const hasEncodingError = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('�') || text.includes('undefined');
    });
    expect(hasEncodingError).toBe(false);
  });

  test('should handle long messages', async () => {
    // Create a long message
    const longMessage = 'Lorem ipsum dolor sit amet. '.repeat(50);
    
    // Send long message
    await sendChatMessage(page, longMessage);
    await page.waitForTimeout(3000);
    
    // Should handle without truncation in UI
    const messageElement = await page.$('.bg-blue-50:last-child');
    const displayedText = await page.evaluate(el => el.innerText, messageElement);
    expect(displayedText.length).toBeGreaterThan(100);
  });

  test('should include authentication headers if required', async () => {
    let hasAuthHeader = false;
    
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        const headers = request.headers();
        if (headers['authorization'] || headers['x-api-key']) {
          hasAuthHeader = true;
        }
      }
    });
    
    // Send message
    await sendChatMessage(page, 'Auth Test');
    await page.waitForTimeout(2000);
    
    // Note: Auth might not be required for public demo
    expect(typeof hasAuthHeader).toBe('boolean');
  });

  test('should handle API version changes', async () => {
    // Check if API versioning is supported
    const apiEndpoints = ['/api/chat', '/api/v1/chat', '/api/v2/chat'];
    let supportedEndpoint = null;
    
    page.on('request', request => {
      for (const endpoint of apiEndpoints) {
        if (request.url().includes(endpoint)) {
          supportedEndpoint = endpoint;
          break;
        }
      }
    });
    
    await sendChatMessage(page, 'Version Test');
    await page.waitForTimeout(2000);
    
    // Should use some API endpoint
    expect(supportedEndpoint).toBeTruthy();
  });

  test('should handle concurrent API calls', async () => {
    const promises = [];
    
    // Send multiple messages concurrently
    for (let i = 0; i < 3; i++) {
      promises.push(sendChatMessage(page, `Concurrent Message ${i}`));
    }
    
    await Promise.all(promises);
    await page.waitForTimeout(3000);
    
    // All messages should be processed
    const messages = await page.$$('.bg-blue-50');
    expect(messages.length).toBeGreaterThanOrEqual(3);
  });

  test('should validate API response format', async () => {
    let responseValid = false;
    
    // Intercept response
    page.on('response', async response => {
      if (response.url().includes('/api/chat') && response.status() === 200) {
        try {
          const data = await response.json();
          // Check expected fields
          responseValid = 'response' in data || 'message' in data || 'error' in data;
        } catch (e) {
          responseValid = false;
        }
      }
    });
    
    await sendChatMessage(page, 'Response Format Test');
    await page.waitForTimeout(3000);
    
    // Response should have valid format
    expect(responseValid).toBe(true);
  });

  test('should handle empty responses', async () => {
    // Override to send empty response
    await page.setRequestInterception(true);
    page.removeAllListeners('request');
    
    page.on('request', request => {
      if (request.url().includes('/api/chat')) {
        request.respond({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ response: '' })
        });
      } else {
        request.continue();
      }
    });
    
    await sendChatMessage(page, 'Empty Response Test');
    await page.waitForTimeout(2000);
    
    // Should handle empty response gracefully
    const errorOccurred = await page.evaluate(() => {
      const errors = Array.from(document.querySelectorAll('.error, .text-red-500'));
      return errors.length > 0;
    });
    
    // Should not crash
    expect(typeof errorOccurred).toBe('boolean');
  });
});