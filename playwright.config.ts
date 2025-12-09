import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // Set to false to run tests serially by default
  forbidOnly: !!process.env.CI,
  retries: 1, // Retry failed tests once
  workers: 1, // Run one test at a time by default (change to 6 for parallel)
  reporter: [
    ['list'], // Shows test progress one by one in terminal
    ['html', { open: 'never' }], // Generate HTML report but don't auto-open
    ['json', { outputFile: 'test-results.json' }], // JSON results for analysis
  ],
  use: {
    baseURL: 'https://shop-staging.action.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    // Setup project to authenticate
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Use stored authentication state
        storageState: '.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});
