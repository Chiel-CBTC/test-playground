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
  await page.screenshot({ path: screenshotPath, fullPage: true });
}

// ============================
// BOUNDARY TESTING - ADDITION LENGTH
// ============================
test.describe('Address Validation - Boundary Testing (Addition Length) @S99b40692', () => {
  test('AEC-1472: BT-001 - Main Street 123 - Empty addition should be allowed @T974d89c1', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-001'));
  });
  
  test('AEC-1472: BT-002 - Main Street 123 A - Minimum length (1 character) @T65252245', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-002'));
  });
  
  test('AEC-1472: BT-003 - Main Street 123 ABCDE - Just below limit (5 characters) @T0432562c', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-003'));
  });
  
  test('AEC-1472: BT-004 - Main Street 123 ABCDEF - Exact limit (6 characters) - boundary value @T9d00d7fb', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-004'));
  });
  
  test('AEC-1472: BT-005 - Main Street 123 ABCDEFG - Over limit (7 characters) @Ta8264790', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-005'));
  });
  
  test('AEC-1472: BT-006 - Main Street 123 ABCDEFGH - 8 characters @Tded816aa', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-006'));
  });
  
  test('AEC-1472: BT-007 - Main Street 123 ABCDEFGHIJ - 10 characters @T7f4349fb', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-007'));
  });
  
  test('AEC-1472: BT-008 - Main Street 123 ABCDEFGHIJKLMNO - 15 characters - extreme case @T3e6852bd', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-008'));
  });
});

// ============================
// BOUNDARY TESTING - HOUSE NUMBER LENGTH
// ============================
test.describe('Address Validation - Boundary Testing (House Number Length) @S56703ab1', () => {
  
  test('AEC-1472: BT-101 - Main Street 1 - Minimum house number @Tc940ab2d', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-101'));
  });
  
  test('AEC-1472: BT-102 - Main Street 12 - 2 digits @T757e126e', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-102'));
  });
  
  test('AEC-1472: BT-103 - Main Street 123 - 3 digits @T53e94377', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-103'));
  });
  
  test('AEC-1472: BT-104 - Main Street 1234 - 4 digits @Tb7223faf', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-104'));
  });
  
  test('AEC-1472: BT-105 - Main Street 12345 - 5 digits @Td708d8e7', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-105'));
  });
  
  test('AEC-1472: BT-106 - Main Street 123456 - 6 digits - boundary value test @Tf4341af5', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-106'));
  });
  
  test('AEC-1472: BT-107 - Main Street 1234567 - 7 digits @Tec005418', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-107'));
  });
  
  test('AEC-1472: BT-108 - Main Street 12345678 - 8 digits @T72a77598', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-108'));
  });
});

// ============================
// HOUSE NUMBER WITH CONSECUTIVE CHARACTERS
// ============================
test.describe('Address Validation - House Number with Consecutive Characters @Sae1cf48e', () => {
  
  test('AEC-1472: HC-001 - Main Street 12A - House number + 1 letter (3 total) @T66a2c392', async ({ page }) => {
    await runAddressTest(page, getTestCase('HC-001'));
  });
  
  test('AEC-1472: HC-002 - Main Street 12AB - House number + 2 letters (4 total) @T8a20ff6a', async ({ page }) => {
    await runAddressTest(page, getTestCase('HC-002'));
  });
  
  test('AEC-1472: HC-003 - Main Street 12ABC - 5 characters total @T990256b2', async ({ page }) => {
    await runAddressTest(page, getTestCase('HC-003'));
  });
  
  test('AEC-1472: HC-004 - Main Street 12ABCD - 6 characters total - boundary value @Teb0f5645', async ({ page }) => {
    await runAddressTest(page, getTestCase('HC-004'));
  });
  
  test('AEC-1472: HC-005 - Main Street 12ABCDE - 7 characters total - possible bug @T1ac17ca5', async ({ page }) => {
    await runAddressTest(page, getTestCase('HC-005'));
  });
  
  test('AEC-1472: HC-006 - Main Street 12ABCDEF - 8 characters total @T3ca70dea', async ({ page }) => {
    await runAddressTest(page, getTestCase('HC-006'));
  });
  
  test('AEC-1472: HC-007 - Main Street 123ABCDEF - 9 characters total @T18caab57', async ({ page }) => {
    await runAddressTest(page, getTestCase('HC-007'));
  });
  
  test('AEC-1472: HC-008 - Main Street 1234567890 - 10 digits @T8141c4dc', async ({ page }) => {
    await runAddressTest(page, getTestCase('HC-008'));
  });
});

