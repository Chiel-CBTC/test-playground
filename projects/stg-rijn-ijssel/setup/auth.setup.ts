import { test as setup } from '@playwright/test';

const authFile = 'projects/stg-rijn-ijssel/.auth/user.json';

setup('authenticate', async ({ page }) => {
  console.log('No authentication required for STG Rijn-IJssel website');
  
  // STG Rijn-IJssel website does not require authentication
  // This setup file creates an empty auth state for consistency
  
  // Save an empty authenticated state
  await page.context().storageState({ path: authFile });
});
