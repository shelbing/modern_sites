/**
 * Payment Provider Configuration
 * 
 * This file centralizes all payment provider settings and configurations
 * to make it easier to manage and switch between different payment providers.
 */

import type { PaymentProviderConfig as ProviderConfig } from '../types/paymentProviders';

/**
 * Get selected payment provider from environment variables
 * @returns The configured payment provider name (defaults to 'stripe')
 */
export function getSelectedPaymentProvider(): string {
  return import.meta.env.PUBLIC_PAYMENT_PROVIDER?.toLowerCase() || 'stripe';
}

/**
 * Stripe configuration
 */
export const stripeConfig = {
  publicKey: import.meta.env.PUBLIC_STRIPE_KEY,
  secretKey: import.meta.env.STRIPE_SECRET_KEY,
  apiVersion: '2024-09-30.acacia' as const,
  webhookSecret: import.meta.env.STRIPE_WEBHOOK_SECRET,
  paymentMethods: [
    'card',
    'ideal',
    'sofort', 
    'giropay',
    'sepa_debit',
    'bancontact',
    'eps',
    'p24'
  ]
};

/**
 * SumUp configuration
 */
export const sumUpConfig = {
  apiKey: import.meta.env.SUMUP_API_KEY,
  merchantEmail: import.meta.env.SUMUP_MERCHANT_EMAIL,
  webhookSecret: import.meta.env.SUMUP_WEBHOOK_SECRET,
  siteUrl: import.meta.env.PUBLIC_SITE_URL?.replace(/\/+$/, ''),
  paymentMethods: [
    'card'
    // Add more SumUp payment methods as they become available
  ]
};

/**
 * Adyen configuration
 */
export const adyenConfig = {
  merchantAccount: import.meta.env.ADYEN_MERCHANT_ACCOUNT,
  apiKey: import.meta.env.ADYEN_API_KEY,
  clientKey: import.meta.env.ADYEN_CLIENT_KEY,
  username: import.meta.env.ADYEN_USER_NAME,
  password: import.meta.env.ADYEN_PASSWORD,
  environment: import.meta.env.ADYEN_ENVIRONMENT || 'TEST',
  webhookHmacKey: import.meta.env.ADYEN_WEBHOOK_HMAC_KEY,
  paymentMethods: [
    'scheme', // Credit cards
    'ideal',
    'sofort',
    'giropay',
    'sepadirectdebit',
    'bancontact',
    'eps',
    'p24'
  ]
};

/**
 * Default payment provider configuration (stripe)
 */
export const defaultProvider = 'stripe';

/**
 * Supported payment providers
 */
export const supportedProviders = ['stripe', 'sumup', 'adyen'];

/**
 * Check if a payment provider is supported
 * @param provider Provider name to check
 * @returns True if provider is supported
 */
export function isProviderSupported(provider: string): boolean {
  return supportedProviders.includes(provider.toLowerCase());
}

/**
 * Get configuration for the specified provider
 * @param provider Provider name
 * @returns Provider configuration
 */
export function getProviderConfig(provider: string): any {
  switch (provider.toLowerCase()) {
    case 'stripe':
      return stripeConfig;
    case 'sumup':
      return sumUpConfig;
    case 'adyen':
      return adyenConfig;
    default:
      throw new Error(`Unsupported payment provider: ${provider}`);
  }
}
