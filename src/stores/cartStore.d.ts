/**
 * TypeScript declarations for cartStore.js
 */

import type { Writable } from 'svelte/store';

interface CartData {
  personalData?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: {
      addressLine1?: string;
      addressLine2?: string;
      postalCode?: string;
      city?: string;
      countryCode?: string;
    };
  };
  searchData?: {
    arrivalDate: string;
    departureDate: string;
    adults: number;
    children?: number;
    propertyId?: string;
    ratePlanId?: string;
  };
  calculatedAmounts?: {
    totalAmount: number;
    currency: string;
  };
  ratePlan?: {
    id: string;
    name?: string;
  };
  [key: string]: any;
}

interface CartStore extends Writable<CartData> {
  get: () => CartData | null;
  reset: () => void;
}

export const cartStore: CartStore;
