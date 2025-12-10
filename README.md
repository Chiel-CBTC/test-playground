# Playwright Multi-Project Testing Framework

This framework allows you to test multiple project applications using Playwright with isolated authentication and test suites for each project.

## Architecture

The framework supports multiple projects with isolated:
- Test suites
- Authentication states
- Helper functions
- Test data
- Environment configurations

### Current Projects
See the `projects/` directory for available test suites.

## Setup

### 1. Install Dependencies

```bash
npm install
npx playwright install chromium
```

### 2. Configure Credentials

Create a `.env` file with credentials for each project:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```
# Project 1
PROJECT1_BASE_URL=https://your-app.com
PROJECT1_USERNAME=your-email@example.com
PROJECT1_PASSWORD=your-password

# Testomat.io (Optional)
TESTOMATIO=your-testomat-api-key

# Add credentials for other projects here
```

### 3. Run Authentication Setup

Each project needs to authenticate once:

```bash
# Example: Setup authentication for a project
npm run auth:setup:your-project

# Add setup scripts for each project
```

## Usage

### Run All Tests (All Projects)

```bash
# Run all projects (headless, 6 workers in parallel - DEFAULT)
npm test

# Run all projects with browser visible
npm run test:headed

# Run all projects serially (one at a time, useful for debugging)
npm run test:serial

# Run tests in debug mode
npm run test:debug
```

### Run Tests for Specific Project

```bash
# Run project tests - headless (6 workers in parallel - DEFAULT)
npm run test:your-project

# Run project tests - with browser visible
npm run test:your-project:headed

# Run project tests - serial execution (one at a time, useful for debugging)
npm run test:your-project:serial
```

### Run Specific Tests

**IMPORTANT:** When using npm scripts, you must use `--` before additional flags to pass arguments correctly to Playwright.

```bash
# Run a specific test file
npm run test:your-project projects/your-project/tests/example.spec.ts

# Run a single test by exact name
npm run test:your-project projects/your-project/tests/example.spec.ts -- -g "test-name"

# Run multiple tests matching a pattern
npm run test:your-project projects/your-project/tests/example.spec.ts -- -g "pattern"

# Run all tests in a category
npm run test:your-project projects/your-project/tests/example.spec.ts -- -g "Category"

# Alternative: Call Playwright directly (no -- needed)
npx playwright test --headed --project=your-project-chromium projects/your-project/tests/example.spec.ts -g "test-name"
```

## Project Structure

```
.
├── projects/                       # All project test suites
│   ├── _template/                  # Template for new projects
│   │   ├── README.md              # Instructions for adding new projects
│   │   ├── setup/                 # Authentication setup
│   │   └── tests/                 # Test specs
│   │
│   └── your-project/              # Example project
│       ├── setup/
│       │   └── auth.setup.ts      # Authentication setup
│       ├── tests/
│       │   └── example.spec.ts    # Test specs
│       ├── helpers/
│       │   └── helper.ts          # Reusable helper functions
│       └── test-data/
│           └── test-cases.ts      # Test data
│
├── screenshots/                   # Test screenshots (auto-generated)
├── playwright.config.ts           # Playwright configuration
├── .env                           # Your credentials (not in git)
├── .gitignore                     # Git ignore rules
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Dependencies and scripts
```

## How It Works

1. Each project has its own setup project (e.g., `your-project-setup`) that runs first
2. The setup executes the project's `auth.setup.ts` and saves authentication state
3. All subsequent tests for that project use the saved authentication state
4. Tests can access protected pages without re-authenticating
5. Each project is completely isolated with its own:
   - Authentication state
   - Test files
   - Helper functions
   - Test data
   - Base URL configuration

## Adding a New Project

See `projects/_template/README.md` for detailed instructions on adding a new project.

Quick steps:
1. Copy `projects/_template` to `projects/yourproject`
2. Update authentication setup in `setup/auth.setup.ts`
3. Add your tests in `tests/`
4. Update `playwright.config.ts` to add your project projects
5. Add npm scripts in `package.json`
6. Add environment variables in `.env`
7. Create auth directory in `clients/yourproject/.auth/` for storing session state

## Testomat.io Integration

