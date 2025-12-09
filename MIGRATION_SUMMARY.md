# Multi-Client Test Structure Migration

## Summary

The test framework has been successfully restructured to support multiple clients with isolated test suites.

## Changes Made

### 1. Directory Structure
- Created `clients/` directory as the root for all client test suites
- Moved Action tests to `clients/action/`
- Created `clients/_template/` with instructions for adding new clients

### 2. File Locations
**Before:**
```
tests/
  auth.setup.ts
  checkout.spec.ts
  address-validation.spec.ts
  main-page.spec.ts
  helpers/
    checkout-helper.ts
test-data/
  address-test-cases.ts
.auth/
  user.json
```

**After:**
```
clients/
  action/
    setup/auth.setup.ts
    tests/
      checkout.spec.ts
      address-validation.spec.ts
      main-page.spec.ts
    helpers/
      checkout-helper.ts
    test-data/
      address-test-cases.ts
    .auth/
      user.json
  _template/
    (template for new clients)
```

### 3. Configuration Updates

**playwright.config.ts:**
- Changed `testDir` from `./tests` to `./clients`
- Split into client-specific projects:
  - `action-setup` - Action authentication
  - `action-chromium` - Action tests
- Each client now has its own base URL and auth state path

**package.json scripts:**
```json
"test:action": "playwright test --project=action-setup --project=action-chromium --headed",
"test:action:parallel": "playwright test --project=action-setup --project=action-chromium --headed --workers=6 --fully-parallel",
"test:action:headless": "playwright test --project=action-setup --project=action-chromium",
"auth:setup:action": "playwright test --project=action-setup --headed"
```

**Import paths updated:**
- `address-validation.spec.ts`: Changed helper import from `./helpers/` to `../helpers/`
- `auth.setup.ts`: Changed auth file path to `clients/action/.auth/user.json`

### 4. New Files Created

**clients/_template/README.md:**
- Complete guide for adding new clients
- Step-by-step instructions
- Code examples

**clients/_template/setup/auth.setup.ts:**
- Template authentication setup

**clients/_template/tests/example.spec.ts:**
- Example test file

**.gitignore:**
- Added `clients/**/.auth/` to ignore all client auth directories

### 5. Documentation Updates

**README.md:**
- Updated to reflect multi-client architecture
- Added section on adding new clients
- Updated all command examples to use client-specific paths
- Updated project structure diagram

## How to Use

### Running Action Tests
```bash
# Run all Action tests
npm run test:action

# Run specific Action test
npm run test:action clients/action/tests/checkout.spec.ts

# Setup Action authentication
npm run auth:setup:action
```

### Adding a New Client
1. Copy `clients/_template` to `clients/yourclient`
2. Follow instructions in `clients/_template/README.md`
3. Update `playwright.config.ts` to add your client projects
4. Add npm scripts for your client in `package.json`

## Benefits

1. **Isolation:** Each client has completely isolated tests, auth, and configuration
2. **Scalability:** Easy to add new clients without affecting existing ones
3. **Clarity:** Clear separation of concerns with dedicated directories
4. **Flexibility:** Each client can have different base URLs, auth flows, and test patterns
5. **Reusability:** Template structure makes adding new clients quick and consistent

## Breaking Changes

### Command Changes
Old commands will no longer work. Update to new commands:

| Old Command | New Command |
|-------------|-------------|
| `npm run auth:setup` | `npm run auth:setup:action` |
| `npm test tests/checkout.spec.ts` | `npm run test:action clients/action/tests/checkout.spec.ts` |

### File Paths
If you have any custom scripts or documentation referencing the old paths, update them to the new structure under `clients/action/`.

## Migration Checklist

- [x] Create clients directory structure
- [x] Move Action tests to clients/action
- [x] Update import paths in test files
- [x] Update playwright.config.ts
- [x] Update package.json scripts
- [x] Create template structure
- [x] Update .gitignore
- [x] Update README.md
- [x] Clean up old directories

## Next Steps

1. Test the Action client to ensure everything works:
   ```bash
   npm run auth:setup:action
   npm run test:action
   ```

2. When adding a second client, follow the template in `clients/_template/README.md`

3. Consider adding a client-specific `.env` pattern if needed (e.g., separate env files per client)
