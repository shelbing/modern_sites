/**
 * Payment Provider Diagnostic Utilities
 * 
 * Helper functions for testing, diagnosing, and logging payment provider issues
 */

import { PaymentService } from '../services/payment/PaymentService';
import { supportedProviders, getProviderConfig } from '../config/paymentProviders';

/**
 * Tests connection with all configured payment providers
 * @returns Object containing test results for each provider
 */
export async function testPaymentProviders(): Promise<Record<string, any>> {
  const results: Record<string, any> = {};
  
  for (const provider of supportedProviders) {
    try {
      const config = getProviderConfig(provider);
      const hasApiKey = !!config.apiKey || !!config.secretKey;
      
      if (!hasApiKey) {
        results[provider] = {
          status: 'skipped',
          message: 'No API key configured',
          success: false
        };
        continue;
      }
      
      // Create a test payment intent of €0.01 to verify API connection
      // This will not actually charge anything
      const paymentProvider = await PaymentService.createPaymentIntent(
        0.01, 
        [], 
        { test: true, provider }
      );
      
      results[provider] = {
        status: 'success',
        message: 'Connection successful',
        success: true,
        provider_id: paymentProvider.id
      };
    } catch (error) {
      results[provider] = {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }
  
  return results;
}

/**
 * Logs payment-related events for debugging
 * @param event Event name
 * @param data Event data
 */
export function logPaymentEvent(event: string, data: any): void {
  const timestamp = new Date().toISOString();
  const provider = data?.provider || PaymentService.getActiveProvider();
  
  console.log(`[PAYMENT][${timestamp}][${provider}][${event}]`, data);
  
  // Additional logging could be added here
  // Such as sending to a monitoring service
}

/**
 * Get payment provider capabilities
 * @param provider Provider name
 * @returns Available features and methods
 */
export function getProviderCapabilities(provider: string): Record<string, boolean> {
  const baseCapabilities = {
    cardPayments: false,
    bankTransfers: false,
    recurring: false,
    refunds: false,
    partialCapture: false,
    webhooks: false,
    manualCapture: false,
    customerSaving: false
  };
  
  switch (provider.toLowerCase()) {
    case 'stripe':
      return {
        ...baseCapabilities,
        cardPayments: true,
        bankTransfers: true,
        recurring: true,
        refunds: true,
        partialCapture: true,
        webhooks: true,
        manualCapture: true,
        customerSaving: true
      };
    case 'sumup':
      return {
        ...baseCapabilities,
        cardPayments: true,
        refunds: true,
        webhooks: true
      };
    case 'adyen':
      return {
        ...baseCapabilities,
        cardPayments: true,
        bankTransfers: true,
        recurring: true,
        refunds: true,
        webhooks: true,
        manualCapture: true
      };
    default:
      return baseCapabilities;
  }
}
