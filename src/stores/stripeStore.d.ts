/**
 * TypeScript declarations for stripeStore.js
 */

import type { Writable } from 'svelte/store';

interface StripeState {
  clientSecret: string | null;
  paymentIntentId: string | null;
  paymentStatus: string | null;
  bookingReference: string | null;
  availablePaymentMethods: string[];
  payment_provider: string;
  provider_specific: Record<string, any> | null;
}

interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  status?: string;
  provider_specific?: Record<string, any>;
  [key: string]: any;
}

export const stripeStore: Writable<StripeState>;

/**
 * Helper function to update store with payment intent response
 */
export function updateWithPaymentIntent(
  store: Writable<StripeState>, 
  response: PaymentIntentResponse
): void;
