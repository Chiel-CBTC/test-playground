import { test, expect } from '@playwright/test';
import { addressTestCases } from '../test-data/address-test-cases';
import { completeCheckoutFlow, buildAddressField } from '../helpers/checkout-helper';

// Filter out categories that shouldn't be automated
const automatedTestCases = addressTestCases.filter(tc => 
  !['Security', 'Interaction', 'A11y'].includes(tc.category)
);

// Helper to get test case by ID
function getTestCase(testId) {
  return automatedTestCases.find(tc => tc.testId === testId);
}

// Helper function to run address validation test
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
test.describe('Address Validation - Boundary Testing (Addition Length) @S7a2d5672', () => {
  test('AEC-1472: BT-001 - Empty addition should be allowed @T06611464', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-001'));
  });
  
  test('AEC-1472: BT-002 - Minimum length (1 character) @T9ab25dcc', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-002'));
  });
  
  test('AEC-1472: BT-003 - Just below limit (5 characters) @T8e109cde', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-003'));
  });
  
  test('AEC-1472: BT-004 - Exact limit (6 characters) - boundary value @Ted171a60', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-004'));
  });
  
  test('AEC-1472: BT-005 - Over limit (7 characters) @Tfd1f71aa', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-005'));
  });
  
  test('AEC-1472: BT-006 - 8 characters @T8069481d', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-006'));
  });
  
  test('AEC-1472: BT-007 - 10 characters @T13474d8c', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-007'));
  });
  
  test('AEC-1472: BT-008 - 15 characters - extreme case @T90315a1c', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-008'));
  });
});

// ============================
// BOUNDARY TESTING - HOUSE NUMBER LENGTH
// ============================
test.describe('Address Validation - Boundary Testing (House Number Length) @S4fe0774f', () => {
  
  test('AEC-1472: BT-101 - Minimum house number @T15ccb23f', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-101'));
  });
  
  test('AEC-1472: BT-102 - 2 digits @T9c6d3bae', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-102'));
  });
  
  test('AEC-1472: BT-103 - 3 digits @T50b6bd69', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-103'));
  });
  
  test('AEC-1472: BT-104 - 4 digits @Tab4975f4', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-104'));
  });
  
  test('AEC-1472: BT-105 - 5 digits @T36e4e21f', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-105'));
  });
  
  test('AEC-1472: BT-106 - 6 digits - boundary value test @T6cc00c19', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-106'));
  });
  
  test('AEC-1472: BT-107 - 7 digits @Tad1616b6', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-107'));
  });
  
  test('AEC-1472: BT-108 - 8 digits @Tda9c2f79', async ({ page }) => {
    await runAddressTest(page, getTestCase('BT-108'));
  });
});

// ============================
// HOUSE NUMBER WITH CONSECUTIVE CHARACTERS
// ============================
test.describe('Address Validation - House Number with Consecutive Characters @Sf7081067', () => {
  
  test('AEC-1472: HC-001 - House number + 1 letter (3 total) @T9b084d7d', async ({ page }) => {
    await runAddressTest(page, getTestCase('HC-001'));
  });
  
  test('AEC-1472: HC-002 - House number + 2 letters (4 total) @T159a05c9', async ({ page }) => {
    await runAddressTest(page, getTestCase('HC-002'));
  });
  
  test('AEC-1472: HC-003 - 5 characters total @T9b8e9aca', async ({ page }) => {
    await runAddressTest(page, getTestCase('HC-003'));
  });
  
  test('AEC-1472: HC-004 - 6 characters total - boundary value @Tc02fb3a2', async ({ page }) => {
    await runAddressTest(page, getTestCase('HC-004'));
  });
  
  test('AEC-1472: HC-005 - 7 characters total - possible bug @Tbb2ad13c', async ({ page }) => {
    await runAddressTest(page, getTestCase('HC-005'));
  });
  
  test('AEC-1472: HC-006 - 8 characters total @Taa07db0f', async ({ page }) => {
    await runAddressTest(page, getTestCase('HC-006'));
  });
  
  test('AEC-1472: HC-007 - 9 characters total @Taa542c94', async ({ page }) => {
    await runAddressTest(page, getTestCase('HC-007'));
  });
  
  test('AEC-1472: HC-008 - 10 digits @T2a9e8875', async ({ page }) => {
    await runAddressTest(page, getTestCase('HC-008'));
  });
});

