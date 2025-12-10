# Playwright Multi-Client Testing Framework

This framework allows you to test multiple client applications using Playwright with isolated authentication and test suites for each client.

## Architecture

The framework supports multiple clients with isolated:
- Test suites
- Authentication states
- Helper functions
- Test data
- Environment configurations

### Current Clients
- **action-ecom** - Action e-commerce testing suite with checkout and address validation tests

## Setup

### 1. Install Dependencies

```bash
npm install
npx playwright install chromium
```

### 2. Configure Credentials

Create a `.env` file with credentials for each client:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```
# Action E-commerce Client
ACTION_ECOM_BASE_URL=https://shop-staging.action.com
SSO_USERNAME=your-email@example.com
SSO_PASSWORD=your-password
CHECKOUT_EMAIL=test@example.com
CHECKOUT_FIRSTNAME=Jan
CHECKOUT_LASTNAME=Jansen
CHECKOUT_PHONE=0612345678
CHECKOUT_POSTCODE=1234AB
CHECKOUT_CITY=Amsterdam

# Add credentials for other clients here
```

### 3. Run Authentication Setup

Each client needs to authenticate once:

```bash
# Action e-commerce client
npm run auth:setup:action-ecom

# Future clients
# npm run auth:setup:client2
```

## Usage

### Run All Tests (All Clients)

```bash
# Run all clients (headless, 6 workers in parallel - DEFAULT)
npm test

# Run all clients with browser visible
npm run test:headed

# Run all clients serially (one at a time, useful for debugging)
npm run test:serial

# Run tests in debug mode
npm run test:debug
```

### Run Tests for Specific Client

```bash
# Action e-commerce client - headless (6 workers in parallel - DEFAULT)
npm run test:action-ecom

# Action e-commerce client - with browser visible
npm run test:action-ecom:headed

# Action e-commerce client - serial execution (one at a time, useful for debugging)
npm run test:action-ecom:serial
```

### Run Specific Tests

**IMPORTANT:** When using npm scripts, you must use `--` before additional flags to pass arguments correctly to Playwright.

```bash
# Run a specific test file for Action e-commerce client
npm run test:action-ecom projects/action-ecom/tests/checkout.spec.ts

# Run a single test by exact name
npm run test:action-ecom projects/action-ecom/tests/address-validation.spec.ts -- -g "BT-001"

# Run multiple tests matching a pattern
npm run test:action-ecom projects/action-ecom/tests/address-validation.spec.ts -- -g "BT-"

# Run all tests in a category
npm run test:action-ecom projects/action-ecom/tests/address-validation.spec.ts -- -g "Boundary"

# Alternative: Call Playwright directly (no -- needed)
npx playwright test --headed --project=action-ecom-chromium projects/action-ecom/tests/address-validation.spec.ts -g "BT-001"
```

### Action Client - Address Validation Tests

The Action client includes 78 automated address validation tests covering:
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
# Run all boundary tests (headless by default)
npm run test:action-ecom projects/action-ecom/tests/address-validation.spec.ts -- -g "BT-"

# Run all realistic Dutch address tests (headless by default)
npm run test:action-ecom projects/action-ecom/tests/address-validation.spec.ts -- -g "NL-"

# Run all address validation tests (parallel, headless by default)
npm run test:action-ecom projects/action-ecom/tests/address-validation.spec.ts

# Run all address validation tests serially
npm run test:action-ecom:serial projects/action-ecom/tests/address-validation.spec.ts
```

**Happy Flow Test:**
```bash
# BT-001 is the recommended happy flow test (headless by default)
npm run test:action-ecom projects/action-ecom/tests/address-validation.spec.ts -- -g "BT-001"
```

## Project Structure

```
.
├── projects/                       # All client test suites
│   ├── _template/                  # Template for new clients
│   │   ├── README.md              # Instructions for adding new clients
│   │   ├── setup/                 # Authentication setup
│   │   └── tests/                 # Test specs
│   │
│   └── action-ecom/               # Action e-commerce client
│       ├── setup/
│       │   └── auth.setup.ts      # Authentication setup
│       ├── tests/
│       │   ├── checkout.spec.ts   # Checkout flow tests
│       │   ├── address-validation.spec.ts  # Address validation tests
│       │   └── main-page.spec.ts  # Main page tests
│       ├── helpers/
│       │   └── checkout-helper.ts # Reusable checkout helper
│       └── test-data/
│           └── address-test-cases.ts  # Test data
│
├── clients/                       # Client-specific auth states
│   └── action/
│       └── .auth/
│           └── user.json          # Auth state (auto-generated)
│
├── screenshots/                   # Test screenshots (auto-generated)
├── playwright.config.ts           # Playwright configuration
├── .env                           # Your credentials (not in git)
├── .gitignore                     # Git ignore rules
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Dependencies and scripts
```

## How It Works

1. Each client has its own setup project (e.g., `action-setup`) that runs first
2. The setup executes the client's `auth.setup.ts` and saves authentication state
3. All subsequent tests for that client use the saved authentication state
4. Tests can access protected pages without re-authenticating
5. Each client is completely isolated with its own:
   - Authentication state
   - Test files
   - Helper functions
   - Test data
   - Base URL configuration

## Adding a New Client

See `projects/_template/README.md` for detailed instructions on adding a new client.

Quick steps:
1. Copy `projects/_template` to `projects/yourclient`
2. Update authentication setup in `setup/auth.setup.ts`
3. Add your tests in `tests/`
4. Update `playwright.config.ts` to add your client projects
5. Add npm scripts in `package.json`
6. Add environment variables in `.env`
7. Create auth directory in `clients/yourclient/.auth/` for storing session state

## Test Configuration

### Environment Variables

Update your `.env` file with the following variables:

```bash
# Action E-commerce Client
ACTION_ECOM_BASE_URL=https://shop-staging.action.com
SSO_USERNAME=your-email@example.com
SSO_PASSWORD=your-password
CHECKOUT_EMAIL=test@example.com
CHECKOUT_FIRSTNAME=Jan
CHECKOUT_LASTNAME=Jansen
CHECKOUT_PHONE=0612345678
CHECKOUT_POSTCODE=1234AB
CHECKOUT_CITY=Amsterdam

