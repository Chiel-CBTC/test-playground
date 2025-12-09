# Client Template

This is a template structure for adding new clients to the test suite.

## Steps to Add a New Client

1. **Copy this template directory** and rename it to your client name (lowercase, e.g., `client2`)
   ```bash
   cp -r clients/_template clients/yourclient
   ```

2. **Update the directory structure:**
   - `tests/` - Add your test spec files here (*.spec.ts)
   - `setup/` - Add authentication setup files here (*.setup.ts)
   - `helpers/` - Add helper functions specific to your client
   - `test-data/` - Add test data files here
   - `.auth/` - Authentication state will be stored here (auto-generated)

3. **Create authentication setup** in `setup/auth.setup.ts`:
   ```typescript
   import { test as setup } from '@playwright/test';

   const authFile = 'clients/yourclient/.auth/user.json';

   setup('authenticate', async ({ page }) => {
     // Your authentication flow here
     await page.goto('/login');
     // ... authentication steps ...
     
     // Save the authenticated state
     await page.context().storageState({ path: authFile });
   });
   ```

4. **Add your tests** in `tests/` directory:
   ```typescript
   import { test, expect } from '@playwright/test';

   test('example test', async ({ page }) => {
     await page.goto('/');
     // Your test logic here
   });
   ```

5. **Update `playwright.config.ts`** to add your client projects:
   ```typescript
   {
     name: 'yourclient-setup',
     testMatch: /clients\/yourclient\/setup\/.*\.setup\.ts/,
     use: {
       baseURL: 'https://yourclient.com',
     },
   },
   {
     name: 'yourclient-chromium',
     testMatch: /clients\/yourclient\/tests\/.*\.spec\.ts/,
     use: { 
       ...devices['Desktop Chrome'],
       baseURL: 'https://yourclient.com',
       storageState: 'clients/yourclient/.auth/user.json',
     },
     dependencies: ['yourclient-setup'],
   },
   ```

6. **Add npm scripts** in `package.json`:
   ```json
   "test:yourclient": "playwright test --project=yourclient-setup --project=yourclient-chromium",
   "test:yourclient:headed": "playwright test --project=yourclient-setup --project=yourclient-chromium --headed",
   "test:yourclient:serial": "playwright test --project=yourclient-setup --project=yourclient-chromium --workers=1",
   "auth:setup:yourclient": "playwright test --project=yourclient-setup --headed"
   ```
   
   Note: Tests run headless with 6 parallel workers by default (configured in playwright.config.ts)

7. **Add environment variables** in `.env`:
   ```
   # YourClient credentials
   YOURCLIENT_USERNAME=your-username
   YOURCLIENT_PASSWORD=your-password
   # ... other client-specific env vars
   ```

## Running Tests

- Run all clients: `npm test` (headless, 6 parallel workers by default)
- Run specific client: `npm run test:yourclient` (headless, parallel by default)
- Run with browser visible: `npm run test:yourclient:headed`
- Run serially for debugging: `npm run test:yourclient:serial`
- Setup auth for specific client: `npm run auth:setup:yourclient`
