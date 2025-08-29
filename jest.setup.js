// Set default timeout for all tests
jest.setTimeout(60000);

// Configure Puppeteer page settings
beforeEach(async () => {
  // Set viewport for consistent testing
  await page.setViewport({ width: 1280, height: 720 });
  
  // Set user agent to avoid bot detection
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );
  
  // Enable console logging for debugging
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('Page Error:', msg.text());
    }
  });
  
  // Enable request interception for monitoring
  page.on('requestfailed', request => {
    console.error('Request failed:', request.url(), request.failure().errorText);
  });
});

// Clean up after each test
afterEach(async () => {
  // Clear cookies and local storage
  const client = await page.target().createCDPSession();
  await client.send('Network.clearBrowserCookies');
  await page.evaluate(() => localStorage.clear());
});