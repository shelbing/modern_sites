/**
 * Common interface for all payment providers
 * This ensures consistent method signatures across different payment implementations
 */
export interface PaymentProviderInterface {
  /**
   * Creates a payment intent/checkout session
   * @param amount The payment amount
   * @param paymentMethods Available payment methods
   * @param metadata Additional metadata for the payment
   * @returns Payment intent response
   */
  createPaymentIntent(
    amount: number,
    paymentMethods: string[],
    metadata: any
  ): Promise<PaymentIntentResponse>;

  /**
   * Confirms a payment
   * @param paymentId The payment intent/checkout ID
   * @returns Confirmation result
   */
  confirmPayment(paymentId: string): Promise<PaymentConfirmationResponse>;
  
  /**
   * Retrieves the status of a payment
   * @param paymentId The payment intent/checkout ID
   * @returns Current payment status
   */
  getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse>;
  
  /**
   * Handles webhook events from the payment provider
   * @param payload The webhook payload
   * @param signature The webhook signature (if applicable)
   * @returns Webhook processing result
   */
  handleWebhook(payload: any, signature?: string): Promise<WebhookResponse>;
}

/**
 * Standard response format for payment intents
 */
export interface PaymentIntentResponse {
  id: string;
  client_secret: string | null;
  status: string;
  amount: number;
  provider_specific?: {
    checkout_id?: string;
    checkout_reference?: string;
    merchant_code?: string;
    date?: string;
    status?: string;
    checkout_url?: string;
    payment_url?: string;
    [key: string]: any; // Allow additional provider-specific fields
  };
}

/**
 * Standard response format for payment confirmations
 */
export interface PaymentConfirmationResponse {
  success: boolean;
  status: string;
  message: string;
  paymentId: string;
  providerResponse?: any;
}

/**
 * Standard response format for payment status checks
 */
export interface PaymentStatusResponse {
  status: string;
  paid: boolean;
  amount: number;
  currency: string;
  paymentMethod?: string;
  metadata?: any;
  providerResponse?: any;
}

/**
 * Standard response format for webhook processing
 */
export interface WebhookResponse {
  success: boolean;
  status: string;
  message: string;
  event?: string;
  paymentId?: string;
  providerResponse?: any;
}
