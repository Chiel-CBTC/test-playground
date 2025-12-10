// @ts-nocheck
import { test, expect, Page } from '@playwright/test';
import { addressTestCases, AddressTestCase } from '../test-data/address-test-cases';
import { completeCheckoutFlow, buildAddressField } from '../helpers/checkout-helper';

// Filter out categories that shouldn't be automated
const automatedTestCases = addressTestCases.filter(tc => 
  !['Security', 'Interaction', 'A11y'].includes(tc.category)
);

/**
 * Helper to get test case by ID
 * @param {string} testId
 * @returns {AddressTestCase}
 */
function getTestCase(testId) {
  const testCase = automatedTestCases.find(tc => tc.testId === testId);
  if (!testCase) {
    throw new Error(`Test case ${testId} not found`);
  }
  return testCase;
}

/**
 * Helper function to run address validation test
 * @param {import('@playwright/test').Page} page
 * @param {AddressTestCase} testCase
 * @returns {Promise<void>}
 */
async function runAddressTest(page, testCase) {
  const addressField = buildAddressField(
    testCase.streetName,
    testCase.houseNumber,
    testCase.addition
  );
  
  const shouldReachIdeal = testCase.expectedResult === 'Accept' || testCase.expectedResult === 'Accept (trimmed)';
  const expectedErrorMessage = testCase.errorMessage;
  
  await completeCheckoutFlow(page, addressField, shouldReachIdeal, expectedErrorMessage, testCase.testId);
  
  // Take screenshot with test ID in filename
  const screenshotPath = `screenshots/address-tests/AEC-1472_${testCase.testId}-${testCase.category}.png`;
  await page.screenshot({ 
    path: screenshotPath, 
    fullPage: true,
    timeout: 5000 // Add timeout to prevent hanging on slow-loading resources
  }).catch(() => {
    // If screenshot fails, continue test - screenshot is not critical for validation
    console.log(`Screenshot failed for ${testCase.testId}, continuing test...`);
  });
}

// ============================
// BOUNDARY TESTING - ADDITION LENGTH
// ============================
test.describe('Address Validation - Boundary Testing (Addition Length)', () => {
  test('AEC-1472: BT-001 - Empty addition should be allowed', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-001'));
  });
  
  test('AEC-1472: BT-002 - Minimum length addition (1 character)', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-002'));
  });
  
  test('AEC-1472: BT-003 - Addition just below limit (5 characters)', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-003'));
  });
  
  test('AEC-1472: BT-004 - Addition at exact limit (6 characters)', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-004'));
  });
  
  test('AEC-1472: BT-005 - Addition over limit (7 characters)', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-005'));
  });
  
  test('AEC-1472: BT-006 - Addition with 8 characters', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-006'));
  });
  
  test('AEC-1472: BT-007 - Addition with 10 characters', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-007'));
  });
  
  test('AEC-1472: BT-008 - Addition with 15 characters (extreme case)', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-008'));
  });
});

// ============================
// BOUNDARY TESTING - HOUSE NUMBER LENGTH
// ============================
test.describe('Address Validation - Boundary Testing (House Number Length)', () => {
  
  test('AEC-1472: BT-101 - Minimum house number (1 digit)', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-101'));
  });
  
  test('AEC-1472: BT-102 - House number with 2 digits', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-102'));
  });
  
  test('AEC-1472: BT-103 - House number with 3 digits', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-103'));
  });
  
  test('AEC-1472: BT-104 - House number with 4 digits', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-104'));
  });
  
  test('AEC-1472: BT-105 - House number with 5 digits', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-105'));
  });
  
  test('AEC-1472: BT-106 - House number with 6 digits (boundary value)', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-106'));
  });
  
  test('AEC-1472: BT-107 - House number with 7 digits', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-107'));
  });
  
  test('AEC-1472: BT-108 - House number with 8 digits', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-108'));
  });
});

