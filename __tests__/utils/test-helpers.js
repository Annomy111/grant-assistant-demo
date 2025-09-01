/**
 * Test helper utilities for Puppeteer tests
 */

const TEST_URL = 'http://localhost:3000';

/**
 * Wait for an element and return it
 */
async function waitForElement(page, selector, options = {}) {
  await page.waitForSelector(selector, { visible: true, ...options });
  return await page.$(selector);
}

/**
 * Type text into an input field
 */
async function typeIntoField(page, selector, text, options = {}) {
  const element = await waitForElement(page, selector);
  await element.click({ clickCount: 3 }); // Select all existing text
  await element.type(text, { delay: 50, ...options });
}

/**
 * Click and wait for navigation
 */
async function clickAndNavigate(page, selector) {
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    page.click(selector)
  ]);
}

/**
 * Wait for text to appear on page
 */
async function waitForText(page, text, options = {}) {
  await page.waitForFunction(
    text => document.body.innerText.includes(text),
    { timeout: 30000, ...options },
    text
  );
}

/**
 * Take screenshot for debugging
 */
async function takeScreenshot(page, name) {
  await page.screenshot({ 
    path: `__tests__/screenshots/${name}-${Date.now()}.png`,
    fullPage: true
  });
}

/**
 * Check if element exists
 */
async function elementExists(page, selector) {
  try {
    await page.waitForSelector(selector, { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get text content of element
 */
async function getTextContent(page, selector) {
  const element = await waitForElement(page, selector);
  return await page.evaluate(el => el.textContent, element);
}

/**
 * Select language from dropdown
 */
async function selectLanguage(page, language) {
  // Click on language selector
  await page.click('[aria-label*="language"], button:has(.lucide-globe)');
  
  // Wait for dropdown to appear
  await page.waitForSelector('[role="menu"], .language-dropdown', { visible: true });
  
  // Click on the language option
  await page.click(`button[data-language="${language}"], button:has-text("${language}")`);
  
  // Wait for UI to update
  await page.waitForTimeout(1000);
}

/**
 * Check if chat interface is loaded
 */
async function isChatInterfaceLoaded(page) {
  const elements = [
    '.chat-interface, [data-testid="chat-interface"]',
    '.chat-input, textarea[placeholder*="Nachricht"], textarea[placeholder*="message"]',
    '.step-indicator, [data-testid="step-indicator"]'
  ];
  
  for (const selector of elements) {
    if (!await elementExists(page, selector)) {
      return false;
    }
  }
  return true;
}

/**
 * Send message in chat
 */
async function sendChatMessage(page, message) {
  // Find and focus the chat input
  const inputSelector = 'textarea[placeholder*="Nachricht"], textarea[placeholder*="message"], .chat-input textarea';
  await typeIntoField(page, inputSelector, message);
  
  // Send the message
  const sendButton = 'button[aria-label*="send"], button:has(.lucide-send)';
  await page.click(sendButton);
  
  // Wait for response
  await page.waitForTimeout(2000);
}

/**
 * Measure page load time
 */
async function measureLoadTime(page, url) {
  const startTime = Date.now();
  await page.goto(url, { waitUntil: 'networkidle2' });
  const endTime = Date.now();
  return endTime - startTime;
}

module.exports = {
  TEST_URL,
  waitForElement,
  typeIntoField,
  clickAndNavigate,
  waitForText,
  takeScreenshot,
  elementExists,
  getTextContent,
  selectLanguage,
  isChatInterfaceLoaded,
  sendChatMessage,
  measureLoadTime
};