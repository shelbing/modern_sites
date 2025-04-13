# TypeScript Dokumentation

Diese Dokumentation bietet einen umfassenden Überblick über die TypeScript-Implementierung im Hotel Stern Webprojekt, einschließlich Konfiguration, Typdefinitionen und Best Practices.

## Inhaltsverzeichnis

1. [Konfiguration](#konfiguration)
2. [Typdefinitionen](#typdefinitionen)
3. [API-Typsicherheit](#api-typsicherheit)
4. [Best Practices](#best-practices)
5. [Fehlerbehebung](#fehlerbehebung)

## Konfiguration

### tsconfig.json

Die TypeScript-Konfiguration ist in der `tsconfig.json` Datei im Projektstammverzeichnis definiert:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@assets/*": ["src/assets/*"],
      "@lib/*": ["src/lib/*"],
      "@utils/*": ["src/utils/*"],
      "@stores/*": ["src/stores/*"]
    },
    "allowJs": true,
    "checkJs": true,
    "jsx": "preserve"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

Diese Konfiguration:
- Erweitert die strikte Astro-Basiskonfiguration
- Definiert Pfad-Aliase für einfachere Imports
- Aktiviert JavaScript-Unterstützung und Typprüfung
- Konfiguriert JSX-Handhabung für Svelte-Komponenten
- Legt den Umfang der TypeScript-Prüfung fest

### Pfad-Aliase

Die Definition von Pfad-Aliasen ermöglicht sauberere Imports, z.B.:

```typescript
// Statt:
import Button from '../../../../components/UI/Button.svelte';

// Können wir schreiben:
import Button from '@components/UI/Button.svelte';
```

Diese Aliase sind sowohl in TypeScript als auch in JavaScript-Dateien verfügbar.

## Typdefinitionen

### Deklarationsdateien

Typ-Deklarationsdateien (`.d.ts`) werden verwendet, um JavaScript-Modulen statische Typen hinzuzufügen. Wichtige Deklarationsdateien im Projekt:

#### apaleo_booking.d.ts

```typescript
// src/lib/apaleo_booking.d.ts
export interface ApaleoToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface BookingOptions {
  arrival: string;
  departure: string;
  adults: number;
  children?: number;
  promoCode?: string;
}

export function getToken(): Promise<ApaleoToken>;
export function checkAvailability(options: BookingOptions): Promise<AvailabilityResponse>;
export function createBooking(options: BookingOptions, guestData: GuestData): Promise<BookingResponse>;
```

#### cartStore.d.ts

```typescript
// src/stores/cartStore.d.ts
import { Writable } from 'svelte/store';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  options?: Record<string, string>;
}

export interface CartStore extends Writable<Record<string, CartItem>> {
  get(): Record<string, CartItem> | null;
  reset(): void;
}

export const cart: CartStore;
```

#### stripeStore.d.ts

```typescript
// src/stores/stripeStore.d.ts
import { Writable } from 'svelte/store';

export interface StripeState {
  paymentIntentId?: string;
  clientSecret?: string;
  status?: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
  error?: string;
}

export interface StripeStore extends Writable<StripeState> {
  reset(): void;
  getStatus(): string | undefined;
}

export const stripeStore: StripeStore;
```

### Schnittstellen für externe Daten

Schnittstellen für externe Daten stellen sicher, dass API-Antworten korrekt typisiert sind:

```typescript
// Beispiel: PaymentIntentResponse Interface
interface PaymentIntentResponse {
  id: string;
  client_secret: string | null;
  status: string;
  amount: number;
  provider_specific?: {
    checkout_id: string;
    payment_url?: string;
  };
}
```

### Komponententypen

Für Astro- und Svelte-Komponenten werden Prop-Typen definiert:

```typescript
// Beispiel: Image Komponenten Props
interface ImageComponentDirectProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  lazy?: boolean;
  class?: string;
}

// Storyblok-spezifische Eigenschaften
interface StoryblokBlok extends ImageComponentDirectProps {
  filename: string;
  alt?: string;
}
```

## API-Typsicherheit

### API-Routen

TypeScript wird für API-Routen verwendet, um Anfragen und Antworten zu typisieren:

```typescript
// src/pages/api/ibe/create_payment_intent.ts
import type { APIRoute } from 'astro';

interface PaymentIntentRequest {
  amount: number;
  currency: string;
  description: string;
  paymentMethod: 'stripe' | 'adyen' | 'sumup';
}

interface PaymentIntentResponse {
  id: string;
  client_secret: string | null;
  status: string;
  amount: number;
  provider_specific?: {
    checkout_id: string;
    payment_url?: string;
  };
}

export const post: APIRoute = async ({ request }) => {
  const data: PaymentIntentRequest = await request.json();
  
  // Implementierung...
  
  return new Response(JSON.stringify(response as PaymentIntentResponse), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
```

### Fehlerbehandlung

Verbesserte Fehlerbehandlung mit korrektem Typeabruf:

```typescript
// Verbesserte Fehlerhandhabung
try {
  // Operationen...
} catch (error) {
  // Überprüfen, ob es ein bekannter Fehlertyp ist
  if (error instanceof Error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Generischer Fehler
  return new Response(JSON.stringify({ error: 'Unbekannter Fehler' }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' }
  });
}
```

## Best Practices

### Typsicherheit

1. **Explizite Typannotationen für Funktionen**:
   ```typescript
   function calculateTotal(items: CartItem[]): number {
     return items.reduce((total, item) => total + item.price * item.quantity, 0);
   }
   ```

2. **Verwendung von `unknown` statt `any`**:
   ```typescript
   // Statt:
   function processData(data: any) { ... }
   
   // Besser:
   function processData(data: unknown) {
     if (isValidDataFormat(data)) {
       // Typ eingeschränkt, sicher zu verwenden
     }
   }
   ```

3. **Typwächter für API-Daten**:
   ```typescript
   function isBookingResponse(data: unknown): data is BookingResponse {
     return (
       typeof data === 'object' && 
       data !== null && 
       'bookingId' in data && 
       'status' in data
     );
   }
   ```

### Modulstruktur

1. **Export von Typen für Wiederverwendung**:
   ```typescript
   // src/types/booking.ts
   export interface GuestData { ... }
   export interface BookingResponse { ... }
   ```

2. **Barrel-Exporte für verwandte Typen**:
   ```typescript
   // src/types/index.ts
   export * from './booking';
   export * from './payment';
   export * from './user';
   ```

### Code-Organisation

1. **Typdefinitionen neben der Implementierung**:
   ```typescript
   // src/utils/price.ts
   
   export interface PriceOptions {
     currency: string;
     locale: string;
     includeSymbol: boolean;
   }
   
   export function formatPrice(amount: number, options: PriceOptions): string {
     // Implementierung...
   }
   ```

2. **Benennung von Typvariablen**:
   - Schnittstellen: `interface UserData {...}`
   - Typen: `type PaymentMethod = 'stripe' | 'adyen' | 'sumup';`
   - Generische Typen: `function getFirst<T>(items: T[]): T | undefined {...}`

## Fehlerbehebung

### Häufige Probleme

1. **Impliziter `any`-Typ**:
   ```typescript
   // Fehler: Parameter 'event' implicitly has an 'any' type.
   function handleEvent(event) {
     console.log(event.target.value);
   }
   
   // Lösung:
   function handleEvent(event: Event) {
     const target = event.target as HTMLInputElement;
     console.log(target.value);
   }
   ```

2. **Importprobleme**:
   - Überprüfen Sie Pfade und Pfad-Aliase
   - Stellen Sie sicher, dass Exporte korrekt sind
   - Überprüfen Sie Modulstrukturen

3. **Unvereinbare Typen**:
   ```typescript
   // Fehler: Type 'string | null' is not assignable to type 'string'.
   const id: string = user.id; // wenn user.id ein 'string | null' ist
   
   // Lösung mit Typprüfung:
   const id: string = user.id ?? ''; // Standardwert
   
   // Oder mit Typeinschränkung:
   if (user.id !== null) {
     const id: string = user.id; // Jetzt als 'string' bekannt
   }
   ```

### TypeScript-Konfiguration anpassen

Passen Sie die TypeScript-Konfiguration an spezifische Projektanforderungen an:

```json
{
  "compilerOptions": {
    // Striktere Prüfungen
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    
    // Oder weniger streng bei Legacy-Code
    "strict": false,
    "noImplicitAny": false
  }
}
```

---

Diese Dokumentation bietet eine umfassende Übersicht über die TypeScript-Implementierung im Hotel Stern Webprojekt. Für spezifische Implementierungsdetails beziehen Sie sich auf den entsprechenden Code und die Typdeklarationsdateien.
