export interface AddressTestCase {
  testId: string;
  category: string;
  streetName: string;
  houseNumber: string;
  addition: string;
  expectedResult: 'Accept' | 'Show error' | 'Accept (trimmed)';
  errorMessage?: string;
  priority: string;
  notes: string;
}

export const addressTestCases: AddressTestCase[] = [
  // BOUNDARY TESTING - ADDITION LENGTH
  { testId: 'BT-001', category: 'Boundary', streetName: 'Main Street', houseNumber: '123', addition: '', expectedResult: 'Accept', priority: 'High', notes: 'Empty addition should be allowed' },
  { testId: 'BT-002', category: 'Boundary', streetName: 'Main Street', houseNumber: '123', addition: 'A', expectedResult: 'Accept', priority: 'High', notes: 'Minimum length (1 character)' },
  { testId: 'BT-003', category: 'Boundary', streetName: 'Main Street', houseNumber: '123', addition: 'ABCDE', expectedResult: 'Accept', priority: 'High', notes: 'Just below limit (5 characters)' },
  { testId: 'BT-004', category: 'Boundary', streetName: 'Main Street', houseNumber: '123', addition: 'ABCDEF', expectedResult: 'Accept', priority: 'Critical', notes: 'Exact limit (6 characters) - boundary value' },
  { testId: 'BT-005', category: 'Boundary', streetName: 'Main Street', houseNumber: '123', addition: 'ABCDEFG', expectedResult: 'Show error', errorMessage: 'Controleer je ingevoerde gegevens', priority: 'Critical', notes: 'Over limit (7 characters)' },
  { testId: 'BT-006', category: 'Boundary', streetName: 'Main Street', houseNumber: '123', addition: 'ABCDEFGH', expectedResult: 'Show error', errorMessage: 'Controleer je ingevoerde gegevens', priority: 'High', notes: '8 characters' },
  { testId: 'BT-007', category: 'Boundary', streetName: 'Main Street', houseNumber: '123', addition: 'ABCDEFGHIJ', expectedResult: 'Show error', errorMessage: 'Controleer je ingevoerde gegevens', priority: 'High', notes: '10 characters' },
  { testId: 'BT-008', category: 'Boundary', streetName: 'Main Street', houseNumber: '123', addition: 'ABCDEFGHIJKLMNO', expectedResult: 'Show error', errorMessage: 'Controleer je ingevoerde gegevens', priority: 'Medium', notes: '15 characters - extreme case' },
  
  // BOUNDARY TESTING - HOUSE NUMBER LENGTH
  { testId: 'BT-101', category: 'Boundary', streetName: 'Main Street', houseNumber: '1', addition: '', expectedResult: 'Accept', priority: 'High', notes: 'Minimum house number' },
  { testId: 'BT-102', category: 'Boundary', streetName: 'Main Street', houseNumber: '12', addition: '', expectedResult: 'Accept', priority: 'High', notes: '2 digits' },
  { testId: 'BT-103', category: 'Boundary', streetName: 'Main Street', houseNumber: '123', addition: '', expectedResult: 'Accept', priority: 'High', notes: '3 digits' },
  { testId: 'BT-104', category: 'Boundary', streetName: 'Main Street', houseNumber: '1234', addition: '', expectedResult: 'Accept', priority: 'High', notes: '4 digits' },
  { testId: 'BT-105', category: 'Boundary', streetName: 'Main Street', houseNumber: '12345', addition: '', expectedResult: 'Accept', priority: 'High', notes: '5 digits' },
  { testId: 'BT-106', category: 'Boundary', streetName: 'Main Street', houseNumber: '123456', addition: '', expectedResult: 'Show error', errorMessage: 'Controleer je ingevoerde gegevens', priority: 'Critical', notes: '6 digits - boundary value test' },
  { testId: 'BT-107', category: 'Boundary', streetName: 'Main Street', houseNumber: '1234567', addition: '', expectedResult: 'Show error', errorMessage: 'Controleer je ingevoerde gegevens', priority: 'Critical', notes: '7 digits' },
  { testId: 'BT-108', category: 'Boundary', streetName: 'Main Street', houseNumber: '12345678', addition: '', expectedResult: 'Show error', errorMessage: 'Controleer je ingevoerde gegevens', priority: 'High', notes: '8 digits' },
  
  // HOUSE NUMBER WITH CONSECUTIVE CHARACTERS
  { testId: 'HC-001', category: 'Combination', streetName: 'Main Street', houseNumber: '12A', addition: '', expectedResult: 'Accept', priority: 'Critical', notes: 'House number + 1 letter (3 total)' },
  { testId: 'HC-002', category: 'Combination', streetName: 'Main Street', houseNumber: '12AB', addition: '', expectedResult: 'Accept', priority: 'Critical', notes: 'House number + 2 letters (4 total)' },
  { testId: 'HC-003', category: 'Combination', streetName: 'Main Street', houseNumber: '12ABC', addition: '', expectedResult: 'Accept', priority: 'Critical', notes: '5 characters total' },
  { testId: 'HC-004', category: 'Combination', streetName: 'Main Street', houseNumber: '12ABCD', addition: '', expectedResult: 'Accept', priority: 'Critical', notes: '6 characters total - boundary value' },
  { testId: 'HC-005', category: 'Combination', streetName: 'Main Street', houseNumber: '12ABCDE', addition: '', expectedResult: 'Accept', priority: 'Critical', notes: '7 characters total - possible bug' },
  { testId: 'HC-006', category: 'Combination', streetName: 'Main Street', houseNumber: '12ABCDEF', addition: '', expectedResult: 'Accept', priority: 'Critical', notes: '8 characters total' },
  { testId: 'HC-007', category: 'Combination', streetName: 'Main Street', houseNumber: '123ABCDEF', addition: '', expectedResult: 'Accept', priority: 'High', notes: '9 characters total' },
  { testId: 'HC-008', category: 'Combination', streetName: 'Main Street', houseNumber: '1234567890', addition: '', expectedResult: 'Show error', errorMessage: 'Controleer je ingevoerde gegevens', priority: 'High', notes: '10 digits' },
  
  // REALISTIC DUTCH ADDITIONS
  { testId: 'NL-001', category: 'Realistic', streetName: 'Church Street', houseNumber: '45', addition: 'A', expectedResult: 'Accept', priority: 'Critical', notes: 'Most common addition' },
  { testId: 'NL-002', category: 'Realistic', streetName: 'Church Street', houseNumber: '45', addition: 'bis', expectedResult: 'Accept', priority: 'High', notes: '3 characters' },
  { testId: 'NL-003', category: 'Realistic', streetName: 'Church Street', houseNumber: '45', addition: 'rood', expectedResult: 'Accept', priority: 'High', notes: '4 characters (occurs in old neighborhoods)' },
  { testId: 'NL-004', category: 'Realistic', streetName: 'Church Street', houseNumber: '45', addition: 'zwart', expectedResult: 'Accept', priority: 'High', notes: '5 characters (occurs in old neighborhoods)' },
  { testId: 'NL-005', category: 'Realistic', streetName: 'Church Street', houseNumber: '45', addition: 'boven', expectedResult: 'Accept', priority: 'Critical', notes: '5 characters - common' },
  { testId: 'NL-006', category: 'Realistic', streetName: 'Church Street', houseNumber: '45', addition: 'beneden', expectedResult: 'Show error', errorMessage: 'Controleer je ingevoerde gegevens', priority: 'Critical', notes: '7 characters - common, known bug' },
  { testId: 'NL-007', category: 'Realistic', streetName: 'Church Street', houseNumber: '45', addition: 'parterre', expectedResult: 'Show error', errorMessage: 'Controleer je ingevoerde gegevens', priority: 'Critical', notes: '8 characters - common' },
  { testId: 'NL-008', category: 'Realistic', streetName: 'Church Street', houseNumber: '45', addition: 'souterrain', expectedResult: 'Show error', errorMessage: 'Controleer je ingevoerde gegevens', priority: 'Critical', notes: '10 characters - common' },
  { testId: 'NL-009', category: 'Realistic', streetName: 'Church Street', houseNumber: '45', addition: '2hoog', expectedResult: 'Accept', priority: 'High', notes: '5 characters' },
  { testId: 'NL-010', category: 'Realistic', streetName: 'Church Street', houseNumber: '45', addition: '3hoog', expectedResult: 'Accept', priority: 'High', notes: '5 characters' },
  { testId: 'NL-011', category: 'Realistic', streetName: 'Church Street', houseNumber: '45', addition: 'I', expectedResult: 'Accept', priority: 'Medium', notes: 'Roman numeral' },
  { testId: 'NL-012', category: 'Realistic', streetName: 'Church Street', houseNumber: '45', addition: 'II', expectedResult: 'Accept', priority: 'Medium', notes: 'Roman numeral' },
  { testId: 'NL-013', category: 'Realistic', streetName: 'Church Street', houseNumber: '45', addition: 'III', expectedResult: 'Accept', priority: 'Medium', notes: '3 characters' },
  { testId: 'NL-014', category: 'Realistic', streetName: 'Church Street', houseNumber: '45', addition: '(bus-1)', expectedResult: 'Show error', errorMessage: 'Controleer je ingevoerde gegevens', priority: 'Medium', notes: 'additional scenario' },
  { testId: 'NL-015', category: 'Realistic', streetName: 'Church Street', houseNumber: '45A', addition: 'Bus1', expectedResult: 'Accept', priority: 'Medium', notes: 'additional scenario' },
  
  // COMBINATIONS HOUSE NUMBER + ADDITION
  { testId: 'CO-001', category: 'Combination', streetName: 'Village Street', houseNumber: '12345', addition: 'ABCDEF', expectedResult: 'Accept', priority: 'High', notes: 'Max both fields (11 total)' },
  { testId: 'CO-002', category: 'Combination', streetName: 'Village Street', houseNumber: '123456', addition: 'ABCDEF', expectedResult: 'Show error', errorMessage: 'Controleer je ingevoerde gegevens', priority: 'High', notes: 'Both at limit (12 total)' },
  { testId: 'CO-003', category: 'Combination', streetName: 'Village Street', houseNumber: '12345', addition: 'ABCDEFG', expectedResult: 'Show error', errorMessage: 'Controleer je ingevoerde gegevens', priority: 'High', notes: 'Addition over limit' },
  
  // STREET NAME VALIDATION
  { testId: 'ST-001', category: 'Street Name', streetName: 'Main Street', houseNumber: '1', addition: '', expectedResult: 'Accept', priority: 'High', notes: 'Normal street name' },
  { testId: 'ST-002', category: 'Street Name', streetName: 'van der Helst Street', houseNumber: '1', addition: '', expectedResult: 'Accept', priority: 'High', notes: 'Multiple words' },
  { testId: 'ST-003', category: 'Street Name', streetName: "'s-Graveland Road", houseNumber: '1', addition: '', expectedResult: 'Accept', priority: 'High', notes: 'Apostrophe and hyphen' },
  { testId: 'ST-004', category: 'Street Name', streetName: 'Jan-Pieter Heije Street', houseNumber: '1', addition: '', expectedResult: 'Accept', priority: 'High', notes: 'Hyphen in name' },
  { testId: 'ST-005', category: 'Street Name', streetName: 'Dr. P.J.H. Cuypers Street', houseNumber: '1', addition: '', expectedResult: 'Accept', priority: 'Medium', notes: 'Periods and abbreviations' },
  { testId: 'ST-006', category: 'Street Name', streetName: 'Aa', houseNumber: '1', addition: '', expectedResult: 'Accept', priority: 'Medium', notes: 'Very short street name (2 characters)' },
  { testId: 'ST-007', category: 'Street Name', streetName: 'Professor Doctor Jan van der Waals Straat met een hele lange naam', houseNumber: '1', addition: '', expectedResult: 'Accept', priority: 'Medium', notes: 'Test maximum street name length' },
  
  // SPACES AND WHITESPACE
  { testId: 'WS-001', category: 'Whitespace', streetName: 'Main Street', houseNumber: '123', addition: '  ABC', expectedResult: 'Accept (trimmed)', priority: 'High', notes: 'Leading spaces in addition' },
  { testId: 'WS-002', category: 'Whitespace', streetName: 'Main Street', houseNumber: '123', addition: 'ABC  ', expectedResult: 'Accept (trimmed)', priority: 'High', notes: 'Trailing spaces in addition' },
  { testId: 'WS-003', category: 'Whitespace', streetName: 'Main Street', houseNumber: '123', addition: 'AB CD', expectedResult: 'Accept', priority: 'Medium', notes: 'Space in addition' },
  { testId: 'WS-004', category: 'Whitespace', streetName: 'Main Street', houseNumber: '123', addition: '      ', expectedResult: 'Accept', priority: 'Medium', notes: 'Only spaces as addition' },
  { testId: 'WS-005', category: 'Whitespace', streetName: '  Main Street', houseNumber: '123', addition: 'A', expectedResult: 'Accept (trimmed)', priority: 'High', notes: 'Leading spaces in street name' },
  
  // EMPTY FIELDS
  { testId: 'EV-001', category: 'Validation', streetName: '', houseNumber: '123', addition: 'A', expectedResult: 'Show error', errorMessage: 'Controleer je ingevoerde gegevens', priority: 'Critical', notes: 'Empty street name' },
  { testId: 'EV-002', category: 'Validation', streetName: 'Main Street', houseNumber: '', addition: 'A', expectedResult: 'Show error', errorMessage: 'Controleer je ingevoerde gegevens', priority: 'Critical', notes: 'Empty house number' },
  { testId: 'EV-003', category: 'Validation', streetName: 'Main Street', houseNumber: '123', addition: '', expectedResult: 'Accept', priority: 'Critical', notes: 'Empty addition (optional field)' },
  { testId: 'EV-004', category: 'Validation', streetName: '', houseNumber: '', addition: '', expectedResult: 'Show error', errorMessage: 'Controleer je ingevoerde gegevens', priority: 'High', notes: 'All fields empty' },
  
  // SPECIAL CHARACTERS
  { testId: 'SC-001', category: 'Validation', streetName: 'Main Street', houseNumber: '123', addition: 'A-B', expectedResult: 'Accept', priority: 'Medium', notes: 'Hyphen in addition' },
  { testId: 'SC-002', category: 'Validation', streetName: 'Main Street', houseNumber: '123', addition: 'A/B', expectedResult: 'Accept', priority: 'Medium', notes: 'Slash' },
  { testId: 'SC-003', category: 'Validation', streetName: 'Main Street', houseNumber: '123', addition: 'A.B', expectedResult: 'Accept', priority: 'Medium', notes: 'Period in addition' },
  { testId: 'SC-004', category: 'Validation', streetName: 'Main Street', houseNumber: '123', addition: 'A@B', expectedResult: 'Accept', priority: 'High', notes: 'Invalid character @' },
  { testId: 'SC-005', category: 'Validation', streetName: 'Main Street', houseNumber: '123', addition: 'A#B', expectedResult: 'Accept', priority: 'High', notes: 'Invalid character #' },
  { testId: 'SC-006', category: 'Validation', streetName: 'Main Street', houseNumber: '123', addition: 'A$B', expectedResult: 'Accept', priority: 'High', notes: 'Invalid character $' },
  
  // NUMERIC VALIDATION
  { testId: 'NV-001', category: 'Validation', streetName: 'Main Street', houseNumber: '0', addition: '', expectedResult: 'Accept', priority: 'High', notes: 'House number 0' },
  { testId: 'NV-002', category: 'Validation', streetName: 'Main Street', houseNumber: '-5', addition: '', expectedResult: 'Show error', errorMessage: 'Controleer je ingevoerde gegevens', priority: 'High', notes: 'Negative house number' },
  { testId: 'NV-003', category: 'Validation', streetName: 'Main Street', houseNumber: '007', addition: '', expectedResult: 'Accept', priority: 'Medium', notes: 'Leading zeros' },
  { testId: 'NV-004', category: 'Validation', streetName: 'Main Street', houseNumber: '1.5', addition: '', expectedResult: 'Accept', priority: 'Medium', notes: 'Decimal number' },
  { testId: 'NV-005', category: 'Validation', streetName: 'Main Street', houseNumber: 'ABC', addition: '', expectedResult: 'Show error', errorMessage: 'Controleer je ingevoerde gegevens', priority: 'High', notes: 'Letters in house number field' },
  { testId: 'NV-006', category: 'Validation', streetName: '123Street', houseNumber: '45', addition: '', expectedResult: 'Accept', priority: 'Medium', notes: 'Numbers in street name' },
];
