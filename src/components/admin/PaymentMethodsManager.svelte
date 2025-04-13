<script>
  import { onMount } from 'svelte';
  import { PaymentService } from '../../services/payment/PaymentService';
  import { getProviderConfig, supportedProviders } from '../../config/paymentProviders';
  
  // Component state
  let activeProvider = '';
  let providers = [];
  let paymentMethods = [];
  let loading = true;
  let error = '';
  let success = '';
  
  onMount(async () => {
    try {
      // Get active provider
      activeProvider = PaymentService.getActiveProvider();
      
      // Format providers for display
      providers = supportedProviders.map(provider => ({
        id: provider,
        name: provider.charAt(0).toUpperCase() + provider.slice(1),
        active: provider === activeProvider,
        config: getProviderConfig(provider)
      }));
      
      // Load payment methods
      await loadPaymentMethods();
      
      loading = false;
    } catch (err) {
      error = `Error initializing payment methods: ${err.message}`;
      loading = false;
    }
  });
  
  // Load available payment methods for current provider
  async function loadPaymentMethods() {
    try {
      const config = getProviderConfig(activeProvider);
      
      paymentMethods = config.paymentMethods.map(method => ({
        id: method,
        name: formatMethodName(method),
        enabled: true, // Default to enabled
        icon: getPaymentMethodIcon(method)
      }));
    } catch (err) {
      error = `Error loading payment methods: ${err.message}`;
    }
  }
  
  // Handle provider change
  async function changeProvider(provider) {
    activeProvider = provider;
    await loadPaymentMethods();
    success = `Switched to ${provider} payment provider`;
    setTimeout(() => { success = ''; }, 3000);
  }
  
  // Format payment method name for display
  function formatMethodName(methodId) {
    const names = {
      'card': 'Credit/Debit Card',
      'ideal': 'iDEAL',
      'sofort': 'Sofort',
      'giropay': 'Giropay',
      'sepa_debit': 'SEPA Direct Debit',
      'bancontact': 'Bancontact',
      'eps': 'EPS',
      'p24': 'Przelewy24',
      'scheme': 'Credit Card',
      'sepadirectdebit': 'SEPA Direct Debit'
    };
    
    return names[methodId] || methodId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
  
  // Get icon for payment method
  function getPaymentMethodIcon(methodId) {
    const icons = {
      'card': 'fa-credit-card',
      'ideal': 'fa-university',
      'sofort': 'fa-euro-sign',
      'giropay': 'fa-university',
      'sepa_debit': 'fa-university',
      'bancontact': 'fa-credit-card',
      'eps': 'fa-euro-sign',
      'p24': 'fa-money-bill',
      'scheme': 'fa-credit-card',
      'sepadirectdebit': 'fa-university'
    };
    
    return icons[methodId] || 'fa-money-bill';
  }
</script>

<div class="p-6 bg-background-light dark:bg-background-dark rounded-lg shadow-md">
  <h2 class="text-xl font-semibold mb-6 text-text-light dark:text-text-dark">
    Payment Methods Configuration
  </h2>
  
  {#if loading}
    <div class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primarybutton-light dark:border-primarybutton-dark"></div>
    </div>
  {:else if error}
    <div class="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg mb-4">
      {error}
    </div>
  {:else}
    {#if success}
      <div class="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-4 rounded-lg mb-4 transition-opacity">
        {success}
      </div>
    {/if}
    
    <!-- Provider Selection -->
    <div class="mb-6">
      <h3 class="text-lg font-medium mb-2 text-text-light dark:text-text-dark">Active Provider</h3>
      <div class="flex flex-wrap gap-2">
        {#each providers as provider}
          <button 
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  {provider.active 
                    ? 'bg-primarybutton-light text-primarybuttontext-light dark:bg-primarybutton-dark dark:text-primarybuttontext-dark' 
                    : 'bg-secondarybutton-light text-secondarybuttontext-light dark:bg-secondarybutton-dark dark:text-secondarybuttontext-dark'}"
            on:click={() => changeProvider(provider.id)}>
            {provider.name}
            {#if provider.active}
              <span class="ml-1">✓</span>
            {/if}
          </button>
        {/each}
      </div>
      <p class="mt-2 text-sm text-textSecondary-light dark:text-textSecondary-dark">
        Provider configuration is controlled via environment variables.
      </p>
    </div>
    
    <!-- Payment Methods List -->
    <div>
      <h3 class="text-lg font-medium mb-4 text-text-light dark:text-text-dark">
        Available Payment Methods ({activeProvider})
      </h3>
      
      <div class="grid gap-4 md:grid-cols-2">
        {#each paymentMethods as method}
          <div class="border border-inputBorder-light dark:border-inputBorder-dark rounded-lg p-4 flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-10 h-10 flex items-center justify-center bg-input-light dark:bg-input-dark rounded-full mr-3">
                <i class="fas {method.icon} text-textSecondary-light dark:text-textSecondary-dark"></i>
              </div>
              <span class="font-medium text-text-light dark:text-text-dark">{method.name}</span>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" bind:checked={method.enabled} class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent-light dark:peer-focus:ring-accent-dark rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primarybutton-light dark:peer-checked:bg-primarybutton-dark"></div>
            </label>
          </div>
        {/each}
      </div>
      
      {#if paymentMethods.length === 0}
        <div class="p-4 bg-input-light dark:bg-input-dark rounded-lg text-center text-textSecondary-light dark:text-textSecondary-dark">
          No payment methods available for this provider. Please check your configuration.
        </div>
      {/if}
    </div>
    
    <!-- Action Buttons -->
    <div class="mt-6 flex justify-end gap-3">
      <button class="px-4 py-2 bg-secondarybutton-light text-secondarybuttontext-light dark:bg-secondarybutton-dark dark:text-secondarybuttontext-dark rounded-lg">
        Reset
      </button>
      <button class="px-4 py-2 bg-primarybutton-light text-primarybuttontext-light dark:bg-primarybutton-dark dark:text-primarybuttontext-dark rounded-lg">
        Save Changes
      </button>
    </div>
  {/if}
</div>
