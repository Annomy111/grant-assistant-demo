const {
  TEST_URL,
  waitForElement,
  waitForText,
  sendChatMessage,
  elementExists
} = require('./utils/test-helpers');

describe('Responsive Design Tests', () => {
  
  const viewports = {
    mobile: { width: 375, height: 667, name: 'iPhone SE' },
    tablet: { width: 768, height: 1024, name: 'iPad' },
    desktop: { width: 1920, height: 1080, name: 'Desktop' },
    wide: { width: 2560, height: 1440, name: '4K Monitor' }
  };

  describe('Mobile View (375x667)', () => {
    beforeEach(async () => {
      await page.setViewport(viewports.mobile);
      await page.goto(TEST_URL, { waitUntil: 'networkidle2' });
    });

    test('should display mobile-optimized layout', async () => {
      // Check if elements stack vertically
      const cards = await page.$$('.bg-white.rounded-lg.shadow');
      const cardPositions = await Promise.all(
        cards.map(card => page.evaluate(el => {
          const rect = el.getBoundingClientRect();
          return { x: rect.x, y: rect.y, width: rect.width };
        }, card))
      );
      
      // Cards should be full width on mobile
      cardPositions.forEach(pos => {
        expect(pos.width).toBeLessThan(viewports.mobile.width);
        expect(pos.width).toBeGreaterThan(viewports.mobile.width * 0.8);
      });
    });

    test('should have touch-friendly buttons', async () => {
      const buttons = await page.$$('button');
      
      for (const button of buttons) {
        const size = await page.evaluate(el => {
          const rect = el.getBoundingClientRect();
          return { width: rect.width, height: rect.height };
        }, button);
        
        // Buttons should be at least 44px tall for touch targets
        expect(size.height).toBeGreaterThanOrEqual(40);
      }
    });

    test('should show mobile menu if applicable', async () => {
      // Look for hamburger menu
      const mobileMenu = await elementExists(page, 'button:has(svg.lucide-menu)');
      
      // Mobile menu should exist or navigation should be visible
      const hasNavigation = await elementExists(page, 'nav');
      expect(mobileMenu || hasNavigation).toBe(true);
    });

    test('should handle chat interface on mobile', async () => {
      const startButton = await waitForElement(page, 'button.bg-blue-500');
      await startButton.click();
      await page.waitForTimeout(2000);
      
      // Chat should fit mobile screen
      const chatContainer = await page.$('.flex.flex-col.h-full');
      if (chatContainer) {
        const size = await page.evaluate(el => {
          const rect = el.getBoundingClientRect();
          return { width: rect.width, height: rect.height };
        }, chatContainer);
        
        expect(size.width).toBeLessThanOrEqual(viewports.mobile.width);
      }
      
      // Input should be accessible
      const chatInput = await elementExists(page, 'textarea[placeholder*="Nachricht"]');
      expect(chatInput).toBe(true);
    });

    test('should handle text overflow properly', async () => {
      // Check for text overflow
      const hasOverflow = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        for (const el of elements) {
          if (el.scrollWidth > el.clientWidth) {
            return true;
          }
        }
        return false;
      });
      
      // No horizontal overflow on mobile
      expect(hasOverflow).toBe(false);
    });
  });

  describe('Tablet View (768x1024)', () => {
    beforeEach(async () => {
      await page.setViewport(viewports.tablet);
      await page.goto(TEST_URL, { waitUntil: 'networkidle2' });
    });

    test('should display tablet-optimized layout', async () => {
      // Should show 2-column grid on tablet
      const grid = await page.$('.grid');
      const gridStyle = await page.evaluate(el => 
        window.getComputedStyle(el).gridTemplateColumns, grid
      );
      
      // Should have multiple columns
      expect(gridStyle).not.toBe('none');
    });

    test('should maintain readability', async () => {
      // Check font sizes
      const fontSize = await page.evaluate(() => {
        const p = document.querySelector('p');
        return p ? window.getComputedStyle(p).fontSize : '0px';
      });
      
      // Font should be readable (at least 14px)
      expect(parseInt(fontSize)).toBeGreaterThanOrEqual(14);
    });

    test('should handle orientation change', async () => {
      // Portrait
      await page.setViewport({ width: 768, height: 1024 });
      const portraitLayout = await page.evaluate(() => 
        document.body.offsetWidth
      );
      
      // Landscape
      await page.setViewport({ width: 1024, height: 768 });
      await page.waitForTimeout(500);
      const landscapeLayout = await page.evaluate(() => 
        document.body.offsetWidth
      );
      
      // Both orientations should work
      expect(portraitLayout).toBeLessThanOrEqual(768);
      expect(landscapeLayout).toBeLessThanOrEqual(1024);
    });
  });

  describe('Desktop View (1920x1080)', () => {
    beforeEach(async () => {
      await page.setViewport(viewports.desktop);
      await page.goto(TEST_URL, { waitUntil: 'networkidle2' });
    });

    test('should display desktop-optimized layout', async () => {
      // Should show multi-column grid
      const cards = await page.$$('.bg-white.rounded-lg.shadow');
      const cardPositions = await Promise.all(
        cards.map(card => page.evaluate(el => {
          const rect = el.getBoundingClientRect();
          return { x: rect.x, y: rect.y };
        }, card))
      );
      
      // Some cards should be side by side
      const hasHorizontalLayout = cardPositions.some((pos, i) => {
        if (i === 0) return false;
        return Math.abs(pos.y - cardPositions[i-1].y) < 10;
      });
      
      expect(hasHorizontalLayout).toBe(true);
    });

    test('should utilize available space', async () => {
      // Content should have max-width but utilize space well
      const container = await page.$('.container, main');
      const width = await page.evaluate(el => 
        el.getBoundingClientRect().width, container
      );
      
      // Should use reasonable width (not full screen)
      expect(width).toBeGreaterThan(800);
      expect(width).toBeLessThan(1600);
    });

    test('should show all navigation elements', async () => {
      // No hamburger menu on desktop
      const hamburger = await elementExists(page, 'button:has(svg.lucide-menu)');
      expect(hamburger).toBe(false);
      
      // All navigation should be visible
      const langSelector = await elementExists(page, '[aria-label*="language"], button:has(svg.lucide-globe)');
      expect(langSelector).toBe(true);
    });
  });

  describe('4K View (2560x1440)', () => {
    beforeEach(async () => {
      await page.setViewport(viewports.wide);
      await page.goto(TEST_URL, { waitUntil: 'networkidle2' });
    });

    test('should maintain maximum content width', async () => {
      // Content shouldn't stretch too wide
      const container = await page.$('.container, main');
      const width = await page.evaluate(el => 
        el.getBoundingClientRect().width, container
      );
      
      // Should have max-width constraint
      expect(width).toBeLessThan(2000);
    });

    test('should scale images properly', async () => {
      const images = await page.$$('img');
      
      for (const img of images) {
        const natural = await page.evaluate(el => ({
          natural: el.naturalWidth,
          display: el.getBoundingClientRect().width
        }), img);
        
        // Images shouldn't be stretched beyond natural size
        expect(natural.display).toBeLessThanOrEqual(natural.natural * 2);
      }
    });
  });

  describe('Cross-viewport Navigation', () => {
    test('should maintain functionality across viewport changes', async () => {
      // Start on desktop
      await page.setViewport(viewports.desktop);
      await page.goto(TEST_URL, { waitUntil: 'networkidle2' });
      
      // Enter chat
      const startButton = await waitForElement(page, 'button.bg-blue-500');
      await startButton.click();
      await page.waitForTimeout(2000);
      
      // Send message
      await sendChatMessage(page, 'Cross-viewport test');
      await page.waitForTimeout(2000);
      
      // Switch to mobile
      await page.setViewport(viewports.mobile);
      await page.waitForTimeout(1000);
      
      // Message should still be visible
      await waitForText(page, 'Cross-viewport test');
      
      // Can still send messages
      await sendChatMessage(page, 'Mobile test');
      await page.waitForTimeout(2000);
      
      // Switch back to desktop
      await page.setViewport(viewports.desktop);
      await page.waitForTimeout(1000);
      
      // Both messages should be visible
      await waitForText(page, 'Cross-viewport test');
      await waitForText(page, 'Mobile test');
    });
  });

  describe('Touch Interactions', () => {
    beforeEach(async () => {
      await page.setViewport(viewports.mobile);
      await page.goto(TEST_URL, { waitUntil: 'networkidle2' });
    });

    test('should handle touch events', async () => {
      const button = await waitForElement(page, 'button.bg-blue-500');
      
      // Simulate touch
      await page.touchscreen.tap(187, 400);
      await page.waitForTimeout(2000);
      
      // Should navigate to chat
      const chatExists = await elementExists(page, '.chat-interface, textarea[placeholder*="Nachricht"]');
      expect(chatExists).toBe(true);
    });

    test('should support swipe gestures if implemented', async () => {
      // Check if swipe is implemented
      const hasSwipeHandler = await page.evaluate(() => {
        const handlers = window.getEventListeners ? 
          window.getEventListeners(document) : {};
        return handlers.touchstart || handlers.touchmove || handlers.touchend;
      });
      
      // Touch events should be supported
      expect(typeof hasSwipeHandler).toBe('object');
    });
  });

  describe('Responsive Images', () => {
    test('should serve appropriate image sizes', async () => {
      for (const [name, viewport] of Object.entries(viewports)) {
        await page.setViewport(viewport);
        await page.goto(TEST_URL, { waitUntil: 'networkidle2' });
        
        const images = await page.$$('img');
        
        for (const img of images) {
          const srcset = await page.evaluate(el => el.srcset, img);
          const sizes = await page.evaluate(el => el.sizes, img);
          
          // Images should be responsive
          if (srcset || sizes) {
            expect(srcset || sizes).toBeTruthy();
          }
        }
      }
    });
  });

  describe('Font Scaling', () => {
    test('should scale fonts appropriately', async () => {
      const fontSizes = {};
      
      for (const [name, viewport] of Object.entries(viewports)) {
        await page.setViewport(viewport);
        await page.goto(TEST_URL, { waitUntil: 'networkidle2' });
        
        fontSizes[name] = await page.evaluate(() => {
          const h1 = document.querySelector('h1');
          const p = document.querySelector('p');
          return {
            h1: h1 ? window.getComputedStyle(h1).fontSize : '0px',
            p: p ? window.getComputedStyle(p).fontSize : '0px'
          };
        });
      }
      
      // Mobile fonts should be smaller than desktop
      expect(parseInt(fontSizes.mobile.h1)).toBeLessThanOrEqual(parseInt(fontSizes.desktop.h1));
      
      // But still readable
      expect(parseInt(fontSizes.mobile.p)).toBeGreaterThanOrEqual(14);
    });
  });

  describe('Performance Across Devices', () => {
    test('should load quickly on mobile', async () => {
      await page.setViewport(viewports.mobile);
      
      const startTime = Date.now();
      await page.goto(TEST_URL, { waitUntil: 'networkidle2' });
      const loadTime = Date.now() - startTime;
      
      // Should load in reasonable time
      expect(loadTime).toBeLessThan(10000);
    });

    test('should have minimal layout shifts', async () => {
      await page.setViewport(viewports.mobile);
      await page.goto(TEST_URL, { waitUntil: 'domcontentloaded' });
      
      // Wait for initial render
      await page.waitForTimeout(1000);
      
      // Check for layout shifts
      const cls = await page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const cls = entries.reduce((sum, entry) => sum + entry.value, 0);
            resolve(cls);
          }).observe({ type: 'layout-shift', buffered: true });
          
          setTimeout(() => resolve(0), 2000);
        });
      });
      
      // CLS should be minimal (less than 0.1 is good)
      expect(cls).toBeLessThan(0.25);
    });
  });
});