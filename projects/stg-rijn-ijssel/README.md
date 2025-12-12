# STG Rijn-IJssel

Playwright tests for the STG Rijn-IJssel website.

## Directory Structure

- `tests/` - Test spec files (*.spec.ts)
- `setup/` - Authentication setup files (*.setup.ts)
- `helpers/` - Helper functions specific to STG Rijn-IJssel
- `test-data/` - Test data files
- `.auth/` - Authentication state (auto-generated)

## Running Tests

- Run tests: `npm run test:stg-rijn-ijssel`
- Run with browser visible: `npm run test:stg-rijn-ijssel:headed`
- Run serially for debugging: `npm run test:stg-rijn-ijssel:serial`
- Setup authentication: `npm run auth:setup:stg-rijn-ijssel`

## Environment Variables

Add the following to `.env`:
```
# STG Rijn-IJssel credentials
STG_RIJN_IJSSEL_USERNAME=your-username
STG_RIJN_IJSSEL_PASSWORD=your-password
```
