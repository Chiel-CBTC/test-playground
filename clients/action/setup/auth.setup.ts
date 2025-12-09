import { test as setup, expect } from '@playwright/test';
import * as path from 'path';
import { fileURLToPath } from 'url';

const authFile = 'clients/action/.auth/user.json';

setup('authenticate', async ({ page }) => {
  console.log('Starting authentication flow...');
  
  // Navigate to the main page - this will redirect to Cloudflare Access
  await page.goto('/nl-nl');
  
  console.log('Current URL after redirect:', page.url());
  
  // Click on Azure AD login option
  console.log('Clicking Azure AD login...');
  await page.getByRole('link', { name: 'Azure AD ・ Action' }).click();
  
  // Fill in email/username
  console.log('Entering username...');
  await page.getByRole('textbox', { name: 'Enter your email, phone, or' }).click();
  await page.getByRole('textbox', { name: 'Enter your email, phone, or' }).fill(process.env.SSO_USERNAME || '');
  await page.getByRole('button', { name: 'Next' }).click();
  
  // Fill in password
  console.log('Entering password...');
  await page.getByRole('textbox', { name: /Enter the password for/ }).click();
  await page.getByRole('textbox', { name: /Enter the password for/ }).fill(process.env.SSO_PASSWORD || '');
  await page.getByRole('button', { name: 'Sign in' }).click();
  
  // Click "Yes" to stay signed in
  console.log('Clicking Yes to stay signed in...');
  await page.getByRole('button', { name: 'Yes' }).click();
  
  // Wait for successful login - should redirect back to /nl-nl
  await page.waitForURL('**/nl-nl**', { timeout: 30000 });
  
  // Accept cookies/terms (if present)
  console.log('Checking for cookie banner...');
  const acceptButton = page.getByRole('button', { name: 'Accepteren' });
  if (await acceptButton.isVisible({ timeout: 5000 }).catch(() => false)) {
    console.log('Cookie banner found, accepting...');
    await acceptButton.click();
  } else {
    console.log('No cookie banner present');
  }
  
  console.log('Authentication successful!');
  console.log('Final URL:', page.url());
  
  // Save the authenticated state
  await page.context().storageState({ path: authFile });
});
