import { test, expect, Page } from '@playwright/test';

test.describe('External Links Checker', () => {
  test('should verify all external links from menu pages return status 200', async ({ page, context }) => {
    // Increase test timeout to 10 minutes for checking all links
    test.setTimeout(600000);
    
    const baseURL = 'https://www.stgrijnijssel.nl';
    const visitedPages = new Set<string>();
    const checkedLinks = new Set<string>(); // Track already checked external links
    const brokenLinks: Array<{ page: string; link: string; status: number | string }> = [];
    
    // Step 1: Navigate to homepage
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    
    // Step 2: Extract all menu links (including submenu items)
    const menuLinks = await extractMenuLinks(page, baseURL);
    console.log(`Found ${menuLinks.length} menu links to check`);
    
    // Step 3: Visit each menu page and check external links
    for (const menuLink of menuLinks) {
      if (visitedPages.has(menuLink)) {
        console.log(`Skipping already visited: ${menuLink}`);
        continue;
      }
      
      console.log(`\nChecking page: ${menuLink}`);
      await page.goto(menuLink, { waitUntil: 'networkidle' });
      visitedPages.add(menuLink);
      
      // Extract all external links from this page
      const externalLinks = await extractExternalLinks(page, baseURL);
      console.log(`  Found ${externalLinks.length} external links on this page`);
      
      // Check each external link
      for (const externalLink of externalLinks) {
        // Skip if already checked
        if (checkedLinks.has(externalLink)) {
          console.log(`  Skipping already checked: ${externalLink}`);
          continue;
        }
        
        console.log(`  Checking external link: ${externalLink}`);
        checkedLinks.add(externalLink); // Mark as checked
        
        let isValid = false;
        let statusInfo: number | string = '';
        
        try {
          // First, try automated request
          const response = await context.request.get(externalLink, {
            timeout: 30000, // 30 seconds timeout
            maxRedirects: 10, // Allow redirects
          });
          
          if (response.status() === 200) {
            console.log(`    ✓ OK: Status 200 (API)`);
            isValid = true;
          } else if (response.status() === 403 || response.status() === 429) {
            // Site is blocking automated requests, try with actual browser
            console.log(`    ⚠ Status ${response.status()} (blocked by bot detection), trying with browser...`);
            isValid = await checkLinkInBrowser(page, externalLink);
            if (isValid) {
              console.log(`    ✓ OK: Loads successfully in browser`);
            } else {
              console.log(`    ❌ FAILED: Could not load in browser`);
              statusInfo = `Failed to load in browser after ${response.status()}`;
            }
          } else {
            console.log(`    ❌ FAILED: Status ${response.status()}`);
            statusInfo = response.status();
          }
        } catch (error) {
          // Request failed, try with actual browser
          console.log(`    ⚠ ERROR: ${error.message}, trying with browser...`);
          isValid = await checkLinkInBrowser(page, externalLink);
          if (isValid) {
            console.log(`    ✓ OK: Loads successfully in browser`);
          } else {
            console.log(`    ❌ FAILED: Could not load in browser`);
            statusInfo = error.message;
          }
        }
        
        if (!isValid) {
          brokenLinks.push({
            page: menuLink,
            link: externalLink,
            status: statusInfo,
          });
        }
      }
    }
    
    // Report results
    console.log(`\n========================================`);
    console.log(`SUMMARY:`);
    console.log(`Pages checked: ${visitedPages.size}`);
    console.log(`Unique external links checked: ${checkedLinks.size}`);
    console.log(`Broken links found: ${brokenLinks.length}`);
    
    if (brokenLinks.length > 0) {
      console.log(`\nBROKEN LINKS DETAILS:`);
      brokenLinks.forEach(({ page, link, status }) => {
        console.log(`\nPage: ${page}`);
        console.log(`Link: ${link}`);
        console.log(`Status: ${status}`);
      });
    }
    console.log(`========================================\n`);
    
    // Fail test if any broken links found
    expect(brokenLinks, `Found ${brokenLinks.length} broken external link(s)`).toHaveLength(0);
  });
});

/**
 * Checks if a link loads successfully in the browser
 */
async function checkLinkInBrowser(page: Page, url: string): Promise<boolean> {
  const currentUrl = page.url();
  
  try {
    // Open link in browser and check if it loads
    const response = await page.goto(url, { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    // Check if page loaded successfully
    const success = response !== null && response.ok();
    
    // Navigate back to the original page
    await page.goto(currentUrl, { waitUntil: 'networkidle' });
    
    return success;
  } catch (error) {
    // If navigation fails, return to original page and report as broken
    try {
      await page.goto(currentUrl, { waitUntil: 'networkidle' });
    } catch (e) {
      // If we can't get back, just continue
    }
    return false;
  }
}

/**
 * Extracts all menu and submenu links from the page
 */
async function extractMenuLinks(page: Page, baseURL: string): Promise<string[]> {
  const links = await page.evaluate((baseURL) => {
    const menuLinks: string[] = [];
    
    // Common selectors for navigation menus
    const menuSelectors = [
      'nav a',
      'header nav a',
      '[role="navigation"] a',
      '.menu a',
      '.nav a',
      '.navigation a',
      '#menu a',
      '#nav a',
    ];
    
    const allLinks = new Set<string>();
    
    menuSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element: HTMLAnchorElement) => {
        const href = element.href;
        if (href && href.startsWith(baseURL)) {
          allLinks.add(href);
        }
      });
    });
    
    return Array.from(allLinks);
  }, baseURL);
  
  return links;
}

/**
 * Extracts all external links from the current page
 */
async function extractExternalLinks(page: Page, baseURL: string): Promise<string[]> {
  const links = await page.evaluate((baseURL) => {
    const domain = 'stgrijnijssel.nl';
    const externalLinks: string[] = [];
    
    // Get all anchor tags
    const allAnchors = document.querySelectorAll('a[href]');
    
    allAnchors.forEach((anchor: HTMLAnchorElement) => {
      const href = anchor.href;
      
      // Check if it's a valid HTTP/HTTPS link
      if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
        // Check if it's NOT from stgrijnijssel.nl domain
        if (!href.includes(domain)) {
          externalLinks.push(href);
        }
      }
    });
    
    // Remove duplicates
    return Array.from(new Set(externalLinks));
  }, baseURL);
  
  return links;
}
