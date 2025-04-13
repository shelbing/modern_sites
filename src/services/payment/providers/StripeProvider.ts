import Stripe from 'stripe';
import type { 
  PaymentProviderInterface, 
  PaymentIntentResponse,
  PaymentConfirmationResponse,
  PaymentStatusResponse,
  WebhookResponse
} from '../PaymentProviderInterface';
import { stripeConfig } from '../../../config/paymentProviders';

/**
 * Stripe Payment Provider Implementation
 * 
 * Implements the PaymentProviderInterface for Stripe
 */
export class StripeProvider implements PaymentProviderInterface {
  private stripe: Stripe;
  
  constructor() {
    // Initialize Stripe client with API key and version
    this.stripe = new Stripe(stripeConfig.secretKey, {
      apiVersion: stripeConfig.apiVersion
    });
  }

  /**
   * Creates a payment intent using Stripe
   */
  async createPaymentIntent(
    amount: number,
    paymentMethods: string[],
    metadata: any
  ): Promise<PaymentIntentResponse> {
    try {
      console.log('Creating Stripe payment intent with amount:', amount);
      
      // Filter payment methods to only include those supported by Stripe
      const filteredPaymentMethods = paymentMethods.filter(method => 
        stripeConfig.paymentMethods.includes(method)
      );

      // If no payment methods are specified or none match, use all supported methods
      const methodsToUse = filteredPaymentMethods.length > 0 
        ? filteredPaymentMethods 
        : stripeConfig.paymentMethods;
      
      // Create payment intent with Stripe API
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "eur",
        payment_method_types: methodsToUse,
        metadata,
        payment_method_options: {
          sofort: {
            preferred_language: 'de'
          },
          card: {
            request_three_d_secure: 'automatic'
          }
        }
      });

      console.log('Stripe payment intent created:', {
        id: paymentIntent.id,
        availablePaymentMethods: paymentIntent.payment_method_types
      });

      // Return standardized response
      return {
        id: paymentIntent.id,
        client_secret: paymentIntent.client_secret,
        status: paymentIntent.status,
        amount: amount
      };
    } catch (error) {
      console.error('Error creating Stripe payment intent:', error);
      if (error instanceof Stripe.errors.StripeError) {
        console.error('Stripe error details:', {
          type: error.type,
          code: error.code,
          message: error.message
        });
      }
      throw new Error('Failed to initialize Stripe payment');
    }
  }

  /**
   * Confirms a payment with Stripe
   */
  async confirmPayment(paymentId: string): Promise<PaymentConfirmationResponse> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentId);
      
      // If payment needs confirmation, try to confirm it
      if (paymentIntent.status === 'requires_confirmation') {
        const confirmedIntent = await this.stripe.paymentIntents.confirm(paymentId);
        
        return {
          success: true,
          status: confirmedIntent.status,
          message: 'Payment confirmed',
          paymentId: paymentId, // Use the original ID we passed in
          providerResponse: confirmedIntent
        };
      }
      
      // Otherwise just return current status
      return {
        success: paymentIntent.status === 'succeeded',
        status: paymentIntent.status,
        message: `Payment is in ${paymentIntent.status} state`,
        paymentId: paymentIntent.id,
        providerResponse: paymentIntent
      };
    } catch (error) {
      console.error('Error confirming Stripe payment:', error);
      throw new Error('Failed to confirm payment with Stripe');
    }
  }

  /**
   * Gets payment status from Stripe
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentId);
      
      return {
        status: paymentIntent.status,
        paid: paymentIntent.status === 'succeeded',
        amount: paymentIntent.amount / 100, // Convert cents to euros
        currency: paymentIntent.currency,
        paymentMethod: paymentIntent.payment_method_types?.[0],
        metadata: paymentIntent.metadata,
        providerResponse: paymentIntent
      };
    } catch (error) {
      console.error('Error retrieving Stripe payment status:', error);
      throw new Error('Failed to retrieve payment status from Stripe');
    }
  }

  /**
   * Handles webhook events from Stripe
   */
  async handleWebhook(payload: any, signature?: string): Promise<WebhookResponse> {
    try {
      if (!signature || !stripeConfig.webhookSecret) {
        throw new Error('Missing webhook signature or secret');
      }
      
      // Verify webhook signature
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        stripeConfig.webhookSecret
      );
      
      // Process different event types
      switch (event.type) {
        case 'payment_intent.succeeded':
          // Handle successful payment
          return {
            success: true,
            status: 'succeeded',
            message: 'Payment succeeded',
            event: event.type,
            paymentId: event.data.object.id,
            providerResponse: event
          };
          
        case 'payment_intent.payment_failed':
          // Handle failed payment
          return {
            success: false,
            status: 'failed',
            message: 'Payment failed',
            event: event.type,
            paymentId: event.data.object.id,
            providerResponse: event
          };
          
        default:
          // Handle other event types
          // Extract payment ID if available (handling different Stripe object types)
          let paymentId: string | undefined;
          const eventObject = event.data.object;
          
          if (eventObject && typeof eventObject === 'object') {
            // Most Stripe objects have an id property, but some might not
            paymentId = 'id' in eventObject ? String(eventObject.id) : undefined;
          }
          
          return {
            success: true,
            status: 'processed',
            message: `Processed ${event.type} event`,
            event: event.type,
            paymentId,
            providerResponse: event
          };
      }
    } catch (error) {
      console.error('Error handling Stripe webhook:', error);
      throw new Error('Failed to process Stripe webhook');
    }
  }
}
