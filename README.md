# Playwright SSO Testing Framework

This framework allows you to test the SSO-protected page at `https://shop-staging.action.com/nl-nl` using Playwright.

## Setup

### 1. Install Dependencies

```bash
npm install
npx playwright install chromium
```

### 2. Configure Credentials

There are two options for authentication:

#### Option A: Manual Login (Recommended for first-time setup)

1. Open `tests/auth.setup.ts`
2. Uncomment the line: `// await page.pause();`
3. Run the authentication setup:
   ```bash
   npm run auth:setup
   ```
4. The browser will pause at the login page - manually log in with your credentials
5. After successful login, press "Resume" in the Playwright inspector
6. The authentication state will be saved to `.auth/user.json`

#### Option B: Automated Login

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```
   SSO_USERNAME=your-email@example.com
   SSO_PASSWORD=your-password
   ```

3. Update the selectors in `tests/auth.setup.ts`:
   - Open the SSO login page in a browser
   - Right-click on the username/email field and inspect it
   - Copy the appropriate selector (id, name, type, etc.)
   - Update the `page.fill()` selectors in `auth.setup.ts`
   - Do the same for the password field and submit button

## Usage

### Run Authentication Setup

```bash
npm run auth:setup
```

This creates the `.auth/user.json` file with your authenticated session.

### Run Tests

```bash
# Run all tests (browser visible, one at a time)
npm test

# Run all tests in parallel (6 workers, faster)
npm run test:parallel

# Run tests in headless mode
npm run test:headless

# Run tests in debug mode
npm run test:debug
```

### Run Specific Tests

**IMPORTANT:** When using npm scripts, you must use `--` before the `-g` flag to pass arguments correctly to Playwright.

```bash
# Run a specific test file
npm test tests/checkout.spec.ts

# Run a single test by exact name (using npm)
npm test tests/address-validation.spec.ts -- -g "BT-001 - Empty addition should be allowed"

# Run multiple tests matching a pattern (using npm)
npm test tests/address-validation.spec.ts -- -g "BT-00"

# Run all tests in a category (using npm)
npm test tests/address-validation.spec.ts -- -g "Boundary"

# Alternative: Call Playwright directly (no -- needed)
npx playwright test --headed tests/address-validation.spec.ts -g "BT-001 - Empty addition should be allowed"
```

### Address Validation Tests

The framework includes 78 automated address validation tests covering:
- Boundary testing (addition length, house number length)
- Realistic Dutch addresses (common additions like "bis", "boven", "beneden")
- Street name validation
- Whitespace handling
- Empty field validation
- Special characters
- Numeric validation

**Test Categories:**
- `BT-*` - Boundary Testing
- `HC-*` - House Number with Consecutive Characters
- `NL-*` - Realistic Dutch Additions
- `CO-*` - Combinations
- `ST-*` - Street Name Validation
- `WS-*` - Whitespace
- `EV-*` - Empty/Validation
- `SC-*` - Special Characters
- `NV-*` - Numeric Validation

**Run specific test categories:**

```bash
# Run all boundary tests
npm test tests/address-validation.spec.ts -- -g "^BT-"

# Run all realistic Dutch address tests
npm test tests/address-validation.spec.ts -- -g "^NL-"

# Run Critical priority tests
npm test tests/address-validation.spec.ts -- -g "Critical"

# Run all address validation tests serially
npm test tests/address-validation.spec.ts

# Run all address validation tests in parallel
npm run test:parallel tests/address-validation.spec.ts
```

**Happy Flow Test:**
```bash
# BT-001 is the recommended happy flow test
npm test tests/address-validation.spec.ts -- -g "BT-001 - Empty addition should be allowed"
```

## Project Structure

```
.
├── tests/
│   ├── auth.setup.ts               # Authentication setup script
│   ├── checkout.spec.ts            # Checkout flow test
│   ├── address-validation.spec.ts  # Address validation tests (78 tests)
│   ├── main-page.spec.ts           # Main page test suite
│   └── helpers/
│       └── checkout-helper.ts      # Reusable checkout flow helper
├── test-data/
│   └── address-test-cases.ts       # Test data for address validation
├── .auth/
│   └── user.json                   # Stored authentication state (auto-generated)
├── screenshots/
│   └── address-tests/              # Address test screenshots (auto-generated)
├── playwright.config.ts            # Playwright configuration
├── .env                            # Your credentials (not in git)
├── .env.example                    # Example credentials file
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Dependencies and scripts
```

## How It Works

