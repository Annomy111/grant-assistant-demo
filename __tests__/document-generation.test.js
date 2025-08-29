const {
  TEST_URL,
  waitForElement,
  elementExists,
  takeScreenshot
} = require('./utils/test-helpers');

describe('Document Generation Tests', () => {
  
  beforeAll(async () => {
    await page.goto(`${TEST_URL}/test-document`, { waitUntil: 'networkidle2' });
  });

  test('should load test document page', async () => {
    // Check page title
    const heading = await waitForElement(page, 'h1');
    const headingText = await page.evaluate(el => el.textContent, heading);
    expect(headingText).toBe('Document Generation Test');
  });

  test('should display project context information', async () => {
    // Check project context section exists
    const contextSection = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h2'));
      return headings.some(h => h.textContent.includes('Test Project Context'));
    });
    expect(contextSection).toBe(true);
    
    // Check project title is displayed
    const projectTitle = await page.evaluate(() => {
      const content = document.body.textContent;
      return content.includes('Supporting Ukrainian Children Affected by War');
    });
    expect(projectTitle).toBe(true);
    
    // Check consortium partners are listed
    const germanPartner = await page.evaluate(() => {
      const content = document.body.textContent;
      return content.includes('German-Ukrainian Bureau');
    });
    expect(germanPartner).toBe(true);
    
    const ukrainianPartner = await page.evaluate(() => {
      const content = document.body.textContent;
      return content.includes('Ukrainian Child Protection Foundation');
    });
    expect(ukrainianPartner).toBe(true);
  });

  test('should display template information', async () => {
    // Check template info section
    const templateInfo = await page.evaluate(() => {
      const content = document.body.textContent;
      return content.includes('CERV-2025-CHILD');
    });
    expect(templateInfo).toBe(true);
    
    // Check deadline is shown
    const deadline = await page.evaluate(() => {
      const content = document.body.textContent;
      return content.includes('29 April 2025');
    });
    expect(deadline).toBe(true);
  });

  test('should have document export button', async () => {
    // Look for export button
    const exportButton = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.some(btn => 
        btn.textContent.includes('Export Document') ||
        btn.textContent.includes('Dokument exportieren')
      );
    });
    expect(exportButton).toBe(true);
  });

  test('should show export format options when clicked', async () => {
    // Find and click export button
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const exportBtn = buttons.find(btn => 
        btn.textContent.includes('Export Document') ||
        btn.textContent.includes('Dokument exportieren')
      );
      if (exportBtn) exportBtn.click();
    });
    
    // Wait a moment for dropdown to appear
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if format options are shown
    const wordOption = await page.evaluate(() => {
      const content = document.body.textContent;
      return content.includes('Word (DOCX)');
    });
    const pdfOption = await page.evaluate(() => {
      const content = document.body.textContent;
      return content.includes('PDF');
    });
    const htmlOption = await page.evaluate(() => {
      const content = document.body.textContent;
      return content.includes('HTML');
    });
    
    expect(wordOption).toBe(true);
    expect(pdfOption).toBe(true);
    expect(htmlOption).toBe(true);
  });

  test('should handle document export request', async () => {
    // Set up request interception to monitor API calls
    await page.setRequestInterception(true);
    let documentApiCalled = false;
    
    page.on('request', request => {
      if (request.url().includes('/api/documents')) {
        documentApiCalled = true;
      }
      request.continue();
    });
    
    // Try to export a document (PDF)
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const pdfButton = buttons.find(btn => 
        btn.textContent.includes('PDF') && 
        !btn.textContent.includes('DOCX')
      );
      if (pdfButton) pdfButton.click();
    });
    
    // Wait for potential API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if API was called
    expect(documentApiCalled).toBe(true);
    
    // Clean up
    await page.setRequestInterception(false);
  });

  test('should display test information section', async () => {
    const testInfo = await page.evaluate(() => {
      const content = document.body.textContent;
      return content.includes('Test Information') && 
             content.includes('CERV-2025-CHILD');
    });
    expect(testInfo).toBe(true);
  });

  afterAll(async () => {
    // Take screenshot for debugging
    await takeScreenshot(page, 'document-generation-final');
  });
});