# Add your other clients here
# CLIENT2_BASE_URL=...
# CLIENT2_USERNAME=...
# CLIENT2_PASSWORD=...
```

### Default Test Configuration

**Tests run with the following defaults:**
- **Headless mode** (no browser UI)
- **6 parallel workers** for faster execution

To run with browser visible:
- Use `npm run test:headed` (all clients)
- Use `npm run test:action-ecom:headed` (Action e-commerce client only)

To run tests serially (one at a time) for debugging:
- Use `npm run test:serial` (all clients)
- Use `npm run test:action-ecom:serial` (Action e-commerce client only)

Or modify `playwright.config.ts`:
```typescript
workers: 1,  // Change from 6 to 1
fullyParallel: false,  // Change from true to false
```

### Test Results

- HTML report: `npx playwright show-report`
- Screenshots: `screenshots/address-tests/`
- Each test creates a screenshot named: `[TEST_ID]-[CATEGORY].png`

## Customizing Tests

### Adding New Address Test Cases (Action E-commerce Client)

Edit `projects/action-ecom/test-data/address-test-cases.ts` to add new test cases:

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

Then add the test case to the appropriate test suite in `projects/action-ecom/tests/address-validation.spec.ts`.

### Creating Custom Tests

Create a new test file in your client's `tests/` directory (e.g., `projects/action-ecom/tests/`):

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

1. Check that the selectors in your client's `setup/auth.setup.ts` match the login page
2. Use `npm run test:debug` to step through the authentication process
3. Check console output for the current URL to verify you're on the right page

### Session Expires

Delete the client's auth file (e.g., `clients/action/.auth/user.json`) and run the auth setup again:
```bash
npm run auth:setup:action-ecom
```

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
npm run auth:setup:action-ecom

# Run all Action e-commerce tests (headless, parallel)
npm run test:action-ecom

# Run with browser visible
npm run test:action-ecom:headed

# Run single test (IMPORTANT: use -- before -g when using npm)
npm run test:action-ecom projects/action-ecom/tests/address-validation.spec.ts -- -g "BT-001"

# Or use npx directly (no -- needed)
npx playwright test --project=action-ecom-chromium projects/action-ecom/tests/address-validation.spec.ts -g "BT-001"

# Run category of tests
npm run test:action-ecom projects/action-ecom/tests/address-validation.spec.ts -- -g "BT-"
npm run test:action-ecom projects/action-ecom/tests/address-validation.spec.ts -- -g "NL-"

# Run all address validation tests (headless, parallel by default)
npm run test:action-ecom projects/action-ecom/tests/address-validation.spec.ts

# Run serially for debugging
npm run test:action-ecom:serial projects/action-ecom/tests/address-validation.spec.ts

# View results
npx playwright show-report
```

## Tips

- Each client has isolated authentication state that is reused across tests
- Screenshots are automatically saved to `screenshots/` directory
- Use `page.pause()` in any test to debug interactively
- All `.auth/` directories are gitignored to keep credentials safe
- Always use `--` before additional flags when running tests through npm scripts
- **Tests run headless with 6 parallel workers by default** for maximum speed
- Use headed mode (`test:action-ecom:headed`) to see browser during execution
- Use serial mode (`test:action-ecom:serial`) when debugging specific issues
- The `projects/_template/` directory provides a starting point for adding new clients
- Each client can have its own base URL, authentication flow, and test data
