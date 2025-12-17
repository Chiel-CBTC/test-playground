import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './projects',
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
    // ACTION ECOM CLIENT
    // ============================
    {
      name: 'action-ecom-setup',
      testMatch: /projects\/action-ecom\/setup\/.*\.setup\.ts/,
      use: {
        baseURL: process.env.ACTION_ECOM_BASE_URL || 'https://shop-staging.action.com',
      },
    },
    {
      name: 'action-ecom-chromium',
      testMatch: /projects\/action-ecom\/tests\/.*\.spec\.ts/,
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: process.env.ACTION_ECOM_BASE_URL || 'https://shop-staging.action.com',
        storageState: 'projects/action-ecom/.auth/user.json',
      },
      dependencies: ['action-ecom-setup'],
    },

    // ============================
    // STG RIJN-IJSSEL CLIENT
    // ============================
    {
      name: 'stg-rijn-ijssel-setup',
      testMatch: /projects\/stg-rijn-ijssel\/setup\/.*\.setup\.ts/,
      use: {
        baseURL: process.env.STG_RIJN_IJSSEL_BASE_URL || 'https://stgrijnijssel.nl',
      },
    },
    {
      name: 'stg-rijn-ijssel-chromium',
      testMatch: /projects\/stg-rijn-ijssel\/tests\/.*\.spec\.ts/,
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: process.env.STG_RIJN_IJSSEL_BASE_URL || 'https://stgrijnijssel.nl',
        storageState: 'projects/stg-rijn-ijssel/.auth/user.json',
      },
      dependencies: ['stg-rijn-ijssel-setup'],
    },

    // ============================
    // ADD OTHER CLIENTS HERE
    // ============================
  ],
});
