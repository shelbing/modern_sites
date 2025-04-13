# Hotel Stern IBE Data Structures

## Overview

This document provides detailed information about the data structures used in the Hotel Stern Internet Booking Engine (IBE). Understanding these structures is essential for developers maintaining or extending the booking system.

## Table of Contents

1. [Store Structures](#store-structures)
2. [API Response Structures](#api-response-structures)
3. [State Transitions](#state-transitions)
4. [Data Flow Diagrams](#data-flow-diagrams)

## Store Structures

The IBE system uses Svelte stores to manage application state. Here's a detailed breakdown of each store structure:

### Booking Store

The booking store (`bookingStore.js`) manages the primary booking process state.

```typescript
interface BookingStore {
  // Current step in the booking process (1-5)
  bookingStep: number;
  
  // Error object if present
  error: null | {
    message: string;
    code?: string;
  };
  
  // Core booking details
  bookingDetails: {
    hotelCode: string;
    offerCode: string;
    bundleCode: string;
    roomCode: string;
    roomName: string;
    arrivalDate: string; // ISO format: YYYY-MM-DD
    departureDate: string; // ISO format: YYYY-MM-DD
    adults: number;
    childrenCount: number;
    childrenAges: number[];
    totalPrice: string; // Formatted price with currency
    totalPriceRaw: number; // Raw price value for calculations
  };
  
  // Guest information
  personalData: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    comments: string;
    phone: string;
    city: string;
    postalCode: string;
    country: string; // ISO country code
  };
}
```

#### State Functions

The `bookingStepActions` object provides methods to manipulate the booking step:

```typescript
interface BookingStepActions {
  next(): void;        // Increment step (max: 4)
  prev(): void;        // Decrement step (min: 1)
  goTo(step: number): void; // Go to specific step
  reset(): void;       // Reset to step 1
}
```

### Form Store

The form store (`formStore.js`) manages search form data.

```typescript
interface FormStore {
  startDate: string;   // ISO format: YYYY-MM-DD
  endDate: string;     // ISO format: YYYY-MM-DD
  adults: number;      // Default: 2
  children: number;    // Default: 0
  childrenAges: number[]; // Ages of children
  promoCode: string;   // Optional promotion code
  lang: string;        // Language code (default: 'en')
}
```

### Offers Store

The offers store (`offersStore.js`) manages available room offers.

```typescript
interface OffersStore {
  // Available offers returned from API
  offers: Array<{
    id: string;
    unitGroup: {
      code: string;    // Room type code
      name: string;    // Room type name
      description: string;
    };
    ratePlan: {
      code: string;    // Rate plan code
      name: string;    // Rate plan name
    };
    timeSlices: Array<{
      date: string;    // ISO format: YYYY-MM-DD
      baseAmount: {
        grossAmount: number;
        netAmount: number;
        currency: string;
      };
      includedServices?: Array<{
        serviceId: string;
        name: string;
        amount: {
          grossAmount: number;
          netAmount: number;
          currency: string;
        };
      }>;
    }>;
    calculatedAmounts?: {
      base: {
        gross: number;
        net: number;
      };
      services: {
        gross: number;
        net: number;
      };
      total: {
        gross: number;
        net: number;
      };
      Anzahlung: {
        gross: number;
        net: number;
      };
    };
    room?: {
      RoomCode: string;
      RoomName: string;
      RoomDescription: string;
      RoomImages: string[];
      RoomAmenities: string[];
    };
  }>;
  
  // Loading state flags
  isLoading: boolean;
  error: null | {
    message: string;
    code?: string;
  };
  
  // Cache timestamp
  offersLastUpdated: string | null; // ISO timestamp
}
```

### Cart Store

The cart store (`cartStore.js`) manages selected items.

```typescript
interface CartStore {
  // Selected room offer
  selectedOffer: {
    id: string;
    unitGroup: {
      code: string;
      name: string;
    };
    ratePlan: {
      code: string;
      name: string;
    };
    // Other offer properties...
    calculatedAmounts: {
      base: { gross: number; net: number; };
      services: { gross: number; net: number; };
      total: { gross: number; net: number; };
      Anzahlung: { gross: number; net: number; };
    };
  } | null;
  
  // Selected bundle (if applicable)
  selectedBundle: {
    id: string;
    Title: string;
    Description: string;
    PreisanpassungProzent: number; // Price adjustment percentage
    AnzahlungProzent: number;     // Deposit percentage
    // Other bundle properties...
  } | null;
  
  // Additional services selected
  additionalServices: Array<{
    id: string;
    name: string;
    description: string;
    price: {
      grossAmount: number;
      currency: string;
    };
    quantity: number;
    totalPrice: number;
  }>;
  
  // Summary totals
  totals: {
    basePrice: number;         // Base room price
    servicePrice: number;      // Additional services price
    totalPrice: number;        // Grand total
    deposit: number;           // Required deposit amount
    depositPercent: number;    // Deposit percentage
    currency: string;          // Currency code
  };
  
  // Copy of personal data when submitted
  personalData?: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    comments: string;
    phone: string;
    city: string;
    postalCode: string;
    country: string;
  };
}
```

### Payment Store

The payment store (`stripeStore.js`) manages payment data.

```typescript
interface PaymentStore {
  clientSecret: string | null;  // Payment intent client secret
  paymentIntentId: string | null; // Payment intent ID
  paymentStatus: string | null; // Current payment status
  bookingReference: string | null; // Generated booking reference
  bookingId: string | null;     // Apaleo booking ID
  availablePaymentMethods: string[]; // Available payment methods
  payment_provider: string;    // Payment provider name
  amount: number;             // Amount in smallest currency unit
  provider_specific: any;     // Provider-specific data
}
```

### Rooms Store

The rooms store (`roomsStore.js`) manages room type data.

```typescript
interface RoomsStore {
  rooms: Array<{
    RoomCode: string;         // Room type code
    RoomName: string;         // Room type name
    RoomDescription: string;  // Rich text description
    RoomImages: string[];     // Array of image URLs
    RoomAmenities: string[];  // Array of amenity names
    MaxOccupancy: number;     // Maximum guests allowed
    BedConfiguration: string; // Description of beds
    RoomSize: number;         // Size in square meters
    ViewType: string;         // Type of view
  }>;
  
  roomsLoading: boolean;
  roomsError: null | {
    message: string;
    code?: string;
  };
  roomsLastUpdated: string | null; // ISO timestamp
}
```

### Bundles Store

The bundles store (`bundlesStore.js`) manages bundle package data.

```typescript
interface BundlesStore {
  bundles: Array<{
    id: string;
    Title: string;             // Human-readable name
    Description: string;       // Rich text description
    Basisrate: string;         // Base rate plan code
    Categories: string;        // Comma-separated room type codes
    Aktiviert: boolean;        // Is bundle active
    PreisanpassungProzent: number; // Price adjustment percentage
    AnzahlungProzent: number;  // Deposit percentage
    Mindestaufenthalt: number; // Minimum stay nights
    Hoechstaufenthalt: number; // Maximum stay nights
    Vorausbuchung: string;     // Advance booking requirement (days)
    AnreiseVon: string;        // Earliest arrival date (YYYY-MM-DD)
    AnreiseBis: string;        // Latest arrival date (YYYY-MM-DD)
    BuchenVon: string;         // Booking window start (YYYY-MM-DD)
    BuchenBis: string;         // Booking window end (YYYY-MM-DD)
    offers: Array<any>;        // Populated during search
    cheapestOffer: number | null; // Calculated cheapest price
  }>;
  
  bundlesLoading: boolean;
  bundlesError: null | {
    message: string;
    code?: string;
  };
  bundlesLastUpdated: string | null; // ISO timestamp
}
```

### Personal Data Store

The personal data store (`personalDataStore.js`) manages guest information.

```typescript
interface PersonalDataStore {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  comments: string;
  phone: string;
  city: string;
  postalCode: string;
  country: string;
  isValid: boolean;           // Calculated validity state
  
  // Validation errors
  errors: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
}
```

## API Response Structures

### Search API Response

The `/api/ibe/search` endpoint returns data in this format:

```typescript
interface SearchApiResponse {
  success: boolean;
  offers?: Array<{
    id: string;
    unitGroup: {
      code: string;
      name: string;
      description: string;
    };
    ratePlan: {
      code: string;
      name: string;
    };
    timeSlices: Array<{
      date: string;
      baseAmount: {
        grossAmount: number;
        netAmount: number;
        currency: string;
      };
      includedServices?: Array<{
        serviceId: string;
        name: string;
        amount: {
          grossAmount: number;
          netAmount: number;
          currency: string;
        };
      }>;
    }>;
  }>;
  error?: {
    message: string;
    code: string;
  };
}
```

### All Offers API Response

The `/api/ibe/allOffers` endpoint returns data in this format:

```typescript
interface AllOffersApiResponse {
  success: boolean;
  rooms?: Array<{
    RoomCode: string;
    RoomName: string;
    RoomDescription: string;
    RoomImages: string[];
    RoomAmenities: string[];
    MaxOccupancy: number;
    BedConfiguration: string;
    RoomSize: number;
    ViewType: string;
  }>;
  bundles?: Array<{
    id: string;
    Title: string;
    Description: string;
    Basisrate: string;
    Categories: string;
    Aktiviert: boolean;
    PreisanpassungProzent: number;
    AnzahlungProzent: number;
    Mindestaufenthalt: number;
    Hoechstaufenthalt: number;
    Vorausbuchung: string;
    AnreiseVon: string;
    AnreiseBis: string;
    BuchenVon: string;
    BuchenBis: string;
  }>;
  services?: Array<{
    id: string;
    name: string;
    description: string;
    price: {
      grossAmount: number;
      currency: string;
    };
    isBookable: boolean;
    restrictions?: {
      roomCodes?: string[]; // Room codes where service is available
      minStay?: number;     // Minimum stay for service availability
      maxStay?: number;     // Maximum stay for service availability
    };
  }>;
  error?: {
    message: string;
    code: string;
  };
}
```

### Create Payment Intent API Response

The `/api/ibe/create_payment_intent` endpoint returns data in this format:

```typescript
interface CreatePaymentIntentResponse {
  success: boolean;
  id?: string;             // Payment intent ID
  client_secret?: string;  // Client secret for payment processing
  amount?: number;         // Amount in smallest currency unit
  currency?: string;       // Currency code
  status?: string;         // Payment status
  provider_specific?: any; // Provider-specific data
  error?: {
    message: string;
    code: string;
  };
}
```

### Confirm Booking API Response

The `/api/ibe/confirm_booking` endpoint returns data in this format:

```typescript
interface ConfirmBookingResponse {
  success: boolean;
  bookingId?: string;       // Apaleo booking ID
  bookingReference?: string; // Human-readable booking reference
  confirmationEmail?: {
    sent: boolean;
    to: string;
    error?: string;
  };
  error?: {
    message: string;
    code: string;
  };
}
```

## State Transitions

The booking process follows these state transitions:

1. **Initial State**
   - `bookingStep = 1`
   - Empty `formStore` with default values
   - Empty `offersStore`

2. **After Search Form Submission**
   - `formStore` populated with search criteria
   - `offersStore` populated with available offers
   - `offersStore.isLoading = false`

3. **After Room Selection (Step 1 → Step 2)**
   - `cartStore.selectedOffer` populated
   - `cartStore.selectedBundle` populated if applicable
   - `cartStore.totals` calculated
   - `bookingStep = 2`

4. **After Additional Services Selection (Step 2 → Step 3)**
   - `cartStore.additionalServices` populated
   - `cartStore.totals` recalculated
   - `bookingStep = 3`

5. **After Personal Data Submission (Step 3 → Step 4)**
   - `personalDataStore` populated and validated
   - `stripeStore.clientSecret` populated
   - `stripeStore.paymentIntentId` populated
   - `cartStore.personalData` populated
   - `bookingStep = 4`

6. **After Payment Processing (Step 4 → Step 5)**
   - `stripeStore.paymentStatus = 'succeeded'`
   - `stripeStore.bookingReference` populated
   - `stripeStore.bookingId` populated
   - `bookingStep = 5`

## Data Flow Diagrams

### Search Flow

```
User Input → formStore → /api/ibe/search API → offersStore → Render Offers
      ↑                                             ↓
      └─── roomsStore ─── bundlesStore ─── Combined Offers
```

### Booking Flow

```
Room Selection → cartStore → Price Calculation → Render Cart
      ↓
Additional Services → Update cartStore → Recalculate Prices
      ↓
Personal Data → personalDataStore → Validation → /api/ibe/create_payment_intent
      ↓
Payment Form → stripeStore → Payment Processing → /api/ibe/confirm_booking
      ↓
Confirmation → Render Success → Email Notification
```

### Data Preparation Flow

```
Search Criteria → API Request → Raw Offers Data
      ↓
Filter Bundles → Match Room Types → Calculate Prices → Enhanced Offers
      ↓
Apply Business Rules → Final Offer Display
```
