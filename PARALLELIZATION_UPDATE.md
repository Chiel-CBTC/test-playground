# Test Configuration Update

## Summary

Tests now run **headless with 6 parallel workers by default** for maximum speed.

## Changes Made

### 1. playwright.config.ts

**Before:**
```typescript
fullyParallel: false,  // Tests ran serially
workers: 1,            // One test at a time
```

**After:**
```typescript
fullyParallel: true,   // Tests run in parallel
workers: 6,            // 6 tests run simultaneously
```

### 2. package.json Scripts

**Before:**
```json
{
  "test": "playwright test --headed",
  "test:parallel": "playwright test --headed --workers=6 --fully-parallel",
  "test:parallel:headless": "playwright test --workers=6 --fully-parallel",
  "test:headless": "playwright test",
  "test:action": "playwright test ... --headed",
  "test:action:parallel": "playwright test ... --headed --workers=6",
  "test:action:headless": "playwright test ..."
}
```

**After:**
```json
{
  "test": "playwright test",                                       // Headless + parallel (6 workers) - DEFAULT
  "test:headed": "playwright test --headed",                       // NEW: Show browser
  "test:serial": "playwright test --workers=1",                    // NEW: Serial for debugging
  "test:action": "playwright test ...",                            // Headless + parallel - DEFAULT
  "test:action:headed": "playwright test ... --headed",            // NEW: Show browser
  "test:action:serial": "playwright test ... --workers=1"          // NEW: Serial for debugging
}
```

**Key Changes:**
- Default is now headless (removed `--headed` flag)
- Parallel is default (removed separate parallel scripts)
- Added `test:headed` and `test:action:headed` to show browser when needed
- Serial mode now runs headless by default too

## How to Use

### Run Tests (Headless + Parallel - DEFAULT)

```bash
# All clients - headless, 6 parallel workers
npm test

# Action client - headless, 6 parallel workers
npm run test:action
```

### Run Tests with Browser Visible

```bash
# All clients - show browser
npm run test:headed

# Action client - show browser
npm run test:action:headed
```

### Run Tests Serially (for Debugging)

```bash
# All clients - one at a time, headless
npm run test:serial

# Action client - one at a time, headless
npm run test:action:serial
```

### Run Specific Tests

```bash
# Run specific file (headless, parallel by default)
npm run test:action clients/action/tests/checkout.spec.ts

# Run specific file with browser visible
npm run test:action:headed clients/action/tests/checkout.spec.ts

# Run specific file serially
npm run test:action:serial clients/action/tests/checkout.spec.ts

# Run specific test by name (headless, parallel by default)
npm run test:action clients/action/tests/address-validation.spec.ts -- -g "BT-001"
```

## Benefits

### Speed Improvements
- **6x faster** for independent tests that can run in parallel
- **Headless mode** is even faster (no browser rendering overhead)
- Address validation tests (78 tests) will complete much faster
- CI/CD pipelines will be significantly faster

### When to Use Different Modes

**Use default (headless + parallel) for:**
- Running full test suites
- CI/CD pipelines
- Regular test execution
- Maximum speed

**Use headed mode (`test:action:headed`) when:**
- Debugging visual issues
- Developing new tests
- Watching test execution
- Recording videos/screenshots

**Use serial mode (`test:action:serial`) when:**
- Debugging specific test failures
- Tests have dependencies on each other
- You want to see test output more clearly
- Investigating race conditions or timing issues

## Performance Examples

**Before (Serial, headed - 1 worker):**
- 78 address validation tests ≈ 78 × test duration
- If each test takes 10 seconds = ~13 minutes total

**After (Parallel, headless - 6 workers):**
- 78 address validation tests ≈ (78 ÷ 6) × test duration
- If each test takes 8 seconds (faster due to headless) = ~1.7 minutes total
- **~87% faster!**

**Additional headless benefits:**
- Lower CPU/memory usage
- More consistent test execution
- Better for CI/CD environments
- Can run more tests in parallel without resource issues

## Configuration Details

The default parallelization is set in `playwright.config.ts`:

```typescript
export default defineConfig({
  fullyParallel: true,  // Enable parallel execution
  workers: 6,           // Number of parallel workers
  // ... other config
});
```

You can override this per-run using command-line flags:

```bash
# Force serial execution for one run
npx playwright test --workers=1

# Use 12 workers for this run
npx playwright test --workers=12

# Use half of available CPU cores
npx playwright test --workers=50%
```

## Recommendations

1. **Use default (headless + parallel) for:**
   - Running full test suites
   - CI/CD pipelines
   - Regular test execution
   - Maximum speed and efficiency

2. **Use headed mode for:**
   - Visual debugging
   - Developing new tests
   - Understanding what's happening in the browser

3. **Use serial mode for:**
   - Debugging specific failures
   - Investigating race conditions
   - Tests with dependencies

4. **Adjust worker count if needed:**
   - Reduce to 3-4 workers if experiencing system resource issues
   - Increase to 8-12 workers on powerful machines
   - Use `--workers=50%` to automatically use half your CPU cores
