import type { 
  PaymentProviderInterface, 
  PaymentIntentResponse,
  PaymentConfirmationResponse,
  PaymentStatusResponse,
  WebhookResponse
} from '../PaymentProviderInterface';
import { sumUpConfig } from '../../../config/paymentProviders';

/**
 * SumUp Payment Provider Implementation
 * 
 * Implements the PaymentProviderInterface for SumUp
 */
export class SumUpProvider implements PaymentProviderInterface {
  constructor() {
    // Check if required configuration exists
    if (!sumUpConfig.apiKey) {
      console.warn('SumUp API key is not configured');
    }
    if (!sumUpConfig.merchantEmail) {
      console.warn('SumUp merchant email is not configured');
    }
  }

  /**
   * Creates a checkout session using SumUp
   */
  async createPaymentIntent(
    amount: number,
    paymentMethods: string[],
    metadata: any
  ): Promise<PaymentIntentResponse> {
    try {
      console.log('Creating SumUp checkout with amount:', amount);
      
      // Validate required config
      if (!sumUpConfig.apiKey) {
        throw new Error("SUMUP_API_KEY is not configured");
      }
      if (!sumUpConfig.merchantEmail) {
        throw new Error("SUMUP_MERCHANT_EMAIL is not configured");
      }
      if (!sumUpConfig.siteUrl) {
        throw new Error("PUBLIC_SITE_URL is not configured");
      }

      const checkoutReference = metadata.bookingReference || `BOOKING-${Date.now()}`;

      // Prepare the checkout data
      const checkoutData = {
        amount: (amount / 100).toFixed(2), // Convert cents to decimal amount
        currency: "EUR",
        checkout_reference: checkoutReference,
        pay_to_email: sumUpConfig.merchantEmail,
        description: `Hotel Stern Booking ${checkoutReference}`,
        return_url: `${sumUpConfig.siteUrl}/api/ibe/sumup-webhook`,
        customer: {
          email: metadata.customerEmail,
          first_name: metadata.customerName?.split(' ')[0] || '',
          last_name: metadata.customerName?.split(' ').slice(1).join(' ') || ''
        }
      };

      console.log('Creating SumUp checkout with data:', checkoutData);

      const response = await fetch("https://api.sumup.com/v0.1/checkouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sumUpConfig.apiKey}`,
        },
        body: JSON.stringify(checkoutData),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('SumUp API Error Response:', error);
        throw new Error(`SumUp API Error: ${error.message || 'Unknown error'}`);
      }

      const checkout = await response.json();
      console.log('SumUp Checkout Response:', checkout);
      
      // Return in a format compatible with our payment flow
      return {
        id: checkout.id,
        client_secret: checkout.id, // SumUp doesn't have a client secret, use checkout ID
        status: 'pending',
        amount: amount,
        provider_specific: {
          checkout_id: checkout.id,
          checkout_reference: checkoutReference,
          checkout_url: checkout.links?.payment_url,
          merchant_code: checkout.merchant_code,
          date: checkout.date,
          status: checkout.status,
          payment_url: checkout.links?.payment_url
        }
      };
    } catch (error) {
      console.error('Error creating SumUp checkout:', error);
      throw new Error('Failed to initialize SumUp payment');
    }
  }

  /**
   * Confirms a payment with SumUp
   * Note: SumUp doesn't have a dedicated confirmation API, this is a placeholder
   */
  async confirmPayment(paymentId: string): Promise<PaymentConfirmationResponse> {
    try {
      // Check payment status as confirmation
      const status = await this.getPaymentStatus(paymentId);
      
      return {
        success: status.paid,
        status: status.status,
        message: status.paid ? 'Payment confirmed' : 'Payment not confirmed',
        paymentId: paymentId,
        providerResponse: status.providerResponse
      };
    } catch (error) {
      console.error('Error confirming SumUp payment:', error);
      throw new Error('Failed to confirm payment with SumUp');
    }
  }

  /**
   * Gets payment status from SumUp
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
    try {
      if (!sumUpConfig.apiKey) {
        throw new Error("SUMUP_API_KEY is not configured");
      }

      const response = await fetch(`https://api.sumup.com/v0.1/checkouts/${paymentId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sumUpConfig.apiKey}`,
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`SumUp API Error: ${error.message || 'Unknown error'}`);
      }

      const checkout = await response.json();
      
      // Determine if payment is complete
      const isPaid = checkout.status === 'PAID';
      
      return {
        status: checkout.status,
        paid: isPaid,
        amount: parseFloat(checkout.amount),
        currency: checkout.currency,
        metadata: checkout.metadata,
        providerResponse: checkout
      };
    } catch (error) {
      console.error('Error retrieving SumUp payment status:', error);
      throw new Error('Failed to retrieve payment status from SumUp');
    }
  }

  /**
   * Handles webhook events from SumUp
   */
  async handleWebhook(payload: any): Promise<WebhookResponse> {
    try {
      console.log('Processing SumUp webhook payload:', payload);
      
      // Basic validation
      if (!payload || !payload.event_type) {
        throw new Error('Invalid webhook payload');
      }
      
      // Process different event types
      switch (payload.event_type) {
        case 'PAYMENT_COMPLETE':
          return {
            success: true,
            status: 'succeeded',
            message: 'Payment succeeded',
            event: payload.event_type,
            paymentId: payload.checkout_id,
            providerResponse: payload
          };
          
        case 'PAYMENT_FAILED':
          return {
            success: false,
            status: 'failed',
            message: 'Payment failed',
            event: payload.event_type,
            paymentId: payload.checkout_id,
            providerResponse: payload
          };
          
        default:
          return {
            success: true,
            status: 'processed',
            message: `Processed ${payload.event_type} event`,
            event: payload.event_type,
            paymentId: payload.checkout_id,
            providerResponse: payload
          };
      }
    } catch (error) {
      console.error('Error handling SumUp webhook:', error);
      throw new Error('Failed to process SumUp webhook');
    }
  }
}
