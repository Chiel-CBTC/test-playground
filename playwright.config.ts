import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './clients',
  fullyParallel: true, // Run tests in parallel by default
  forbidOnly: !!process.env.CI,
  retries: 1, // Retry failed tests once
  workers: 6, // Run tests with 6 workers in parallel by default
  reporter: [
    ['list'], // Shows test progress one by one in terminal
    ['html', { open: 'never' }], // Generate HTML report but don't auto-open
    ['json', { outputFile: 'test-results.json' }], // JSON results for analysis
    ['@testomatio/reporter/playwright', {
      apiKey: process.env.TESTOMATIO,
    }],
  ],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    // ============================
    // ACTION CLIENT
    // ============================
    {
      name: 'action-setup',
      testMatch: /clients\/action\/setup\/.*\.setup\.ts/,
      use: {
        baseURL: process.env.ACTION_BASE_URL || 'https://shop-staging.action.com',
      },
    },
    {
      name: 'action-chromium',
      testMatch: /clients\/action\/tests\/.*\.spec\.ts/,
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: process.env.ACTION_BASE_URL || 'https://shop-staging.action.com',
        storageState: 'clients/action/.auth/user.json',
      },
      dependencies: ['action-setup'],
    },

    // ============================
    // ADD OTHER CLIENTS HERE
    // ============================
    // Example for future client:
    // {
    //   name: 'client2-setup',
    //   testMatch: /clients\/client2\/setup\/.*\.setup\.ts/,
    //   use: {
    //     baseURL: 'https://example-client2.com',
    //   },
    // },
    // {
    //   name: 'client2-chromium',
    //   testMatch: /clients\/client2\/tests\/.*\.spec\.ts/,
    //   use: { 
    //     ...devices['Desktop Chrome'],
    //     baseURL: 'https://example-client2.com',
    //     storageState: 'clients/client2/.auth/user.json',
    //   },
    //   dependencies: ['client2-setup'],
    // },
  ],
});
