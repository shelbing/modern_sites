# Hotel Stern Internet Booking Engine (IBE) Documentation

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Booking Flow](#booking-flow)
4. [Component Structure](#component-structure)
5. [Data Structures](#data-structures)
6. [API Integration](#api-integration)
7. [Payment Processing](#payment-processing)
8. [Localization](#localization)
9. [Debugging & Maintenance](#debugging--maintenance)

## Overview

The Internet Booking Engine (IBE) is a comprehensive system that enables guests to search, select, and book accommodations at Hotel Stern. Built with Svelte and integrated with payment processing systems, it offers a seamless booking experience from initial search to payment confirmation.

## System Architecture

The IBE is implemented as a multi-step booking process using Svelte components with state management through Svelte stores. The system integrates with:

- **Apaleo** - Hotel management system providing inventory and booking services
- **Stripe/Payment Processors** - For secure payment processing
- **Storyblok CMS** - For content management of room descriptions and images

The application follows a component-based architecture where each step of the booking process is managed by dedicated components, with state shared across components via stores.

## Booking Flow

The IBE booking process consists of 5 distinct steps:

### Step 1: Search & Room Selection
- User enters search criteria (dates, guests, etc.)
- System fetches available offers from Apaleo API
- Offers are filtered and enriched with CMS content
- User selects a room offer to proceed

### Step 2: Additional Services
- User reviews their selected room
- Available additional services are presented
- User can add/remove services
- Total price is calculated dynamically

### Step 3: Personal Data Collection
- Complete booking summary is displayed
- User enters personal and contact information
- System validates the input data
- Payment intent is created based on country

### Step 4: Payment Processing
- Final booking review is presented
- Payment options are displayed based on user's country
- Secure payment form is rendered
- Payment is processed through the selected provider

### Step 5: Confirmation
- Booking confirmation is displayed
- Booking reference and summary are shown
- Confirmation email is sent to the user
- Options for next steps are provided

## Component Structure

### Core Components

- **`bookingEngine.astro`** - Server-side wrapper
- **`bookingEngine.svelte`** - Main orchestrator component
- **`bookingSearchForm.svelte`** - Search form implementation
- **`bookingStep1.svelte`** - Room selection interface
- **`bookingStep2.svelte`** - Additional services selection
- **`bookingStep3.svelte`** - Personal data collection
- **`bookingStep4.svelte`** - Payment processing
- **`bookingStep5.svelte`** - Confirmation display

### Supporting Components

- **`OfferList.svelte`** - Displays available room offers
- **`CartConfirmation.svelte`** - Shows current selections
- **`AdditionalServices.svelte`** - Displays available add-ons
- **`TotalPrice.svelte`** - Calculates and displays pricing
- **`PersonalDataForm.svelte`** - Collects guest information
- **`PaymentForm.svelte`** - Handles payment processing
- **`OffersLoader.svelte`** - Manages data loading states
- **`NoOffersAvailable.svelte`** - Fallback for no availability

## Data Structures

The IBE system uses several key data structures to manage the booking process:

### 1. Booking Store (`bookingStore.js`)

```javascript
{
  bookingStep: 1, // Current step in the booking process (1-5)
  error: null, // Error state if any
  bookingDetails: {
    hotelCode: '', // Property identifier
    offerCode: '', // Selected offer code
    bundleCode: '', // Selected bundle code
    roomCode: '', // Room type code
    roomName: '', // Human-readable room name
    arrivalDate: '', // Check-in date (ISO format)
    departureDate: '', // Check-out date (ISO format)
    adults: 0, // Number of adult guests
    childrenCount: 0, // Number of children
    childrenAges: [], // Array of children ages
    totalPrice: '', // Formatted total price
    totalPriceRaw: 0 // Raw price value for calculations
  },
  personalData: {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    comments: '',
    phone: '',
    city: '',
    postalCode: '',
    country: ''
  }
}
```

### 2. Form Store (`formStore.js`)

```javascript
{
  startDate: '', // Check-in date in ISO format
  endDate: '', // Check-out date in ISO format
  adults: 2, // Default: 2 adults
  children: 0, // Default: no children
  childrenAges: [], // Array of children ages
  promoCode: '', // Optional promotion code
  lang: 'en' // Language code (default: English)
}
```

### 3. Offers Structure (`offersStore.js`)

```javascript
{
  offers: [
    {
      id: 'offer123',
      unitGroup: {
        code: 'DLX', // Room type code
        name: 'Deluxe Room', // Room type name
        description: '...' // Room description
      },
      ratePlan: {
        code: 'BAR', // Rate plan code
        name: 'Best Available Rate' // Rate plan name
      },
      timeSlices: [
        {
          date: '2025-03-10', // Date of this price slice
          baseAmount: {
            grossAmount: 150.00, // Price including tax
            netAmount: 136.36, // Price excluding tax
            currency: 'EUR' // Currency code
          },
          includedServices: [] // Any included services
        }
        // Additional time slices for multi-night stays
      ],
      calculatedAmounts: {
        // Calculated during processing
        base: { gross: 0, net: 0 },
        services: { gross: 0, net: 0 },
        total: { gross: 0, net: 0 },
        Anzahlung: { gross: 0, net: 0 } // Deposit amount
      },
      room: {
        // Enhanced with CMS data
        RoomCode: 'DLX',
        RoomName: 'Deluxe Room',
        RoomDescription: '...',
        RoomImages: ['url1', 'url2'],
        RoomAmenities: ['WiFi', 'Minibar', ...]
      }
    }
    // Additional offers
  ],
  isLoading: false, // Loading state
  error: null, // Error state
  offersLastUpdated: '2025-03-09T12:00:00Z' // Cache timestamp
}
```

### 4. Cart Store (`cartStore.js`)

```javascript
{
  selectedOffer: {
    // Copy of the selected offer
    id: 'offer123',
    unitGroup: { code: 'DLX', name: 'Deluxe Room' },
    // Other offer properties
  },
  selectedBundle: {
    // Bundle information
    id: 'bundle123',
    name: 'Weekend Getaway',
    description: '...',
    PreisanpassungProzent: 0, // Price adjustment percentage
    AnzahlungProzent: 30 // Deposit percentage
  },
  additionalServices: [
    {
      id: 'service123',
      name: 'Breakfast',
      description: 'Daily breakfast buffet',
      price: { grossAmount: 25.00, currency: 'EUR' },
      quantity: 1,
      totalPrice: 25.00
    }
    // Additional services
  ],
  totals: {
    basePrice: 150.00, // Base room price
    servicePrice: 25.00, // Additional services price
    totalPrice: 175.00, // Grand total
    deposit: 52.50, // Required deposit amount
    depositPercent: 30 // Deposit percentage
  },
  personalData: {
    // Copy of personal data when submitted
  }
}
```

### 5. Stripe/Payment Store (`stripeStore.js`)

```javascript
{
  clientSecret: null, // Payment intent client secret
  paymentIntentId: null, // Payment intent ID
  paymentStatus: null, // Current status (pending, succeeded, etc.)
  bookingReference: null, // Generated booking reference
  bookingId: null, // Apaleo booking ID
  availablePaymentMethods: [], // Available payment methods
  payment_provider: 'stripe', // Payment provider name
  amount: 0, // Payment amount in smallest currency unit
  provider_specific: null // Provider-specific data
}
```

### 6. Room Data Structure (`roomsStore.js`)

```javascript
{
  rooms: [
    {
      RoomCode: 'DLX',
      RoomName: 'Deluxe Room',
      RoomDescription: '...',
      RoomImages: ['url1', 'url2'],
      RoomAmenities: ['WiFi', 'Minibar', ...],
      MaxOccupancy: 3,
      BedConfiguration: 'King or Twin',
      RoomSize: 30, // in square meters
      ViewType: 'Garden View'
    }
    // Additional room types
  ],
  roomsLoading: false, // Loading state
  roomsError: null, // Error state
  roomsLastUpdated: '2025-03-09T12:00:00Z' // Cache timestamp
}
```

### 7. Bundle Data Structure (`bundlesStore.js`)

```javascript
{
  bundles: [
    {
      id: 'bundle123',
      Title: 'Weekend Getaway', // Human-readable name
      Description: 'Perfect package for weekend breaks',
      Basisrate: 'BAR', // Base rate plan code
      Categories: 'DLX,SUP', // Comma-separated room type codes
      Aktiviert: true, // Is bundle active
      PreisanpassungProzent: 0, // Price adjustment percentage
      AnzahlungProzent: 30, // Deposit percentage
      Mindestaufenthalt: 2, // Minimum stay nights
      Hoechstaufenthalt: 7, // Maximum stay nights
      Vorausbuchung: '7', // Advance booking requirement in days
      AnreiseVon: '2025-01-01', // Earliest arrival date
      AnreiseBis: '2025-12-31', // Latest arrival date
      BuchenVon: '2025-01-01', // Booking window start
      BuchenBis: '2025-12-31', // Booking window end
      offers: [], // Populated during search with matching offers
      cheapestOffer: null // Calculated cheapest price
    }
    // Additional bundles
  ],
  bundlesLoading: false, // Loading state
  bundlesError: null, // Error state
  bundlesLastUpdated: '2025-03-09T12:00:00Z' // Cache timestamp
}
```

## API Integration

The IBE integrates with several APIs:

### Internal API Endpoints

- **`/api/ibe/search`** - Searches for available offers
- **`/api/ibe/allOffers`** - Retrieves all static offer data
- **`/api/ibe/create_payment_intent`** - Creates payment intent
- **`/api/ibe/confirm_booking`** - Confirms booking after payment

### External APIs

- **Apaleo API** - For inventory, availability, and booking
- **Stripe API** - For payment processing
- **Storyblok API** - For content management

## Payment Processing

The payment system supports multiple payment methods based on the guest's country:

- **Credit/Debit Cards** - All countries
- **SEPA Direct Debit** - EU countries
- **Country-specific Methods**:
  - Germany: Sofort, Giropay, Klarna, PayPal
  - Austria: EPS, Sofort, Klarna
  - Netherlands: iDEAL, Klarna
  - Belgium: Bancontact, Klarna
  - Switzerland: Cards, Klarna

The payment flow follows these steps:
1. Create payment intent with selected payment methods
2. Present payment form to user
3. Process payment through provider
4. Confirm booking upon successful payment
5. Redirect to confirmation page

## Localization

The IBE supports multiple languages:

- English (default)
- German
- Other languages as configured

Translation strings are managed through the `translations.js` file, with language-specific mappings for all UI elements.

## Debugging & Maintenance

### Debug Tools

- **StoreDebugger** - Hidden component for viewing store states
- **Console Logging** - Comprehensive logging for key operations
- **Error Handling** - User-friendly error messages

### Cache Management

Static data (rooms, bundles, services) is cached with a configurable expiration time (default: 5 minutes) to improve performance while ensuring data freshness.

### Monitoring

Critical operations (payment processing, booking creation) include error handling and logging to facilitate troubleshooting.
