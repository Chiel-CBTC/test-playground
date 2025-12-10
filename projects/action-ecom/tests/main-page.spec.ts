import { test, expect } from '@playwright/test';

test.describe('Main Page Tests', () => {
  test('should access the main page after SSO login', async ({ page }) => {
    // Navigate to the main page
    await page.goto('/nl-nl');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Verify we're on the correct page
    await expect(page).toHaveURL(/.*shop-staging\.action\.com\/nl-nl.*/);
    
    // Take a screenshot for verification
    await page.screenshot({ path: 'screenshots/main-page-tests/main-page-access.png', fullPage: true });
  });

  test('should be able to interact with the page', async ({ page }) => {
    await page.goto('/nl-nl');
    await page.waitForLoadState('networkidle');
    
    // Add your specific page interactions here
    // Examples:
    // await page.click('[data-testid="product-link"]');
    // await page.fill('[data-testid="search"]', 'test query');
    
    // Verify page elements are visible
    // await expect(page.locator('header')).toBeVisible();
    // await expect(page.locator('footer')).toBeVisible();
  });
});
