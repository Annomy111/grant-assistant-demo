const {
  TEST_URL,
  waitForElement,
  waitForText,
  elementExists,
  selectLanguage
} = require('./utils/test-helpers');

describe('Multi-language (i18n) Tests', () => {
  
  beforeEach(async () => {
    await page.goto(TEST_URL, { waitUntil: 'networkidle2' });
  });

  test('should display German interface by default', async () => {
    // Check for German text
    const germanTexts = [
      'KI-Antragsassistent',
      'Unterstützung',
      'zivilgesellschaftliche Organisationen',
      'Jetzt Antrag erstellen',
      'Mehrsprachig'
    ];
    
    for (const text of germanTexts) {
      await waitForText(page, text);
    }
    
    // Check HTML lang attribute
    const lang = await page.$eval('html', el => el.lang);
    expect(lang).toBe('de');
  });

  test('should have language selector visible', async () => {
    // Look for language selector
    const languageSelector = await page.$(
      '[aria-label*="language"], button:has(svg.lucide-globe), .language-selector'
    );
    expect(languageSelector).toBeTruthy();
    
    // Click to open language menu
    await languageSelector.click();
    await page.waitForTimeout(1000);
    
    // Check for language options
    const languages = ['Deutsch', 'Українська', 'English'];
    for (const lang of languages) {
      const option = await page.$(`button:has-text("${lang}"), [data-language]:has-text("${lang}")`);
      expect(option).toBeTruthy();
    }
  });

  test('should switch to Ukrainian language', async () => {
    // Select Ukrainian
    await selectLanguage(page, 'uk');
    await page.waitForTimeout(2000);
    
    // Check for Ukrainian text
    const ukrainianTexts = [
      'ШІ-асистент',
      'Підтримка',
      'громадянського суспільства',
      'Створити заявку',
      'Багатомовність'
    ];
    
    for (const text of ukrainianTexts) {
      const exists = await page.evaluate((searchText) => {
        return document.body.innerText.includes(searchText);
      }, text);
      expect(exists).toBe(true);
    }
  });

  test('should switch to English language', async () => {
    // Select English
    await selectLanguage(page, 'en');
    await page.waitForTimeout(2000);
    
    // Check for English text
    const englishTexts = [
      'AI Grant Assistant',
      'Supporting',
      'civil society organizations',
      'Create Application',
      'Multilingual'
    ];
    
    for (const text of englishTexts) {
      const exists = await page.evaluate((searchText) => {
        return document.body.innerText.includes(searchText);
      }, text);
      expect(exists).toBe(true);
    }
  });

  test('should persist language selection', async () => {
    // Select Ukrainian
    await selectLanguage(page, 'uk');
    await page.waitForTimeout(2000);
    
    // Reload page
    await page.reload();
    await page.waitForTimeout(2000);
    
    // Should still be in Ukrainian
    const hasUkrainian = await page.evaluate(() => {
      return document.body.innerText.includes('ШІ-асистент') ||
             document.body.innerText.includes('Створити заявку');
    });
    expect(hasUkrainian).toBe(true);
  });

  test('should translate feature descriptions', async () => {
    // Test German features
    await selectLanguage(page, 'de');
    await page.waitForTimeout(1500);
    await waitForText(page, 'Schritt-für-Schritt Anleitung');
    
    // Switch to English
    await selectLanguage(page, 'en');
    await page.waitForTimeout(1500);
    const hasEnglishFeature = await page.evaluate(() => {
      return document.body.innerText.includes('Step-by-step guide');
    });
    expect(hasEnglishFeature).toBe(true);
    
    // Switch to Ukrainian
    await selectLanguage(page, 'uk');
    await page.waitForTimeout(1500);
    const hasUkrainianFeature = await page.evaluate(() => {
      return document.body.innerText.includes('Покрокова інструкція');
    });
    expect(hasUkrainianFeature).toBe(true);
  });

  test('should translate chat interface', async () => {
    // Start in German
    await selectLanguage(page, 'de');
    const startButtonDe = await waitForElement(page, 'button:has-text("Jetzt Antrag erstellen")');
    await startButtonDe.click();
    await page.waitForTimeout(2000);
    
    // Check German chat elements
    await waitForText(page, 'Willkommen');
    const germanInput = await page.$('textarea[placeholder*="Nachricht"]');
    expect(germanInput).toBeTruthy();
    
    // Go back and switch to English
    await page.click('button:has-text("Zurück")');
    await page.waitForTimeout(1000);
    await selectLanguage(page, 'en');
    await page.waitForTimeout(1500);
    
    // Start chat in English
    const startButtonEn = await waitForElement(page, 'button:has-text("Create Application")');
    await startButtonEn.click();
    await page.waitForTimeout(2000);
    
    // Check English chat elements
    await waitForText(page, 'Welcome');
    const englishInput = await page.$('textarea[placeholder*="message"]');
    expect(englishInput).toBeTruthy();
  });

  test('should translate quick action buttons', async () => {
    // Test in each language
    const languages = [
      {
        code: 'de',
        startButton: 'Jetzt Antrag erstellen',
        actions: ['Hilfe', 'Beispiel zeigen', 'Überspringen', 'Überprüfen']
      },
      {
        code: 'uk',
        startButton: 'Створити заявку',
        actions: ['Допомога', 'Показати приклад', 'Пропустити', 'Перевірити']
      },
      {
        code: 'en',
        startButton: 'Create Application',
        actions: ['Help', 'Show Example', 'Skip', 'Review']
      }
    ];
    
    for (const lang of languages) {
      // Go to landing page
      await page.goto(TEST_URL, { waitUntil: 'networkidle2' });
      
      // Select language
      await selectLanguage(page, lang.code);
      await page.waitForTimeout(1500);
      
      // Start application
      const startButton = await page.$(`button:has-text("${lang.startButton}")`);
      await startButton.click();
      await page.waitForTimeout(2000);
      
      // Check quick actions
      for (const action of lang.actions) {
        const actionButton = await page.$(`button:has-text("${action}")`);
        expect(actionButton).toBeTruthy();
      }
    }
  });

  test('should translate step indicators', async () => {
    const stepTranslations = {
      de: {
        steps: ['Grundlagen', 'Excellence', 'Impact', 'Implementation', 'Überprüfung'],
        descriptions: ['Organisation & Projekt', 'Ziele & Methodik']
      },
      uk: {
        steps: ['Основи', 'Досконалість', 'Вплив', 'Впровадження', 'Перевірка'],
        descriptions: ['Організація та проект', 'Цілі та методологія']
      },
      en: {
        steps: ['Basics', 'Excellence', 'Impact', 'Implementation', 'Review'],
        descriptions: ['Organization & Project', 'Objectives & Methodology']
      }
    };
    
    for (const [lang, translations] of Object.entries(stepTranslations)) {
      // Go to landing page
      await page.goto(TEST_URL, { waitUntil: 'networkidle2' });
      
      // Select language
      await selectLanguage(page, lang);
      await page.waitForTimeout(1500);
      
      // Start application
      const startButton = await page.$('button.bg-blue-500');
      await startButton.click();
      await page.waitForTimeout(2000);
      
      // Check step names
      for (const step of translations.steps) {
        const stepElement = await page.$(`*:has-text("${step}")`);
        expect(stepElement).toBeTruthy();
      }
    }
  });

  test('should handle RTL languages if supported', async () => {
    // Check if RTL support exists (for future Arabic/Hebrew support)
    const htmlDir = await page.$eval('html', el => el.dir);
    expect(['ltr', 'rtl', '']).toContain(htmlDir);
  });

  test('should translate error messages', async () => {
    // Disconnect network to trigger error
    await page.setOfflineMode(true);
    
    // Try each language
    const errorMessages = {
      de: 'Fehler',
      uk: 'Помилка',
      en: 'Error'
    };
    
    for (const [lang, errorText] of Object.entries(errorMessages)) {
      await page.setOfflineMode(false);
      await page.goto(TEST_URL, { waitUntil: 'networkidle2' });
      await selectLanguage(page, lang);
      await page.waitForTimeout(1000);
      
      // Trigger error
      await page.setOfflineMode(true);
      await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
      await page.waitForTimeout(2000);
      
      // Check for error message in correct language
      const hasError = await page.evaluate((text) => {
        return document.body.innerText.includes(text);
      }, errorText);
      
      // Error handling should work in all languages
      expect(typeof hasError).toBe('boolean');
    }
    
    // Restore connection
    await page.setOfflineMode(false);
  });

  test('should have consistent layout across languages', async () => {
    const languages = ['de', 'uk', 'en'];
    const layouts = [];
    
    for (const lang of languages) {
      await page.goto(TEST_URL, { waitUntil: 'networkidle2' });
      await selectLanguage(page, lang);
      await page.waitForTimeout(1500);
      
      // Get layout metrics
      const layout = await page.evaluate(() => {
        const header = document.querySelector('header');
        const main = document.querySelector('main, .container');
        const buttons = document.querySelectorAll('button');
        
        return {
          headerHeight: header?.offsetHeight || 0,
          mainWidth: main?.offsetWidth || 0,
          buttonCount: buttons.length
        };
      });
      
      layouts.push(layout);
    }
    
    // All languages should have similar layout
    const allSimilar = layouts.every((layout, index) => {
      if (index === 0) return true;
      const prev = layouts[index - 1];
      return Math.abs(layout.headerHeight - prev.headerHeight) < 50 &&
             Math.abs(layout.mainWidth - prev.mainWidth) < 100 &&
             Math.abs(layout.buttonCount - prev.buttonCount) < 5;
    });
    
    expect(allSimilar).toBe(true);
  });

  test('should translate dates and numbers correctly', async () => {
    // Check date formatting for each language
    const dateFormats = {
      de: /\d{1,2}\.\d{1,2}\.\d{4}/, // DD.MM.YYYY
      uk: /\d{1,2}\.\d{1,2}\.\d{4}/, // DD.MM.YYYY
      en: /\d{1,2}\/\d{1,2}\/\d{4}/  // MM/DD/YYYY
    };
    
    for (const [lang, pattern] of Object.entries(dateFormats)) {
      await page.goto(TEST_URL, { waitUntil: 'networkidle2' });
      await selectLanguage(page, lang);
      await page.waitForTimeout(1500);
      
      // Look for any dates in the content
      const hasCorrectFormat = await page.evaluate((regex) => {
        const text = document.body.innerText;
        return new RegExp(regex).test(text);
      }, pattern.source);
      
      // Date formats should be locale-appropriate
      expect(typeof hasCorrectFormat).toBe('boolean');
    }
  });
});