// ============================
// REALISTIC DUTCH ADDITIONS
// ============================
test.describe('Address Validation - Realistic Dutch Additions @S53f8272c', () => {
  
  test('AEC-1472: NL-001 - Church Street 45 A - Most common addition @T2a5d7caf', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-001'));
  });
  
  test('AEC-1472: NL-002 - Church Street 45 bis - 3 characters @T4df5f5d2', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-002'));
  });
  
  test('AEC-1472: NL-003 - Church Street 45 rood - 4 characters (occurs in old neighborhoods) @T10ea94ac', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-003'));
  });
  
  test('AEC-1472: NL-004 - Church Street 45 zwart - 5 characters (occurs in old neighborhoods) @T1e4d87b6', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-004'));
  });
  
  test('AEC-1472: NL-005 - Church Street 45 boven - 5 characters - common @T9af6f7f1', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-005'));
  });
  
  test('AEC-1472: NL-006 - Church Street 45 beneden - 7 characters - common @T577713ff', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-006'));
  });
  
  test('AEC-1472: NL-007 - Church Street 45 parterre - 8 characters - common @T8575b5ab', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-007'));
  });
  
  test('AEC-1472: NL-008 - Church Street 45 souterrain - 10 characters - common @T1ff323c4', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-008'));
  });
  
  test('AEC-1472: NL-009 - Church Street 45 2hoog - 5 characters @Ta51ef9ab', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-009'));
  });
  
  test('AEC-1472: NL-010 - Church Street 45 3hoog - 5 characters @T6c4477bd', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-010'));
  });
  
  test('AEC-1472: NL-011 - Church Street 45 I - Roman numeral @T66e967d8', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-011'));
  });
  
  test('AEC-1472: NL-012 - Church Street 45 II - Roman numeral @Ta93483c6', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-012'));
  });
  
  test('AEC-1472: NL-013 - Church Street 45 III - 3 characters @Tc84344f5', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-013'));
  });
  
  test('AEC-1472: NL-014 - Church Street 45 (bus-1) - additional scenario @T59d88c95', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-014'));
  });
  
  test('AEC-1472: NL-015 - Church Street 45A Bus1 - additional scenario @T7b7cafe4', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-015'));
  });
});

// ============================
// COMBINATIONS HOUSE NUMBER + ADDITION
// ============================
test.describe('Address Validation - Combinations @Sf43975cd', () => {
  
  test('AEC-1472: CO-001 - Village Street 12345 ABCDEF - Max both fields (11 total) @T740fc929', async ({ page }) => {
    await runAddressTest(page, getTestCase('CO-001'));
  });
  
  test('AEC-1472: CO-002 - Village Street 123456 ABCDEF - Both at limit (12 total) @T661f3a2f', async ({ page }) => {
    await runAddressTest(page, getTestCase('CO-002'));
  });
  
  test('AEC-1472: CO-003 - Village Street 12345 ABCDEFG - Addition over limit @Tab4c80fa', async ({ page }) => {
    await runAddressTest(page, getTestCase('CO-003'));
  });
});

// ============================
// STREET NAME VALIDATION
// ============================
test.describe('Address Validation - Street Names @Sd2d05ba0', () => {
  
  test('AEC-1472: ST-001 - Main Street 1 - Normal street name @T389e8c86', async ({ page }) => {
    await runAddressTest(page, getTestCase('ST-001'));
  });
  
  test('AEC-1472: ST-002 - van der Helst Street 1 - Multiple words @T649518bd', async ({ page }) => {
    await runAddressTest(page, getTestCase('ST-002'));
  });
  
  test('AEC-1472: ST-003 - \'s-Graveland Road 1 - Apostrophe and hyphen @Taa2baa61', async ({ page }) => {
    await runAddressTest(page, getTestCase('ST-003'));
  });
  
  test('AEC-1472: ST-004 - Jan-Pieter Heije Street 1 - Hyphen in name @Tbed7bfb2', async ({ page }) => {
    await runAddressTest(page, getTestCase('ST-004'));
  });
  
  test('AEC-1472: ST-005 - Dr. P.J.H. Cuypers Street 1 - Periods and abbreviations @T3ddaad5c', async ({ page }) => {
    await runAddressTest(page, getTestCase('ST-005'));
  });
  
  test('AEC-1472: ST-006 - Aa 1 - Very short street name (2 characters) @T4c2d3a25', async ({ page }) => {
    await runAddressTest(page, getTestCase('ST-006'));
  });
  
  test('AEC-1472: ST-007 - Professor Doctor Jan van der Waals Straat met een hele lange naam 1 - Test maximum street name length @Tc823e0dd', async ({ page }) => {
    await runAddressTest(page, getTestCase('ST-007'));
  });
  
  test('AEC-1472: ST-008 - Kempenaar 15 14 - Street name that contains a number @T436b16ae', async ({ page }) => {
    await runAddressTest(page, getTestCase('ST-008'));
  });
});