// ============================
// HOUSE NUMBER WITH CONSECUTIVE CHARACTERS
// ============================
test.describe('Address Validation - House Number with Consecutive Characters', () => {
  
  test('AEC-1472: HC-001 - House number with 1 consecutive letter (3 total chars)', async ({ page }) => {
    await runAddressTest(page, getTestCase('HC-001'));
  });
  
  test('AEC-1472: HC-002 - House number with 2 consecutive letters (4 total chars)', async ({ page }) => {
    await runAddressTest(page, getTestCase('HC-002'));
  });
  
  test('AEC-1472: HC-003 - House number with consecutive letters (5 total chars)', async ({ page }) => {
    await runAddressTest(page, getTestCase('HC-003'));
  });
  
  test('AEC-1472: HC-004 - House number with consecutive letters (6 total chars - boundary)', async ({ page }) => {
    await runAddressTest(page, getTestCase('HC-004'));
  });
  
  test('AEC-1472: HC-005 - House number with consecutive letters (7 total chars)', async ({ page }) => {
    await runAddressTest(page, getTestCase('HC-005'));
  });
  
  test('AEC-1472: HC-006 - House number with consecutive letters (8 total chars)', async ({ page }) => {
    await runAddressTest(page, getTestCase('HC-006'));
  });
  
  test('AEC-1472: HC-007 - House number with consecutive letters (9 total chars)', async ({ page }) => {
    await runAddressTest(page, getTestCase('HC-007'));
  });
  
  test('AEC-1472: HC-008 - House number with 10 consecutive digits', async ({ page }) => {
    await runAddressTest(page, getTestCase('HC-008'));
  });
});

// ============================
// REALISTIC DUTCH ADDITIONS
// ============================
test.describe('Address Validation - Realistic Dutch Additions', () => {
  
  test('AEC-1472: NL-001 - Single letter addition (most common)', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-001'));
  });
  
  test('AEC-1472: NL-002 - Latin addition (3 characters)', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-002'));
  });
  
  test('AEC-1472: NL-003 - Color-based addition (4 characters, old neighborhoods)', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-003'));
  });
  
  test('AEC-1472: NL-004 - Color-based addition (5 characters, old neighborhoods)', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-004'));
  });
  
  test('AEC-1472: NL-005 - Floor indication addition (5 characters, common)', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-005'));
  });
  
  test('AEC-1472: NL-006 - Floor indication addition (7 characters, common)', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-006'));
  });
  
  test('AEC-1472: NL-007 - Ground floor addition (8 characters, common)', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-007'));
  });
  
  test('AEC-1472: NL-008 - Basement floor addition (10 characters, common)', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-008'));
  });
  
  test('AEC-1472: NL-009 - Floor level addition (5 characters)', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-009'));
  });
  
  test('AEC-1472: NL-010 - Floor level addition (5 characters)', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-010'));
  });
  
  test('AEC-1472: NL-011 - Roman numeral addition (single digit)', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-011'));
  });
  
  test('AEC-1472: NL-012 - Roman numeral addition (double digit)', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-012'));
  });
  
  test('AEC-1472: NL-013 - Roman numeral addition (triple digit)', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-013'));
  });
  
  test('AEC-1472: NL-014 - Bus notation with parentheses', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-014'));
  });
  
  test('AEC-1472: NL-015 - Combined house number suffix and bus notation', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-015'));
  });
});

// ============================
// COMBINATIONS HOUSE NUMBER + ADDITION
// ============================
test.describe('Address Validation - Combinations', () => {
  
  test('AEC-1472: CO-001 - Maximum house number and addition (11 total chars)', async ({ page }) => {
    await runAddressTest(page, getTestCase('CO-001'));
  });
  
  test('AEC-1472: CO-002 - Both fields at limit (12 total chars)', async ({ page }) => {
    await runAddressTest(page, getTestCase('CO-002'));
  });
  
  test('AEC-1472: CO-003 - Max house number with addition over limit', async ({ page }) => {
    await runAddressTest(page, getTestCase('CO-003'));
  });
});

// ============================
// STREET NAME VALIDATION
// ============================
test.describe('Address Validation - Street Names', () => {
  
  test('AEC-1472: ST-001 - Normal street name', async ({ page }) => {
    await runAddressTest(page, getTestCase('ST-001'));
  });
  
  test('AEC-1472: ST-002 - Street name with multiple words', async ({ page }) => {
    await runAddressTest(page, getTestCase('ST-002'));
  });
  
  test('AEC-1472: ST-003 - Street name with apostrophe and hyphen', async ({ page }) => {
    await runAddressTest(page, getTestCase('ST-003'));
  });
  
  test('AEC-1472: ST-004 - Street name with hyphen', async ({ page }) => {
    await runAddressTest(page, getTestCase('ST-004'));
  });
  
  test('AEC-1472: ST-005 - Street name with periods and abbreviations', async ({ page }) => {
    await runAddressTest(page, getTestCase('ST-005'));
  });
  
  test('AEC-1472: ST-006 - Very short street name (2 characters)', async ({ page }) => {
    await runAddressTest(page, getTestCase('ST-006'));
  });
  
  test('AEC-1472: ST-007 - Maximum street name length', async ({ page }) => {
    await runAddressTest(page, getTestCase('ST-007'));
  });
  
  test('AEC-1472: ST-008 - Kempenaar 15 14 - Street name that contains a number', async ({ page }) => {
    await runAddressTest(page, getTestCase('ST-008'));
  });
});

