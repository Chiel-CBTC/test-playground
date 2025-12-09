# Test Naming Update - User Story Reference Added

## Summary

Added user story reference **AEC-1472** to all address validation test titles and screenshot filenames.

## Changes Made

### 1. Test Titles

**Before:**
```
BT-001 - Empty addition should be allowed
BT-002 - Minimum length (1 character)
NL-001 - Most common addition
```

**After:**
```
AEC-1472 BT-001 - Empty addition should be allowed
AEC-1472 BT-002 - Minimum length (1 character)
AEC-1472 NL-001 - Most common addition
```

### 2. Screenshot Filenames

**Before:**
```
screenshots/address-tests/BT-001-Boundary.png
screenshots/address-tests/BT-001-before-click.png
screenshots/address-tests/NL-001-Realistic.png
```

**After:**
```
screenshots/address-tests/AEC-1472_BT-001-Boundary.png
screenshots/address-tests/AEC-1472_BT-001-before-click.png
screenshots/address-tests/AEC-1472_NL-001-Realistic.png
```

## Files Modified

1. **clients/action/tests/address-validation.spec.ts**
   - Updated test title to include `AEC-1472` prefix
   - Updated screenshot path to include `AEC-1472_` prefix

2. **clients/action/helpers/checkout-helper.ts**
   - Updated "before-click" screenshot path to include `AEC-1472_` prefix

## Running Tests

The commands remain the same:

```bash
# Run all address validation tests
npm run test:action clients/action/tests/address-validation.spec.ts

# Run specific test (now includes AEC-1472 in output)
npm run test:action clients/action/tests/address-validation.spec.ts -- -g "BT-002"

# You can also search by user story
npm run test:action clients/action/tests/address-validation.spec.ts -- -g "AEC-1472"
```

## Benefits

1. **Traceability**: Easy to link test results to user story AEC-1472
2. **Reporting**: Test reports now show the user story reference
3. **Organization**: Screenshots are clearly linked to the user story
4. **Filtering**: Can filter/search tests by user story number

## Example Output

When running tests, you'll now see:

```
✓ AEC-1472 BT-001 - Empty addition should be allowed (5s)
✓ AEC-1472 BT-002 - Minimum length (1 character) (4s)
✓ AEC-1472 BT-003 - Just below limit (5 characters) (5s)
```

## Screenshot Examples

New screenshots will be saved as:
- `AEC-1472_BT-001-Boundary.png`
- `AEC-1472_BT-001-before-click.png`
- `AEC-1472_NL-005-Realistic.png`
- `AEC-1472_NL-005-before-click.png`

Old screenshots (without AEC-1472 prefix) will remain until you run the tests again.
