import {
  getSelectedPaymentProvider,
  isProviderSupported,
  defaultProvider
} from '../../config/paymentProviders';
import type { PaymentProviderInterface } from './PaymentProviderInterface';
import { StripeProvider } from './providers/StripeProvider';
import { SumUpProvider } from './providers/SumUpProvider';
import { AdyenProvider } from './providers/AdyenProvider';

/**
 * Payment Provider Factory
 * 
 * This factory creates and returns the appropriate payment provider instance
 * based on the configured environment variable.
 */
export class PaymentProviderFactory {
  // Cache for provider instances
  private static providers: Record<string, PaymentProviderInterface> = {};
  
  /**
   * Get the configured payment provider instance
   * @returns A provider instance implementing PaymentProviderInterface
   */
  public static getProvider(): PaymentProviderInterface {
    const providerName = getSelectedPaymentProvider();
    return this.getProviderByName(providerName);
  }
  
  /**
   * Get a specific payment provider by name
   * @param providerName The name of the provider to get
   * @returns A provider instance implementing PaymentProviderInterface
   */
  public static getProviderByName(providerName: string): PaymentProviderInterface {
    // Validate provider is supported
    if (!isProviderSupported(providerName)) {
      console.warn(`Payment provider "${providerName}" is not supported. Using default provider "${defaultProvider}".`);
      providerName = defaultProvider;
    }
    
    // Check if we already have an instance
    if (this.providers[providerName]) {
      return this.providers[providerName];
    }
    
    // Create new provider instance
    let provider: PaymentProviderInterface;
    
    switch (providerName.toLowerCase()) {
      case 'stripe':
        provider = new StripeProvider();
        break;
      case 'sumup':
        provider = new SumUpProvider();
        break;
      case 'adyen':
        provider = new AdyenProvider();
        break;
      default:
        // This should never happen because of the isProviderSupported check
        console.error(`Unsupported payment provider: ${providerName}. Using default.`);
        provider = new StripeProvider();
    }
    
    // Cache the instance
    this.providers[providerName] = provider;
    
    return provider;
  }
  
  /**
   * Clear provider cache
   * Useful for testing or when configuration changes at runtime
   */
  public static clearCache(): void {
    this.providers = {};
  }
}