This framework includes integration with [Testomat.io](https://testomat.io) for enhanced test management and reporting.

### What is Testomat.io?

Testomat.io is a test management platform that helps you:
- Track test execution results across multiple runs
- Organize and manage test cases
- Generate comprehensive test reports
- Monitor test trends and analytics
- Collaborate with your team on test documentation

### Setup Testomat.io

1. **Create an account** at [testomat.io](https://testomat.io)
2. **Create a new project** in your Testomat.io dashboard
3. **Get your API key** from the project settings
4. **Add the API key** to your `.env` file:

```bash
TESTOMATIO=your-api-key-here
```

### How It Works

The framework is configured to automatically send test results to Testomat.io after each test run. The reporter is configured in `playwright.config.ts`:

```typescript
reporter: [
  ['@testomatio/reporter/playwright', {
    apiKey: process.env.TESTOMATIO,
  }],
]
```

### Using Testomat.io (Optional)

Testomat.io integration is **optional**. If you don't configure the `TESTOMATIO` API key:
- Tests will run normally
- Results will still be available in Playwright's HTML report
- You just won't see results in the Testomat.io dashboard

To use Testomat.io:
1. Configure your API key in `.env`
2. Run your tests as usual
3. View results in your Testomat.io dashboard

For more information, visit the [Testomat.io documentation](https://docs.testomat.io).

## Test Configuration

### Environment Variables

Update your `.env` file with the following variables:

```bash
# Project 1
PROJECT1_BASE_URL=https://your-app.com
PROJECT1_USERNAME=your-email@example.com
PROJECT1_PASSWORD=your-password

# Project 2
PROJECT2_BASE_URL=https://your-other-app.com
PROJECT2_USERNAME=your-email@example.com
PROJECT2_PASSWORD=your-password

# Testomat.io (Optional)
TESTOMATIO=your-testomat-api-key
```

### Default Test Configuration

**Tests run with the following defaults:**
- **Headless mode** (no browser UI)
- **6 parallel workers** for faster execution

To run with browser visible:
- Use `npm run test:headed` (all projects)
- Use `npm run test:your-project:headed` (specific project only)

To run tests serially (one at a time) for debugging:
- Use `npm run test:serial` (all projects)
- Use `npm run test:your-project:serial` (specific project only)

Or modify `playwright.config.ts`:
```typescript
workers: 1,  // Change from 6 to 1
fullyParallel: false,  // Change from true to false
```

### Test Results

- HTML report: `npx playwright show-report`
- Screenshots: `screenshots/`
- Tests can optionally create screenshots for debugging

## Customizing Tests

### Adding New Test Data

Edit your project's test data files in `projects/your-project/test-data/` to add new test cases.

### Creating Custom Tests

Create a new test file in your project's `tests/` directory (e.g., `projects/your-project/tests/`):

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

1. Check that the selectors in your project's `setup/auth.setup.ts` match the login page
2. Use `npm run test:debug` to step through the authentication process
3. Check console output for the current URL to verify you're on the right page

### Session Expires

Delete the project's auth file (e.g., `clients/your-project/.auth/user.json`) and run the auth setup again:
```bash
npm run auth:setup:your-project
```

### Can't Find Elements

Use the Playwright inspector to find correct selectors:
```bash
npx playwright codegen https://your-app.com
```

## Understanding Test Results

### Test Output

Each test can log detailed information for debugging purposes.

### Screenshots

Tests can save screenshots to help with debugging:
- Location: `screenshots/`
- Configure screenshot options in your test files

## Common Commands Reference

```bash
# Setup
npm install
npx playwright install chromium
npm run auth:setup:your-project

# Run all tests for a project (headless, parallel)
npm run test:your-project

# Run with browser visible
npm run test:your-project:headed

# Run single test (IMPORTANT: use -- before -g when using npm)
npm run test:your-project projects/your-project/tests/example.spec.ts -- -g "test-name"

# Or use npx directly (no -- needed)
npx playwright test --project=your-project-chromium projects/your-project/tests/example.spec.ts -g "test-name"

# Run category of tests
npm run test:your-project projects/your-project/tests/example.spec.ts -- -g "Category"

# Run all tests in a file (headless, parallel by default)
npm run test:your-project projects/your-project/tests/example.spec.ts

# Run serially for debugging
npm run test:your-project:serial projects/your-project/tests/example.spec.ts

# View results
npx playwright show-report
```

## Tips

- Each project has isolated authentication state that is reused across tests
- Screenshots can be saved to `screenshots/` directory for debugging
- Use `page.pause()` in any test to debug interactively
- All `.auth/` directories are gitignored to keep credentials safe
- Always use `--` before additional flags when running tests through npm scripts
- **Tests run headless with 6 parallel workers by default** for maximum speed
- Use headed mode (`test:your-project:headed`) to see browser during execution
- Use serial mode (`test:your-project:serial`) when debugging specific issues
- The `projects/_template/` directory provides a starting point for adding new projects
- Each project can have its own base URL, authentication flow, and test data