// ============================
// SPACES AND WHITESPACE
// ============================
test.describe('Address Validation - Whitespace Handling', () => {
  
  test('AEC-1472: WS-001 - Main Street 123   ABC - Leading spaces in addition', async ({ page }) => {
    await runAddressTest(page, getTestCase('WS-001'));
  });
  
  test('AEC-1472: WS-002 - Main Street 123 ABC   - Trailing spaces in addition', async ({ page }) => {
    await runAddressTest(page, getTestCase('WS-002'));
  });
  
  test('AEC-1472: WS-003 - Main Street 123 AB CD - Space in addition', async ({ page }) => {
    await runAddressTest(page, getTestCase('WS-003'));
  });
  
  test('AEC-1472: WS-004 - Main Street 123        - Only spaces as addition', async ({ page }) => {
    await runAddressTest(page, getTestCase('WS-004'));
  });
  
  test('AEC-1472: WS-005 -   Main Street 123 A - Leading spaces in street name', async ({ page }) => {
    await runAddressTest(page, getTestCase('WS-005'));
  });
});

// ============================
// EMPTY FIELDS VALIDATION
// ============================
test.describe('Address Validation - Empty Fields', () => {
  
  test('AEC-1472: EV-001 - [empty] 123 A - Empty street name', async ({ page }) => {
    await runAddressTest(page, getTestCase('EV-001'));
  });
  
  test('AEC-1472: EV-002 - Main Street [empty] A - Empty house number', async ({ page }) => {
    await runAddressTest(page, getTestCase('EV-002'));
  });
  
  test('AEC-1472: EV-003 - Main Street 123 - Empty addition (optional field)', async ({ page }) => {
    await runAddressTest(page, getTestCase('EV-003'));
  });
  
  test('AEC-1472: EV-004 - [empty] [empty] - All fields empty', async ({ page }) => {
    await runAddressTest(page, getTestCase('EV-004'));
  });
});

// ============================
// SPECIAL CHARACTERS
// ============================
test.describe('Address Validation - Special Characters', () => {
  
  test('AEC-1472: SC-001 - Main Street 123 A-B - Hyphen in addition', async ({ page }) => {
    await runAddressTest(page, getTestCase('SC-001'));
  });
  
  test('AEC-1472: SC-002 - Main Street 123 A/B - Slash', async ({ page }) => {
    await runAddressTest(page, getTestCase('SC-002'));
  });
  
  test('AEC-1472: SC-003 - Main Street 123 A.B - Period in addition', async ({ page }) => {
    await runAddressTest(page, getTestCase('SC-003'));
  });
  
  test('AEC-1472: SC-004 - Main Street 123 A@B - Invalid character @', async ({ page }) => {
    await runAddressTest(page, getTestCase('SC-004'));
  });
  
  test('AEC-1472: SC-005 - Main Street 123 A#B - Invalid character #', async ({ page }) => {
    await runAddressTest(page, getTestCase('SC-005'));
  });
  
  test('AEC-1472: SC-006 - Main Street 123 A$B - Invalid character $', async ({ page }) => {
    await runAddressTest(page, getTestCase('SC-006'));
  });
});

// ============================
// NUMERIC VALIDATION
// ============================
test.describe('Address Validation - Numeric Validation', () => {
  
  test('AEC-1472: NV-001 - Main Street 0 - House number 0', async ({ page }) => {
    await runAddressTest(page, getTestCase('NV-001'));
  });
  
  test('AEC-1472: NV-002 - Main Street -5 - Negative house number', async ({ page }) => {
    await runAddressTest(page, getTestCase('NV-002'));
  });
  
  test('AEC-1472: NV-003 - Main Street 007 - Leading zeros', async ({ page }) => {
    await runAddressTest(page, getTestCase('NV-003'));
  });
  
  test('AEC-1472: NV-004 - Main Street 1.5 - Decimal number', async ({ page }) => {
    await runAddressTest(page, getTestCase('NV-004'));
  });
  
  test('AEC-1472: NV-005 - Main Street ABC - Letters in house number field', async ({ page }) => {
    await runAddressTest(page, getTestCase('NV-005'));
  });
  
  test('AEC-1472: NV-006 - 123Street 45 - Numbers in street name', async ({ page }) => {
    await runAddressTest(page, getTestCase('NV-006'));
  });
});
