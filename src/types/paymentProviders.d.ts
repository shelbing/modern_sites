/**
 * Type definitions for payment providers
 */

/**
 * Supported payment provider names
 */
export type PaymentProviderName = 'stripe' | 'sumup' | 'adyen';

/**
 * Payment provider configuration
 */
export interface PaymentProviderConfig {
  publicKey?: string;
  secretKey?: string;
  apiKey?: string;
  apiVersion?: string;
  webhookSecret?: string;
  merchantAccount?: string;
  clientKey?: string;
  username?: string;
  password?: string;
  environment?: string;
  webhookHmacKey?: string;
  merchantEmail?: string;
  siteUrl?: string;
  paymentMethods: string[];
}

/**
 * Payment metadata structure
 */
export interface PaymentMetadata {
  bookingReference?: string;
  customerEmail?: string;
  customerName?: string;
  provider?: string;
  created_at?: string;
  [key: string]: any;
}

/**
 * Payment method configuration
 */
export interface PaymentMethodConfig {
  id: string;
  name: string;
  icon?: string;
  enabled: boolean;
  supportedProviders: PaymentProviderName[];
  countries?: string[];
  currencies?: string[];
}
