import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should login successfully and verify user is logged in', async ({ page }) => {
    // Step 1: Navigate to homepage
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Step 2: Click on "Inloggen" link from homepage
    const inloggenLink = page.locator('a[href="/mijn-captain/login"][target="_self"]').filter({ hasText: 'Inloggen' });
    await inloggenLink.first().click();
    
    // Wait for login page to load
    await page.waitForURL('**/mijn-captain/login', { timeout: 10000 });
    
    // Step 3: Fill in login credentials
    await page.locator('#usernamew17504').fill(process.env.STG_RIJN_IJSSEL_USERNAME || '');
    await page.locator('#passwordw17504').fill(process.env.STG_RIJN_IJSSEL_PASSWORD || '');
    
    // Step 4: Click login button
    await page.locator('#btnlogin').click();
    
    // Wait for navigation after login
    await page.waitForLoadState('networkidle');
    
    // Step 5: Verify user is logged in by checking the text in upper right corner
    const loggedInText = page.locator('text=/Ingelogd als:.*Chiel Bleumink.*\\(Uitloggen\\)/').first();
    await expect(loggedInText).toBeVisible({ timeout: 10000 });
    
    console.log('✓ Successfully logged in as Chiel Bleumink');
  });
});