1. The `setup` project runs first and executes `auth.setup.ts`
2. This logs into the SSO-protected site and saves cookies/storage to `.auth/user.json`
3. All subsequent tests use this saved authentication state
4. Tests can now access protected pages without re-authenticating

## Test Configuration

### Environment Variables

Update your `.env` file with the following variables:

```bash
# SSO Login Credentials
SSO_USERNAME=your-email@example.com
SSO_PASSWORD=your-password

# Checkout Form Data (used in all address validation tests)
CHECKOUT_EMAIL=test@example.com
CHECKOUT_FIRSTNAME=Jan
CHECKOUT_LASTNAME=Jansen
CHECKOUT_PHONE=0612345678
CHECKOUT_POSTCODE=1234AB
CHECKOUT_CITY=Amsterdam
```

### Parallelization

By default, tests run serially (1 worker). To run tests in parallel:

- Use `npm run test:parallel` (6 workers)
- Or modify `playwright.config.ts`:
  ```typescript
  workers: 6,  // Change from 1 to 6
  fullyParallel: true,  // Change from false to true
  ```

### Test Results

- HTML report: `npx playwright show-report`
- Screenshots: `screenshots/address-tests/`
- Each test creates a screenshot named: `[TEST_ID]-[CATEGORY].png`

## Customizing Tests

### Adding New Address Test Cases

Edit `test-data/address-test-cases.ts` to add new test cases:

```typescript
{ 
  testId: 'NL-014', 
  category: 'Realistic', 
  streetName: 'Main Street', 
  houseNumber: '123', 
  addition: 'A', 
  expectedResult: 'Accept', 
  priority: 'High', 
  notes: 'Your test description' 
}
```

The test will be automatically generated in `address-validation.spec.ts`.

### Creating Custom Tests

Create a new test file in `tests/`:

```typescript
import { test, expect } from '@playwright/test';

test('my custom test', async ({ page }) => {
  await page.goto('/nl-nl');
  
  // Add your test steps here
  await page.click('[data-testid="my-element"]');
  await expect(page.locator('.result')).toBeVisible();
});
```

## Troubleshooting

### Authentication Fails

1. Check that the selectors in `auth.setup.ts` match your SSO login page
2. Use `npm run test:debug` to step through the authentication process
3. Check console output for the current URL to verify you're on the right page

### Session Expires

Delete the `.auth/user.json` file and run `npm run auth:setup` again to re-authenticate.

### Can't Find Elements

Use the Playwright inspector to find correct selectors:
```bash
npx playwright codegen https://shop-staging.action.com/nl-nl
```

## Understanding Test Results

### Expected Results

Tests have three possible expected results:

1. **Accept** - Form should submit successfully and reach the iDeal payment page
2. **Show error** - Form should NOT submit and stay on checkout page (validation error expected)
3. **Accept/Show error** - Uncertain behavior, treated as "Accept" for now (review manually)

### Test Output

Each test logs detailed information:
```
=== Running Test: BT-001 ===
Category: Boundary
Address Field: "Main Street 123"
Expected: Accept
Priority: High
Notes: Empty addition should be allowed
```

### Screenshots

All tests save screenshots to help with debugging:
- Location: `screenshots/address-tests/`
- Naming: `[TEST_ID]-[CATEGORY].png`
- Example: `BT-001-Boundary.png`

## Common Commands Reference

```bash
# Setup
npm install
npx playwright install chromium
npm run auth:setup

# Run single test (IMPORTANT: use -- before -g when using npm)
npm test tests/address-validation.spec.ts -- -g "BT-001 - Empty addition should be allowed"

# Or use npx directly (no -- needed)
npx playwright test --headed tests/address-validation.spec.ts -g "BT-001 - Empty addition should be allowed"

# Run category of tests
npm test tests/address-validation.spec.ts -- -g "^BT-"
npm test tests/address-validation.spec.ts -- -g "^NL-"

# Run all tests serially
npm test tests/address-validation.spec.ts

# Run all tests in parallel (faster)
npm run test:parallel tests/address-validation.spec.ts

# View results
npx playwright show-report
```

## Tips

- The authentication state is reused across all tests, so you only need to login once
- Screenshots are automatically saved to `screenshots/address-tests/` for each test
- Use `page.pause()` in any test to debug interactively
- The `.auth/` directory is gitignored to keep credentials safe
- Always use `--` before `-g` when running tests through npm scripts
- Tests run serially (1 at a time) by default for easier debugging
- Use `test:parallel` for faster execution when running many tests
