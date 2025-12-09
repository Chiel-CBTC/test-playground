# Action Client Tests

This directory contains all tests for the Action e-commerce platform.

## Directory Structure

```
action/
├── setup/              # Authentication setup
├── tests/              # Test specifications
├── helpers/            # Helper functions
├── test-data/          # Test data files
└── .auth/              # Auth state (auto-generated)
```

## Tests Included

### checkout.spec.ts
Full checkout flow test including:
- Adding products to cart
- Filling checkout form
- Validating iDeal payment redirect

### address-validation.spec.ts
78 automated tests covering:
- Boundary testing (addition length, house number length)
- Realistic Dutch addresses (common additions)
- Street name validation
- Whitespace handling
- Special characters
- Numeric validation

### main-page.spec.ts
Main page access and interaction tests

## Running Tests

```bash
# Setup authentication
npm run auth:setup:action

# Run all Action tests (headless, 6 parallel workers - DEFAULT)
npm run test:action

# Run with browser visible
npm run test:action:headed

# Run specific test file
npm run test:action clients/action/tests/checkout.spec.ts

# Run specific test by ID
npm run test:action clients/action/tests/address-validation.spec.ts -- -g "BT-001"

# Run serially for debugging
npm run test:action:serial
```

## Environment Variables

Required in `.env`:
```
SSO_USERNAME=your-email@example.com
SSO_PASSWORD=your-password
CHECKOUT_EMAIL=test@example.com
CHECKOUT_FIRSTNAME=Jan
CHECKOUT_LASTNAME=Jansen
CHECKOUT_PHONE=0612345678
CHECKOUT_POSTCODE=1234AB
CHECKOUT_CITY=Amsterdam
```

## Base URL

`https://shop-staging.action.com`

## Authentication

Uses Azure AD SSO via Cloudflare Access. The auth flow:
1. Navigate to `/nl-nl`
2. Click "Azure AD ・ Action"
3. Enter credentials
4. Accept "Stay signed in"
5. Save auth state to `.auth/user.json`