// ============================
// REALISTIC DUTCH ADDITIONS
// ============================
test.describe('Address Validation - Realistic Dutch Additions @S33eb7129', () => {
  
  test('AEC-1472: NL-001 - Most common addition @T63386633', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-001'));
  });
  
  test('AEC-1472: NL-002 - 3 characters @T31da2387', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-002'));
  });
  
  test('AEC-1472: NL-003 - 4 characters (occurs in old neighborhoods) @T3aad2a64', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-003'));
  });
  
  test('AEC-1472: NL-004 - 5 characters (occurs in old neighborhoods) @T09aa4a1c', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-004'));
  });
  
  test('AEC-1472: NL-005 - 5 characters - common @T4cc9e97b', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-005'));
  });
  
  test('AEC-1472: NL-006 - 7 characters - common, known bug @T6c83c2be', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-006'));
  });
  
  test('AEC-1472: NL-007 - 8 characters - common @T1d77f5b7', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-007'));
  });
  
  test('AEC-1472: NL-008 - 10 characters - common @T0b53de3c', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-008'));
  });
  
  test('AEC-1472: NL-009 - 5 characters @T3ff80ad9', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-009'));
  });
  
  test('AEC-1472: NL-010 - 5 characters @Tc81b6dd5', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-010'));
  });
  
  test('AEC-1472: NL-011 - Roman numeral @T6b981176', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-011'));
  });
  
  test('AEC-1472: NL-012 - Roman numeral @T51b0b686', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-012'));
  });
  
  test('AEC-1472: NL-013 - 3 characters @T2c9b5e5d', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-013'));
  });
  
  test('AEC-1472: NL-014 - additional scenario @Te63349c3', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-014'));
  });
  
  test('AEC-1472: NL-015 - additional scenario @T0bb89db0', async ({ page }) => {
    await runAddressTest(page, getTestCase('NL-015'));
  });
});

// ============================
// COMBINATIONS HOUSE NUMBER + ADDITION
// ============================
test.describe('Address Validation - Combinations @S5e0948fd', () => {
  
  test('AEC-1472: CO-001 - Max both fields (11 total) @Tc4c18f6a', async ({ page }) => {
    await runAddressTest(page, getTestCase('CO-001'));
  });
  
  test('AEC-1472: CO-002 - Both at limit (12 total) @T27d038c5', async ({ page }) => {
    await runAddressTest(page, getTestCase('CO-002'));
  });
  
  test('AEC-1472: CO-003 - Addition over limit @T0b6c0266', async ({ page }) => {
    await runAddressTest(page, getTestCase('CO-003'));
  });
});

// ============================
// STREET NAME VALIDATION
// ============================
test.describe('Address Validation - Street Names @Sa823b59d', () => {
  
  test('AEC-1472: ST-001 - Normal street name @Td0197307', async ({ page }) => {
    await runAddressTest(page, getTestCase('ST-001'));
  });
  
  test('AEC-1472: ST-002 - Multiple words @T73c86a5d', async ({ page }) => {
    await runAddressTest(page, getTestCase('ST-002'));
  });
  
  test('AEC-1472: ST-003 - Apostrophe and hyphen @T05437693', async ({ page }) => {
    await runAddressTest(page, getTestCase('ST-003'));
  });
  
  test('AEC-1472: ST-004 - Hyphen in name @T582f7edd', async ({ page }) => {
    await runAddressTest(page, getTestCase('ST-004'));
  });
  
  test('AEC-1472: ST-005 - Periods and abbreviations @T907db5c5', async ({ page }) => {
    await runAddressTest(page, getTestCase('ST-005'));
  });
  
  test('AEC-1472: ST-006 - Very short street name (2 characters) @Tf227eefa', async ({ page }) => {
    await runAddressTest(page, getTestCase('ST-006'));
  });
  
  test('AEC-1472: ST-007 - Test maximum street name length @T00e7366b', async ({ page }) => {
    await runAddressTest(page, getTestCase('ST-007'));
  });
});

