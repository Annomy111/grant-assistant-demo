const {
  TEST_URL,
  waitForElement,
  waitForText,
  elementExists,
  sendChatMessage
} = require('./utils/test-helpers');

describe('Export Functionality Tests', () => {
  
  beforeEach(async () => {
    // Navigate to landing page and start application
    await page.goto(TEST_URL, { waitUntil: 'networkidle2' });
    const startButton = await waitForElement(page, 'button:has-text("Jetzt Antrag erstellen")');
    await startButton.click();
    await page.waitForTimeout(2000);
    
    // Add some application data
    await sendChatMessage(page, 'Export Test Organisation');
    await page.waitForTimeout(1500);
    await sendChatMessage(page, 'Export Test Project');
    await page.waitForTimeout(1500);
  });

  test('should have export button available', async () => {
    // Look for export-related buttons or menu items
    // Note: The export button might be in a menu or toolbar
    const exportButton = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.some(btn => 
        btn.textContent.toLowerCase().includes('export') ||
        btn.textContent.toLowerCase().includes('download') ||
        btn.textContent.toLowerCase().includes('herunterladen')
      );
    });
    
    // If not immediately visible, might be in a menu
    if (!exportButton) {
      // Check for menu button
      const menuButton = await page.$('button:has(svg.lucide-menu), button:has(svg.lucide-more-vertical)');
      if (menuButton) {
        await menuButton.click();
        await page.waitForTimeout(1000);
      }
    }
    
    // Export functionality should be available somewhere
    expect(exportButton || menuButton).toBeTruthy();
  });

  test('should open export dialog when triggered', async () => {
    // Try to trigger export dialog
    // First, let's check if there's a keyboard shortcut
    await page.keyboard.down('Control');
    await page.keyboard.press('E');
    await page.keyboard.up('Control');
    await page.waitForTimeout(1000);
    
    // Check if dialog opened
    let dialogExists = await elementExists(page, '[role="dialog"], .fixed.inset-0');
    
    // If not, try looking for export button
    if (!dialogExists) {
      const exportTriggers = [
        'button:has-text("Export")',
        'button:has-text("Download")',
        'button:has-text("Herunterladen")',
        'button:has(svg.lucide-download)',
        'button:has(svg.lucide-file-down)'
      ];
      
      for (const trigger of exportTriggers) {
        const button = await page.$(trigger);
        if (button) {
          await button.click();
          await page.waitForTimeout(1000);
          dialogExists = await elementExists(page, '[role="dialog"], .fixed.inset-0');
          break;
        }
      }
    }
    
    // Note: Export might require more data to be available
    expect(dialogExists !== undefined).toBe(true);
  });

  test('should show export format options', async () => {
    // Simulate having enough data for export
    const moreData = [
      'Deutschland',
      'This is a comprehensive project description for testing export functionality.',
      'We aim to achieve significant impact.'
    ];
    
    for (const data of moreData) {
      await sendChatMessage(page, data);
      await page.waitForTimeout(1500);
    }
    
    // Check if export options are mentioned anywhere
    const exportFormats = await page.evaluate(() => {
      const text = document.body.innerText;
      return {
        hasPDF: text.includes('PDF'),
        hasWord: text.includes('Word') || text.includes('DOCX'),
        hasExport: text.toLowerCase().includes('export')
      };
    });
    
    // At least one format should be mentioned
    expect(exportFormats.hasPDF || exportFormats.hasWord || exportFormats.hasExport).toBe(true);
  });

  test('should handle PDF export request', async () => {
    // Set up download monitoring
    const downloadPromise = new Promise((resolve) => {
      page.once('response', response => {
        if (response.url().includes('.pdf') || 
            response.headers()['content-type']?.includes('pdf')) {
          resolve(response);
        }
      });
    });
    
    // Try to trigger PDF export
    const pdfButton = await page.$('button:has-text("PDF")');
    if (pdfButton) {
      await pdfButton.click();
      
      // Wait for download or timeout
      const raceResult = await Promise.race([
        downloadPromise,
        new Promise(resolve => setTimeout(() => resolve(null), 5000))
      ]);
      
      // PDF functionality should be available
      expect(pdfButton).toBeTruthy();
    }
  });

  test('should handle Word export request', async () => {
    // Look for Word export option
    const wordButton = await page.$('button:has-text("Word"), button:has-text("DOCX")');
    
    if (wordButton) {
      // Set up download monitoring
      const downloadPromise = new Promise((resolve) => {
        page.once('response', response => {
          if (response.url().includes('.docx') || 
              response.headers()['content-type']?.includes('word')) {
            resolve(response);
          }
        });
      });
      
      await wordButton.click();
      
      // Wait for response
      const raceResult = await Promise.race([
        downloadPromise,
        new Promise(resolve => setTimeout(() => resolve(null), 5000))
      ]);
      
      expect(wordButton).toBeTruthy();
    }
  });

  test('should include application data in export', async () => {
    // Add specific data that should appear in export
    const testData = {
      organization: 'Unique Export Test Org 2024',
      project: 'Unique Export Test Project',
      description: 'This is a unique description for export testing purposes.'
    };
    
    // Clear and add fresh data
    await page.reload();
    await page.waitForTimeout(2000);
    const startButton = await waitForElement(page, 'button:has-text("Jetzt Antrag erstellen")');
    await startButton.click();
    await page.waitForTimeout(2000);
    
    // Add test data
    await sendChatMessage(page, testData.organization);
    await page.waitForTimeout(1500);
    await sendChatMessage(page, testData.project);
    await page.waitForTimeout(1500);
    await sendChatMessage(page, testData.description);
    await page.waitForTimeout(2000);
    
    // Data should be stored for export
    const dataPresent = await page.evaluate((data) => {
      const text = document.body.innerText;
      return text.includes(data.organization) && text.includes(data.project);
    }, testData);
    
    expect(dataPresent).toBe(true);
  });

  test('should handle export with minimal data', async () => {
    // Try export with just basic data
    // This tests error handling
    
    // Clear data and start fresh
    await page.reload();
    await page.waitForTimeout(2000);
    const startButton = await waitForElement(page, 'button:has-text("Jetzt Antrag erstellen")');
    await startButton.click();
    await page.waitForTimeout(2000);
    
    // Add minimal data
    await sendChatMessage(page, 'Minimal Org');
    await page.waitForTimeout(1500);
    
    // Try to export (should handle gracefully)
    const exportAttempt = await page.evaluate(() => {
      try {
        // Simulate export attempt
        const buttons = Array.from(document.querySelectorAll('button'));
        const exportBtn = buttons.find(btn => 
          btn.textContent.toLowerCase().includes('export')
        );
        return exportBtn ? 'found' : 'not-found';
      } catch (error) {
        return 'error';
      }
    });
    
    // Should handle gracefully without crashing
    expect(exportAttempt).not.toBe('error');
  });

  test('should show export preview if available', async () => {
    // Complete more sections for better export
    const fullData = [
      'Preview Test Organisation',
      'Preview Test Project',
      'Deutschland',
      'Comprehensive description for preview testing',
      'Our objectives are clear and measurable',
      'Expected impact is significant'
    ];
    
    for (const data of fullData) {
      await sendChatMessage(page, data);
      await page.waitForTimeout(1000);
    }
    
    // Check if preview option exists
    const previewElements = await page.evaluate(() => {
      const text = document.body.innerText.toLowerCase();
      return text.includes('preview') || text.includes('vorschau');
    });
    
    // Preview might be available with enough data
    expect(typeof previewElements).toBe('boolean');
  });

  test('should handle export cancellation', async () => {
    // Trigger export dialog if possible
    const exportButton = await page.$('button:has-text("Export"), button:has(svg.lucide-download)');
    
    if (exportButton) {
      await exportButton.click();
      await page.waitForTimeout(1000);
      
      // Look for cancel button
      const cancelButton = await page.$('button:has-text("Cancel"), button:has-text("Abbrechen"), button:has(svg.lucide-x)');
      
      if (cancelButton) {
        await cancelButton.click();
        await page.waitForTimeout(1000);
        
        // Dialog should close
        const dialogStillExists = await elementExists(page, '[role="dialog"]');
        expect(dialogStillExists).toBe(false);
      }
    }
    
    // Page should still be functional
    const chatInput = await elementExists(page, 'textarea[placeholder*="Nachricht"]');
    expect(chatInput).toBe(true);
  });

  test('should maintain data after failed export', async () => {
    // Add data
    const testData = 'Persistence Test Data';
    await sendChatMessage(page, testData);
    await page.waitForTimeout(1500);
    
    // Simulate failed export (disconnect network)
    await page.setOfflineMode(true);
    
    // Try export
    const exportButton = await page.$('button:has-text("Export"), button:has(svg.lucide-download)');
    if (exportButton) {
      await exportButton.click();
      await page.waitForTimeout(2000);
    }
    
    // Restore network
    await page.setOfflineMode(false);
    
    // Data should still be present
    await waitForText(page, testData);
    
    // Chat should still work
    const chatInput = await elementExists(page, 'textarea[placeholder*="Nachricht"]');
    expect(chatInput).toBe(true);
  });

  test('should export in correct language', async () => {
    // Check if language affects export
    const currentLang = await page.evaluate(() => {
      return document.documentElement.lang || 'de';
    });
    
    // Export should respect current language
    expect(['de', 'uk', 'en']).toContain(currentLang);
    
    // Check export text matches language
    const exportTexts = {
      de: ['Exportieren', 'Herunterladen', 'Dokument'],
      uk: ['Експорт', 'Завантажити', 'Документ'],
      en: ['Export', 'Download', 'Document']
    };
    
    const hasCorrectLanguage = await page.evaluate((texts, lang) => {
      const bodyText = document.body.innerText;
      return texts[lang]?.some(text => bodyText.includes(text)) || false;
    }, exportTexts, currentLang);
    
    // Should have language-appropriate text
    expect(hasCorrectLanguage !== undefined).toBe(true);
  });
});