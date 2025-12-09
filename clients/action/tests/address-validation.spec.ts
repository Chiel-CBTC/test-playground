import { test, expect } from '@playwright/test';
import { addressTestCases } from '../test-data/address-test-cases';
import { completeCheckoutFlow, buildAddressField } from '../helpers/checkout-helper';

// Filter out the test cases we're automating (exclude Security, User Interaction, Accessibility)
const automatedTestCases = addressTestCases.filter(tc => 
  !['Security', 'Interaction', 'A11y'].includes(tc.category)
);

// Generate individual test for each case
automatedTestCases.forEach((testCase) => {
  test(`AEC-1472 ${testCase.testId} - ${testCase.notes}`, async ({ page }) => {
    const addressField = buildAddressField(
      testCase.streetName,
      testCase.houseNumber,
      testCase.addition
    );
    
    // Determine expected behavior based on test case
    const shouldReachIdeal = testCase.expectedResult === 'Accept' || testCase.expectedResult === 'Accept (trimmed)';
    const expectedErrorMessage = testCase.errorMessage;
    
    await completeCheckoutFlow(page, addressField, shouldReachIdeal, expectedErrorMessage, testCase.testId);
    
    // Take screenshot with test ID in filename
    const screenshotPath = `screenshots/address-tests/AEC-1472_${testCase.testId}-${testCase.category}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
  });
});