// ============================
// SPACES AND WHITESPACE
// ============================
test.describe('Address Validation - Whitespace Handling @S64565af5', () => {
  
  test('AEC-1472: WS-001 - Leading spaces in addition @Tfeb019d8', async ({ page }) => {
    await runAddressTest(page, getTestCase('WS-001'));
  });
  
  test('AEC-1472: WS-002 - Trailing spaces in addition @Tabc42b16', async ({ page }) => {
    await runAddressTest(page, getTestCase('WS-002'));
  });
  
  test('AEC-1472: WS-003 - Space in addition @Te6dc44d2', async ({ page }) => {
    await runAddressTest(page, getTestCase('WS-003'));
  });
  
  test('AEC-1472: WS-004 - Only spaces as addition @Ta7f036c4', async ({ page }) => {
    await runAddressTest(page, getTestCase('WS-004'));
  });
  
  test('AEC-1472: WS-005 - Leading spaces in street name @T9d59622e', async ({ page }) => {
    await runAddressTest(page, getTestCase('WS-005'));
  });
});

// ============================
// EMPTY FIELDS VALIDATION
// ============================
test.describe('Address Validation - Empty Fields @Sde77e7a1', () => {
  
  test('AEC-1472: EV-001 - Empty street name @Tc226d6a1', async ({ page }) => {
    await runAddressTest(page, getTestCase('EV-001'));
  });
  
  test('AEC-1472: EV-002 - Empty house number @T20cacc96', async ({ page }) => {
    await runAddressTest(page, getTestCase('EV-002'));
  });
  
  test('AEC-1472: EV-003 - Empty addition (optional field) @T3f1a62b5', async ({ page }) => {
    await runAddressTest(page, getTestCase('EV-003'));
  });
  
  test('AEC-1472: EV-004 - All fields empty @Tcde00618', async ({ page }) => {
    await runAddressTest(page, getTestCase('EV-004'));
  });
});

// ============================
// SPECIAL CHARACTERS
// ============================
test.describe('Address Validation - Special Characters @S1f5fdbc7', () => {
  
  test('AEC-1472: SC-001 - Hyphen in addition @T4469b215', async ({ page }) => {
    await runAddressTest(page, getTestCase('SC-001'));
  });
  
  test('AEC-1472: SC-002 - Slash @T0eabe27f', async ({ page }) => {
    await runAddressTest(page, getTestCase('SC-002'));
  });
  
  test('AEC-1472: SC-003 - Period in addition @T474c796e', async ({ page }) => {
    await runAddressTest(page, getTestCase('SC-003'));
  });
  
  test('AEC-1472: SC-004 - Invalid character @ @T32091e81', async ({ page }) => {
    await runAddressTest(page, getTestCase('SC-004'));
  });
  
  test('AEC-1472: SC-005 - Invalid character # @T1a3fd5b1', async ({ page }) => {
    await runAddressTest(page, getTestCase('SC-005'));
  });
  
  test('AEC-1472: SC-006 - Invalid character $ @T4507bf2f', async ({ page }) => {
    await runAddressTest(page, getTestCase('SC-006'));
  });
});

// ============================
// NUMERIC VALIDATION
// ============================
test.describe('Address Validation - Numeric Validation @S63039da4', () => {
  
  test('AEC-1472: NV-001 - House number 0 @T7eaca871', async ({ page }) => {
    await runAddressTest(page, getTestCase('NV-001'));
  });
  
  test('AEC-1472: NV-002 - Negative house number @T3b069675', async ({ page }) => {
    await runAddressTest(page, getTestCase('NV-002'));
  });
  
  test('AEC-1472: NV-003 - Leading zeros @Tbcad2e8d', async ({ page }) => {
    await runAddressTest(page, getTestCase('NV-003'));
  });
  
  test('AEC-1472: NV-004 - Decimal number @Ta88747c1', async ({ page }) => {
    await runAddressTest(page, getTestCase('NV-004'));
  });
  
  test('AEC-1472: NV-005 - Letters in house number field @Tb524b81b', async ({ page }) => {
    await runAddressTest(page, getTestCase('NV-005'));
  });
  
  test('AEC-1472: NV-006 - Numbers in street name @T0d69850e', async ({ page }) => {
    await runAddressTest(page, getTestCase('NV-006'));
  });
});