// ============================
// SPACES AND WHITESPACE
// ============================
test.describe('Address Validation - Whitespace Handling @Seead8948', () => {
  
  test('AEC-1472: WS-001 - Main Street 123   ABC - Leading spaces in addition @T7f110e9c', async ({ page }) => {
    await runAddressTest(page, getTestCase('WS-001'));
  });
  
  test('AEC-1472: WS-002 - Main Street 123 ABC   - Trailing spaces in addition @Td4ac7922', async ({ page }) => {
    await runAddressTest(page, getTestCase('WS-002'));
  });
  
  test('AEC-1472: WS-003 - Main Street 123 AB CD - Space in addition @T6d104fac', async ({ page }) => {
    await runAddressTest(page, getTestCase('WS-003'));
  });
  
  test('AEC-1472: WS-004 - Main Street 123        - Only spaces as addition @T0147c0f9', async ({ page }) => {
    await runAddressTest(page, getTestCase('WS-004'));
  });
  
  test('AEC-1472: WS-005 -   Main Street 123 A - Leading spaces in street name @T603f3284', async ({ page }) => {
    await runAddressTest(page, getTestCase('WS-005'));
  });
});

// ============================
// EMPTY FIELDS VALIDATION
// ============================
test.describe('Address Validation - Empty Fields @S5c741f2c', () => {
  
  test('AEC-1472: EV-001 - [empty] 123 A - Empty street name @Ta047c48f', async ({ page }) => {
    await runAddressTest(page, getTestCase('EV-001'));
  });
  
  test('AEC-1472: EV-002 - Main Street [empty] A - Empty house number @T0e5cad3a', async ({ page }) => {
    await runAddressTest(page, getTestCase('EV-002'));
  });
  
  test('AEC-1472: EV-003 - Main Street 123 - Empty addition (optional field) @T96a544bb', async ({ page }) => {
    await runAddressTest(page, getTestCase('EV-003'));
  });
  
  test('AEC-1472: EV-004 - [empty] [empty] - All fields empty @Tcb9d1894', async ({ page }) => {
    await runAddressTest(page, getTestCase('EV-004'));
  });
});

// ============================
// SPECIAL CHARACTERS
// ============================
test.describe('Address Validation - Special Characters @Sb72d8192', () => {
  
  test('AEC-1472: SC-001 - Main Street 123 A-B - Hyphen in addition @Tcea6a2c3', async ({ page }) => {
    await runAddressTest(page, getTestCase('SC-001'));
  });
  
  test('AEC-1472: SC-002 - Main Street 123 A/B - Slash @T585bb49b', async ({ page }) => {
    await runAddressTest(page, getTestCase('SC-002'));
  });
  
  test('AEC-1472: SC-003 - Main Street 123 A.B - Period in addition @T1912dfbf', async ({ page }) => {
    await runAddressTest(page, getTestCase('SC-003'));
  });
  
  test('AEC-1472: SC-004 - Main Street 123 A@B - Invalid character @ @Td70ca546', async ({ page }) => {
    await runAddressTest(page, getTestCase('SC-004'));
  });
  
  test('AEC-1472: SC-005 - Main Street 123 A#B - Invalid character # @T67698d14', async ({ page }) => {
    await runAddressTest(page, getTestCase('SC-005'));
  });
  
  test('AEC-1472: SC-006 - Main Street 123 A$B - Invalid character $ @T6a60278d', async ({ page }) => {
    await runAddressTest(page, getTestCase('SC-006'));
  });
});

// ============================
// NUMERIC VALIDATION
// ============================
test.describe('Address Validation - Numeric Validation @Sbbe71713', () => {
  
  test('AEC-1472: NV-001 - Main Street 0 - House number 0 @T8f7f9045', async ({ page }) => {
    await runAddressTest(page, getTestCase('NV-001'));
  });
  
  test('AEC-1472: NV-002 - Main Street -5 - Negative house number @T8d2560f7', async ({ page }) => {
    await runAddressTest(page, getTestCase('NV-002'));
  });
  
  test('AEC-1472: NV-003 - Main Street 007 - Leading zeros @T908af664', async ({ page }) => {
    await runAddressTest(page, getTestCase('NV-003'));
  });
  
  test('AEC-1472: NV-004 - Main Street 1.5 - Decimal number @T688960d2', async ({ page }) => {
    await runAddressTest(page, getTestCase('NV-004'));
  });
  
  test('AEC-1472: NV-005 - Main Street ABC - Letters in house number field @T7adc5736', async ({ page }) => {
    await runAddressTest(page, getTestCase('NV-005'));
  });
  
  test('AEC-1472: NV-006 - 123Street 45 - Numbers in street name @T22ec8e51', async ({ page }) => {
    await runAddressTest(page, getTestCase('NV-006'));
  });
});
