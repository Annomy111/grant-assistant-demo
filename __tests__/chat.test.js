const {
  TEST_URL,
  waitForElement,
  waitForText,
  elementExists,
  getTextContent,
  typeIntoField,
  sendChatMessage,
  isChatInterfaceLoaded
} = require('./utils/test-helpers');

describe('Chat Interface Tests', () => {
  
  beforeEach(async () => {
    // Navigate to landing page
    await page.goto(TEST_URL, { waitUntil: 'networkidle2' });
    
    // Click start button to enter chat
    const startButton = await waitForElement(page, 'button:has-text("Jetzt Antrag erstellen")');
    await startButton.click();
    
    // Wait for chat interface to load
    await page.waitForTimeout(2000);
  });

  test('should load chat interface successfully', async () => {
    // Check if chat interface is loaded
    const isLoaded = await isChatInterfaceLoaded(page);
    expect(isLoaded).toBe(true);
    
    // Check for welcome message
    await waitForText(page, 'Willkommen beim KI-Antragsassistenten');
  });

  test('should display step indicator', async () => {
    // Check for step indicator
    const stepIndicator = await elementExists(page, '.step-indicator, [class*="StepIndicator"]');
    expect(stepIndicator).toBe(true);
    
    // Check for all steps
    const steps = [
      'Grundlagen',
      'Excellence', 
      'Impact',
      'Implementation',
      'Überprüfung'
    ];
    
    for (const step of steps) {
      await waitForText(page, step);
    }
    
    // Check current step is highlighted
    const currentStep = await page.$('.bg-blue-500, .text-blue-600');
    expect(currentStep).toBeTruthy();
  });

  test('should have working chat input', async () => {
    // Find chat input
    const inputSelector = 'textarea[placeholder*="Nachricht"], textarea[placeholder*="message"]';
    const chatInput = await waitForElement(page, inputSelector);
    expect(chatInput).toBeTruthy();
    
    // Type a message
    await typeIntoField(page, inputSelector, 'Test-Organisation');
    
    // Check if text was entered
    const inputValue = await page.$eval(inputSelector, el => el.value);
    expect(inputValue).toBe('Test-Organisation');
  });

  test('should send and receive messages', async () => {
    // Send a test message
    await sendChatMessage(page, 'Unsere Organisation heißt TestOrg');
    
    // Check if message appears in chat
    await waitForText(page, 'TestOrg');
    
    // Wait for AI response
    await page.waitForTimeout(3000);
    
    // Check if there's a response
    const messages = await page.$$('.flex.gap-3.p-4.rounded-lg');
    expect(messages.length).toBeGreaterThan(1);
  });

  test('should display quick action buttons', async () => {
    // Check for quick action buttons
    const quickActions = await elementExists(page, '.flex.gap-2.overflow-x-auto');
    expect(quickActions).toBe(true);
    
    // Check specific actions
    const actions = ['Hilfe', 'Beispiel zeigen', 'Überspringen', 'Überprüfen'];
    for (const action of actions) {
      const button = await page.$(`button:has-text("${action}")`);
      expect(button).toBeTruthy();
    }
  });

  test('should handle quick action clicks', async () => {
    // Click help button
    const helpButton = await page.$('button:has-text("Hilfe")');
    await helpButton.click();
    
    // Wait for message to be sent
    await page.waitForTimeout(1000);
    
    // Check if help message was sent
    await waitForText(page, 'Ich brauche Hilfe');
  });

  test('should show send button', async () => {
    // Check for send button
    const sendButton = await page.$('button:has(svg.lucide-send)');
    expect(sendButton).toBeTruthy();
    
    // Check button is disabled when input is empty
    const inputSelector = 'textarea[placeholder*="Nachricht"]';
    await page.$eval(inputSelector, el => el.value = '');
    
    const isDisabled = await page.$eval(
      'button:has(svg.lucide-send)',
      button => button.disabled
    );
    expect(isDisabled).toBe(true);
    
    // Check button is enabled when input has text
    await typeIntoField(page, inputSelector, 'Test');
    const isEnabled = await page.$eval(
      'button:has(svg.lucide-send)',
      button => !button.disabled
    );
    expect(isEnabled).toBe(true);
  });

  test('should show microphone button', async () => {
    // Check for microphone button
    const micButton = await page.$('button:has(svg.lucide-mic)');
    expect(micButton).toBeTruthy();
  });

  test('should show attachment button', async () => {
    // Check for attachment button
    const attachButton = await page.$('button[title*="anhängen"], button:has(svg.lucide-paperclip)');
    expect(attachButton).toBeTruthy();
  });

  test('should display chat messages with proper styling', async () => {
    // Send a message
    await sendChatMessage(page, 'Test message');
    
    // Check user message styling
    const userMessage = await page.$('.bg-blue-50');
    expect(userMessage).toBeTruthy();
    
    // Check assistant message styling
    const assistantMessage = await page.$('.bg-gray-50');
    expect(assistantMessage).toBeTruthy();
    
    // Check message icons
    const userIcon = await page.$('.bg-blue-500:has(svg.lucide-user)');
    expect(userIcon).toBeTruthy();
    
    const botIcon = await page.$('.bg-gray-600:has(svg.lucide-bot)');
    expect(botIcon).toBeTruthy();
  });

  test('should show timestamps on messages', async () => {
    // Check for timestamp
    const timestamp = await page.$('.text-xs.text-gray-500');
    expect(timestamp).toBeTruthy();
    
    // Check timestamp format (should contain :)
    const timeText = await getTextContent(page, '.text-xs.text-gray-500');
    expect(timeText).toMatch(/\d{1,2}:\d{2}/);
  });

  test('should handle multiline input', async () => {
    const inputSelector = 'textarea[placeholder*="Nachricht"]';
    
    // Type multiline message
    await typeIntoField(page, inputSelector, 'Line 1');
    await page.keyboard.down('Shift');
    await page.keyboard.press('Enter');
    await page.keyboard.up('Shift');
    await page.type('Line 2');
    
    // Check if both lines are in the input
    const inputValue = await page.$eval(inputSelector, el => el.value);
    expect(inputValue).toContain('Line 1');
    expect(inputValue).toContain('Line 2');
  });

  test('should clear input after sending message', async () => {
    const inputSelector = 'textarea[placeholder*="Nachricht"]';
    
    // Type and send message
    await typeIntoField(page, inputSelector, 'Test message');
    const sendButton = await page.$('button:has(svg.lucide-send)');
    await sendButton.click();
    
    // Wait for message to be sent
    await page.waitForTimeout(1000);
    
    // Check input is cleared
    const inputValue = await page.$eval(inputSelector, el => el.value);
    expect(inputValue).toBe('');
  });

  test('should scroll to bottom on new messages', async () => {
    // Send multiple messages
    for (let i = 0; i < 3; i++) {
      await sendChatMessage(page, `Message ${i + 1}`);
      await page.waitForTimeout(1000);
    }
    
    // Check if scrolled to bottom
    const isScrolledToBottom = await page.evaluate(() => {
      const container = document.querySelector('.overflow-y-auto');
      if (!container) return false;
      return Math.abs(container.scrollHeight - container.scrollTop - container.clientHeight) < 10;
    });
    
    expect(isScrolledToBottom).toBe(true);
  });

  test('should show loading indicator when processing', async () => {
    // Send a message
    const inputSelector = 'textarea[placeholder*="Nachricht"]';
    await typeIntoField(page, inputSelector, 'Test message');
    
    const sendButton = await page.$('button:has(svg.lucide-send)');
    await sendButton.click();
    
    // Check for loading indicator
    const loader = await page.$('.animate-spin, svg.lucide-loader-2');
    expect(loader).toBeTruthy();
  });

  test('should maintain chat history', async () => {
    // Send first message
    await sendChatMessage(page, 'First message');
    await page.waitForTimeout(2000);
    
    // Send second message
    await sendChatMessage(page, 'Second message');
    await page.waitForTimeout(2000);
    
    // Check both messages are visible
    await waitForText(page, 'First message');
    await waitForText(page, 'Second message');
    
    // Count total messages
    const messages = await page.$$('.flex.gap-3.p-4.rounded-lg');
    expect(messages.length).toBeGreaterThanOrEqual(4); // At least 2 user + 2 assistant
  });

  test('should have back button to return to landing', async () => {
    // Check for back button
    const backButton = await page.$('button:has-text("Zurück zur Übersicht")');
    expect(backButton).toBeTruthy();
    
    // Click back button
    await backButton.click();
    await page.waitForTimeout(1000);
    
    // Should be back on landing page
    await waitForText(page, 'KI-Antragsassistent');
    const startButton = await elementExists(page, 'button:has-text("Jetzt Antrag erstellen")');
    expect(startButton).toBe(true);
  });
});