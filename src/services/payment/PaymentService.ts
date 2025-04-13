/**
 * Payment Service
 * 
 * A high-level service that handles all payment operations through the currently configured
 * payment provider. This acts as the main entry point for all payment-related functionality.
 */

import { PaymentProviderFactory } from './PaymentProviderFactory';
import type { 
  PaymentIntentResponse,
  PaymentConfirmationResponse, 
  PaymentStatusResponse,
  WebhookResponse
} from './PaymentProviderInterface';
import { getSelectedPaymentProvider } from '../../config/paymentProviders';

/**
 * PaymentService class
 * Centralizes all payment-related operations
 */
export class PaymentService {
  /**
   * Get the currently active payment provider name
   * @returns String name of the currently configured payment provider
   */
  public static getActiveProvider(): string {
    return getSelectedPaymentProvider();
  }

  /**
   * Create a payment intent/session
   * @param amount Payment amount
   * @param paymentMethods Available payment methods
   * @param metadata Additional payment metadata
   * @returns Payment intent response
   */
  public static async createPaymentIntent(
    amount: number,
    paymentMethods: string[] = [],
    metadata: Record<string, any> = {}
  ): Promise<PaymentIntentResponse> {
    // Add provider information to metadata
    const provider = this.getActiveProvider();
    const enrichedMetadata = {
      ...metadata,
      provider,
      created_at: new Date().toISOString()
    };

    console.log(`Creating payment intent with provider: ${provider}`);
    
    // Get payment provider and create intent
    const paymentProvider = PaymentProviderFactory.getProvider();
    return await paymentProvider.createPaymentIntent(amount, paymentMethods, enrichedMetadata);
  }

  /**
   * Confirm a payment
   * @param paymentId Payment intent/session ID
   * @param provider Optional provider override
   * @returns Payment confirmation response
   */
  public static async confirmPayment(
    paymentId: string,
    provider?: string
  ): Promise<PaymentConfirmationResponse> {
    const paymentProvider = provider 
      ? PaymentProviderFactory.getProviderByName(provider)
      : PaymentProviderFactory.getProvider();
      
    return await paymentProvider.confirmPayment(paymentId);
  }

  /**
   * Get payment status
   * @param paymentId Payment intent/session ID
   * @param provider Optional provider override
   * @returns Payment status response
   */
  public static async getPaymentStatus(
    paymentId: string,
    provider?: string
  ): Promise<PaymentStatusResponse> {
    const paymentProvider = provider 
      ? PaymentProviderFactory.getProviderByName(provider)
      : PaymentProviderFactory.getProvider();
      
    return await paymentProvider.getPaymentStatus(paymentId);
  }

  /**
   * Handle payment webhook
   * @param payload Webhook payload
   * @param signature Webhook signature for verification
   * @param provider Optional provider override
   * @returns Webhook processing response
   */
  public static async handleWebhook(
    payload: any,
    signature?: string,
    provider?: string
  ): Promise<WebhookResponse> {
    const paymentProvider = provider 
      ? PaymentProviderFactory.getProviderByName(provider)
      : PaymentProviderFactory.getProvider();
      
    return await paymentProvider.handleWebhook(payload, signature);
  }
}
