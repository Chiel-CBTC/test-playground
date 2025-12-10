import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('should complete checkout flow with iDeal payment', async ({ page }) => {
    // Navigate to the main page
    await page.goto('/nl-nl');
    await page.waitForLoadState('networkidle');
    
    // Check for cookie banner and accept if present
    const acceptButton = page.getByRole('button', { name: 'Accepteren' });
    if (await acceptButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await acceptButton.click();
      await page.waitForTimeout(500); // Wait for banner to disappear
    }
    
    // Step 1: Add first product to cart
    const firstProductAddToCart = page.getByTestId('AddPlus').first();
    await firstProductAddToCart.click();
    
    // Wait a moment for the cart to update
    await page.waitForTimeout(1000);
    
    // Step 2: Open shopping cart by clicking cart icon in upper right corner
    const cartIcon = page.locator('a[href*="winkelwagen"]').or(
      page.locator('[data-testid*="cart"]')
    ).or(
      page.locator('header').getByRole('link', { name: /cart|winkelwagen/i })
    );
    await cartIcon.first().click();
    
    // Wait for cart page to load
    await page.waitForURL('**/winkelwagen**', { timeout: 10000 });
    
    // Step 3: Click "Naar bestellen" link
    await page.getByRole('link', { name: 'Naar bestellen' }).first().click();
    
    // Wait for checkout page to load
    await page.waitForLoadState('networkidle');
    
    // Step 4: Fill in all form fields
    
    // E-mailadres
    await page.getByLabel('E-mailadres').first().fill(process.env.CHECKOUT_EMAIL || 'test@example.com');
    
    // Voornaam
    await page.getByLabel('Voornaam').first().fill(process.env.CHECKOUT_FIRSTNAME || 'Jan');
    
    // Achternaam
    await page.getByLabel('Achternaam').first().fill(process.env.CHECKOUT_LASTNAME || 'Jansen');
    
    // Telefoonnummer
    await page.getByLabel('Telefoonnummer').first().fill(process.env.CHECKOUT_PHONE || '0612345678');
    
    // Adres & huisnummer (hardcoded test value)
    await page.getByLabel('Adres & huisnummer').first().fill('Teststraat 123');
    
    // Postcode
    await page.getByLabel('Postcode').first().fill(process.env.CHECKOUT_POSTCODE || '1234AB');
    
    // Woonplaats
    await page.getByLabel('Woonplaats').first().fill(process.env.CHECKOUT_CITY || 'Amsterdam');
    
    // Take a screenshot before submitting
    await page.screenshot({ path: 'screenshots/checkout-form-filled.png', fullPage: true });
    
    // Step 5: Click "Betalen met iDEAL" button
    await page.getByRole('button', { name: 'Betalen met iDEAL' }).click();
    
    // Step 6: Verify redirect to iDeal payment page
    // Determine the expected iDEAL URL pattern based on environment
    const baseURL = process.env.ACTION_ECOM_BASE_URL || '';
    const isStaging = baseURL.includes('staging');
    
    if (isStaging) {
      // Staging uses ext.pay.ideal.nl
      await page.waitForURL(/.*ext\.pay\.ideal\.nl.*/i, { timeout: 30000 });
      const currentUrl = page.url();
      expect(currentUrl).toContain('ext.pay.ideal.nl');
    } else {
      // Production uses pay.ideal.nl
      await page.waitForURL(/.*pay\.ideal\.nl.*/i, { timeout: 30000 });
      const currentUrl = page.url();
      expect(currentUrl).toContain('pay.ideal.nl');
    }
    
    // Take a screenshot of the payment page
    await page.screenshot({ path: 'screenshots/ideal-payment-page.png', fullPage: true });
  });
});
