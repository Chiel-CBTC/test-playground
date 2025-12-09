import { Page, expect } from '@playwright/test';

export interface CheckoutFormData {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  postcode?: string;
  city?: string;
}

/**
 * Complete checkout flow helper function
 */
export async function completeCheckoutFlow(
  page: Page,
  addressField: string,
  shouldReachIdeal: boolean = true,
  expectedErrorMessage?: string,
  testId?: string
): Promise<void> {
  
  // Navigate to the main page
  await page.goto('/nl-nl');
  await page.waitForLoadState('networkidle');
  
  // Check for cookie banner and accept if present
  try {
    const acceptButton = page.getByRole('button', { name: 'Accepteren' });
    await acceptButton.waitFor({ state: 'visible', timeout: 5000 });
    await acceptButton.click();
    await page.waitForTimeout(1000);
  } catch (error) {
    // Cookie banner not present or already accepted
  }
  
  // Step 1: Add first product to cart
  const firstProductAddToCart = page.getByTestId('AddPlus').first();
  await firstProductAddToCart.click();
  await page.waitForTimeout(1000);
  
  // Step 2: Open shopping cart
  const cartIcon = page.locator('a[href*="winkelwagen"]').or(
    page.locator('[data-testid*="cart"]')
  ).or(
    page.locator('header').getByRole('link', { name: /cart|winkelwagen/i })
  );
  await cartIcon.first().click();
  await page.waitForURL('**/winkelwagen**', { timeout: 10000 });
  
  // Step 3: Click "Naar bestellen" link
  await page.getByRole('link', { name: 'Naar bestellen' }).first().click();
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
  
  // Adres & huisnummer (test parameter)
  await page.getByLabel('Adres & huisnummer').first().fill(addressField);
  
  // Postcode
  await page.getByLabel('Postcode').first().fill(process.env.CHECKOUT_POSTCODE || '1234AB');
  
  // Woonplaats
  await page.getByLabel('Woonplaats').first().fill(process.env.CHECKOUT_CITY || 'Amsterdam');
  
  // Take screenshot before clicking iDEAL button
  const beforeClickPath = testId 
    ? `screenshots/address-tests/${testId}-before-click.png`
    : 'screenshots/before-ideal-click.png';
  await page.screenshot({ path: beforeClickPath, fullPage: true });

  // Step 5: Click "Betalen met iDEAL" button
  await page.getByRole('button', { name: 'Betalen met iDEAL' }).click();
  await page.waitForTimeout(2000);
  
  // Step 6: Verify result based on expected behavior
  if (shouldReachIdeal) {
    // Should reach iDeal page
    await page.waitForURL(/.*ext\.pay\.ideal\.nl.*/i, { timeout: 10000 });
    const currentUrl = page.url();
    expect(currentUrl).toContain('ext.pay.ideal.nl');
  } else {
    // Should NOT reach iDeal page (error expected)
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('ext.pay.ideal.nl');
    expect(currentUrl).toContain('checkout');
    
    // Check for error message if provided
    if (expectedErrorMessage) {
      const errorElement = page.getByText(expectedErrorMessage);
      await expect(errorElement).toBeVisible({ timeout: 5000 });
    }
  }
}

/**
 * Build the combined address field from test case data
 */
export function buildAddressField(streetName: string, houseNumber: string, addition: string): string {
  const parts = [streetName, houseNumber, addition].filter(p => p.trim() !== '');
  return parts.join(' ');
}
