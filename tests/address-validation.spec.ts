import { test, expect } from '@playwright/test';
import { addressTestCases } from '../test-data/address-test-cases';
import { completeCheckoutFlow, buildAddressField } from './helpers/checkout-helper';

// Filter out the test cases we're automating (exclude Security, User Interaction, Accessibility)
const automatedTestCases = addressTestCases.filter(tc => 
  !['Security', 'Interaction', 'A11y'].includes(tc.category)
);

// Generate individual test for each case
automatedTestCases.forEach((testCase) => {
  test(`${testCase.testId} - ${testCase.notes}`, async ({ page }) => {
    const addressField = buildAddressField(
      testCase.streetName,
      testCase.houseNumber,
      testCase.addition
    );
    
    // Determine expected behavior based on test case
    const shouldReachIdeal = testCase.expectedResult === 'Accept' || testCase.expectedResult === 'Accept (trimmed)';
    const expectedErrorMessage = testCase.errorMessage;
    
    // Only log in case of debugging - comment out for cleaner parallel output
    // console.log(`\n=== Running Test: ${testCase.testId} ===`);
    // console.log(`Category: ${testCase.category}`);
    // console.log(`Address Field: "${addressField}"`);
    // console.log(`Expected Result: ${testCase.expectedResult}`);
    
    await completeCheckoutFlow(page, addressField, shouldReachIdeal, expectedErrorMessage, testCase.testId);
    
    // Take screenshot with test ID in filename
    const screenshotPath = `screenshots/address-tests/${testCase.testId}-${testCase.category}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
  });
});
