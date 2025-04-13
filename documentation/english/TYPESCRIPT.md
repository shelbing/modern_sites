# TypeScript Documentation for Hotel Stern

This document provides a comprehensive guide to the TypeScript setup in the Hotel Stern project, including configuration details, type declaration strategies, and best practices.

## Table of Contents

1. [TypeScript Configuration](#typescript-configuration)
   - [Configuration File](#configuration-file)
   - [Integration with Astro](#integration-with-astro)
   - [Type Declarations for JavaScript Files](#type-declarations-for-javascript-files)
   - [Best Practices](#typescript-best-practices)

2. [API Route Type Safety](#api-route-type-safety)
   - [Request and Response Types](#request-and-response-types)
   - [Error Handling](#error-handling)

3. [Payment System Types](#payment-system-types)
   - [Interface Definitions](#interface-definitions)
   - [Type-Safe API Communication](#type-safe-api-communication)

---

## TypeScript Configuration

### Configuration File

The TypeScript configuration for Hotel Stern is defined in the `tsconfig.json` file at the project root:

```json
{
  "extends": "@tsconfig/svelte/tsconfig.json",
  "compilerOptions": {
    "allowArbitraryExtensions": true
  },
  "exclude": ["node_modules", "**/*.spec.ts"]
}
```

Key aspects of this configuration:

- **Base Configuration**: Extends the standard Svelte TypeScript configuration from `@tsconfig/svelte/tsconfig.json`
- **Arbitrary Extensions**: Enables support for TypeScript to work with non-standard file extensions, which is particularly useful for Astro integration
- **Excluded Files**: Node modules and test files are excluded from TypeScript compilation

### Integration with Astro

The project uses Astro as its meta-framework, which has built-in TypeScript support. The integration is configured in several places:

1. **package.json Dependencies**:
   - `@astrojs/check`: Provides TypeScript checking for Astro components
   - `typescript`: Core TypeScript package

2. **Build Scripts**:
   ```bash
   npm run build: "npm run prebuild;npm run buildinstructions;astro check && astro build"
   ```
   The `astro check` command validates TypeScript types before building.

### Type Declarations for JavaScript Files

For JavaScript files that need to be imported into TypeScript files, declaration files (`.d.ts`) are created to provide type information. These files follow a consistent pattern:

1. **Store Declarations**:
   - `src/stores/cartStore.d.ts`: Provides type definitions for the cart Svelte store
   - `src/stores/stripeStore.d.ts`: Type definitions for payment-related state management

2. **Library Declarations**:
   - `src/lib/apaleo_booking.d.ts`: Type definitions for the hotel booking API integration

Example declaration file structure:

```typescript
// Example from src/stores/cartStore.d.ts
import type { Writable } from 'svelte/store';

interface CartData {
  personalData?: {
    firstName: string;
    lastName: string;
    email: string;
    // Additional properties...
  };
  // Additional properties...
}

interface CartStore extends Writable<CartData> {
  get: () => CartData | null;
  reset: () => void;
}

export const cartStore: CartStore;
```

### TypeScript Best Practices

1. **Explicit Return Types**: Always specify return types for functions, especially in API routes:
   ```typescript
   export const POST: APIRoute = async ({ request }): Promise<Response> => {
     // Implementation...
   }
   ```

2. **Narrow Unknown Types**: When dealing with unknown types (like errors), always narrow them before accessing properties:
   ```typescript
   catch (error) {
     const errorMessage = error instanceof Error ? error.message : String(error);
     // Use errorMessage safely...
   }
   ```

3. **Union Types for Nullable Values**: Use union types with `null` or `undefined` for values that might not be present:
   ```typescript
   interface PaymentIntentResponse {
     client_secret: string | null;
     // Other properties...
   }
   ```

4. **Optional Properties**: Use the optional property syntax (`?`) for properties that might not always be present:
   ```typescript
   interface CustomerData {
     email: string;  // Required
     phone?: string; // Optional
   }
   ```

5. **Declaration Files**: Create `.d.ts` files for JavaScript modules instead of converting them to TypeScript, especially when they're stable and well-tested.

---

## API Route Type Safety

### Request and Response Types

API routes in the project use TypeScript for type safety:

```typescript
import type { APIRoute } from "astro";

interface PaymentRequest {
  amount: number;
  currency: string;
  metadata: {
    customerEmail: string;
    customerName?: string;
  };
}

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json() as PaymentRequest;
  
  // Process request...
  
  return new Response(JSON.stringify({ 
    success: true,
    // Response data...
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
```

### Error Handling

Error handling in API routes follows a consistent pattern with proper type checking:

```typescript
try {
  // API logic...
} catch (error) {
  console.error('Error:', error);
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  return new Response(JSON.stringify({ 
    success: false, 
    error: errorMessage 
  }), {
    status: 500,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
```

---

## Payment System Types

### Interface Definitions

The payment system uses a set of well-defined interfaces for type safety:

```typescript
interface PaymentIntentResponse {
  id: string;
  client_secret: string | null;
  status: string;
  amount: number;
  provider_specific?: {
    checkout_id: string;
    checkout_reference: string;
    merchant_code: string;
    date: string;
    status: string;
    checkout_url: string;
    payment_url?: string;
  };
}
```

### Type-Safe API Communication

When communicating with external payment APIs, the code maintains type safety through proper typing of request and response objects:

```typescript
async function createStripePaymentIntent(
  amount: number,
  paymentMethods: string[],
  metadata: Record<string, any>
): Promise<PaymentIntentResponse> {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: "eur",
    payment_method_types: paymentMethods,
    metadata,
  });

  return {
    id: paymentIntent.id,
    client_secret: paymentIntent.client_secret,
    status: paymentIntent.status,
    amount: amount,
  };
}
```

---

## Conclusion

The TypeScript implementation in the Hotel Stern project provides a robust foundation for type-safe development. By following the patterns and practices outlined in this document, developers can maintain consistency and avoid common type-related errors.

For any questions or suggestions regarding the TypeScript setup, please contact the development team.

---

**Document Version**: 1.0  
**Last Updated**: March 6, 2025  
**Author**: Hotel Stern Development Team
