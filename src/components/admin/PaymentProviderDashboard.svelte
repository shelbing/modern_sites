<script>
  import { onMount } from 'svelte';
  import { PaymentService } from '../../services/payment/PaymentService';
  import { supportedProviders, getProviderConfig } from '../../config/paymentProviders';
  import { testPaymentProviders, getProviderCapabilities } from '../../utils/paymentDiagnostics';
  
  // Component state
  let activeProvider = '';
  let providers = [];
  let testResults = {};
  let loading = true;
  let testing = false;
  let expandedSection = null;
  
  onMount(async () => {
    // Get active provider
    activeProvider = PaymentService.getActiveProvider();
    loadProviders();
    loading = false;
  });
  
  // Load provider information
  function loadProviders() {
    providers = supportedProviders.map(provider => {
      const config = getProviderConfig(provider);
      const capabilities = getProviderCapabilities(provider);
      
      // Check if provider has required API keys
      const hasRequiredKeys = (
        (provider === 'stripe' && !!config.secretKey) ||
        (provider === 'sumup' && !!config.apiKey) ||
        (provider === 'adyen' && !!config.apiKey && !!config.merchantAccount)
      );
      
      return {
        id: provider,
        name: provider.charAt(0).toUpperCase() + provider.slice(1),
        active: provider === activeProvider,
        configured: hasRequiredKeys,
        capabilities,
        config: maskSecrets(config)
      };
    });
  }
  
  // Mask sensitive values in config
  function maskSecrets(config) {
    const maskedConfig = { ...config };
    
    // Mask sensitive keys
    for (const key of ['secretKey', 'apiKey', 'webhookSecret', 'password', 'webhookHmacKey']) {
      if (maskedConfig[key]) {
        const value = maskedConfig[key];
        maskedConfig[key] = value.substring(0, 4) + '•'.repeat(Math.max(0, value.length - 8)) + value.substring(value.length - 4);
      }
    }
    
    return maskedConfig;
  }
  
  // Run connection test for all providers
  async function testConnections() {
    testing = true;
    try {
      testResults = await testPaymentProviders();
    } catch (error) {
      console.error('Error testing providers:', error);
    } finally {
      testing = false;
    }
  }
  
  // Toggle section expansion
  function toggleSection(section) {
    expandedSection = expandedSection === section ? null : section;
  }
</script>

<div class="p-6 bg-background-light dark:bg-background-dark rounded-lg shadow-md">
  <h2 class="text-xl font-semibold mb-6 text-text-light dark:text-text-dark">
    Payment Provider Dashboard
  </h2>
  
  {#if loading}
    <div class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primarybutton-light dark:border-primarybutton-dark"></div>
    </div>
  {:else}
    <!-- Active Provider -->
    <div class="mb-6 p-4 rounded-lg bg-background-light dark:bg-background-dark border border-inputBorder-light dark:border-inputBorder-dark">
      <h3 class="text-lg font-medium mb-3 text-text-light dark:text-text-dark">Active Provider</h3>
      <div class="flex items-center">
        <div class="px-4 py-3 rounded-lg bg-primarybutton-light text-primarybuttontext-light dark:bg-primarybutton-dark dark:text-primarybuttontext-dark font-medium">
          {activeProvider.toUpperCase()}
        </div>
        <p class="ml-4 text-sm text-textSecondary-light dark:text-textSecondary-dark">
          Set via <code class="px-1 py-0.5 rounded bg-input-light dark:bg-input-dark">PUBLIC_PAYMENT_PROVIDER</code> environment variable
        </p>
      </div>
    </div>
    
    <!-- Connection Testing -->
    <div class="mb-6">
      <button 
        class="px-4 py-2 bg-secondarybutton-light text-secondarybuttontext-light dark:bg-secondarybutton-dark dark:text-secondarybuttontext-dark rounded-lg disabled:opacity-50"
        on:click={testConnections}
        disabled={testing}>
        {testing ? 'Testing...' : 'Test All Provider Connections'}
      </button>
      
      {#if Object.keys(testResults).length > 0}
        <div class="mt-4 grid gap-4 md:grid-cols-3">
          {#each Object.entries(testResults) as [provider, result]}
            <div class="p-3 rounded-lg border {result.success ? 'border-green-500 dark:border-green-700' : 'border-red-500 dark:border-red-700'}">
              <h4 class="font-medium text-text-light dark:text-text-dark">{provider}</h4>
              <p class="text-sm mt-1 {result.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">
                {result.message}
              </p>
            </div>
          {/each}
        </div>
      {/if}
    </div>
    
    <!-- Provider Overview -->
    <div class="space-y-4">
      {#each providers as provider}
        <div class="border border-inputBorder-light dark:border-inputBorder-dark rounded-lg overflow-hidden">
          <!-- Provider Header -->
          <div 
            class="p-4 flex justify-between items-center cursor-pointer {provider.active ? 'bg-primarybutton-light bg-opacity-10 dark:bg-primarybutton-dark dark:bg-opacity-10' : ''}"
            on:click={() => toggleSection(provider.id)}
          >
            <div class="flex items-center">
              <span class="font-medium text-text-light dark:text-text-dark">{provider.name}</span>
              {#if provider.active}
                <span class="ml-2 px-2 py-0.5 text-xs rounded-full bg-primarybutton-light text-primarybuttontext-light dark:bg-primarybutton-dark dark:text-primarybuttontext-dark">Active</span>
              {/if}
              {#if !provider.configured}
                <span class="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-500 text-white">Not Configured</span>
              {/if}
            </div>
            <svg 
              class="w-5 h-5 transition-transform {expandedSection === provider.id ? 'transform rotate-180' : ''}" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
          
          <!-- Provider Details (expandable) -->
          {#if expandedSection === provider.id}
            <div class="p-4 border-t border-inputBorder-light dark:border-inputBorder-dark">
              <!-- Configuration -->
              <div class="mb-4">
                <h4 class="font-medium mb-2 text-text-light dark:text-text-dark">Configuration</h4>
                <div class="bg-input-light dark:bg-input-dark rounded-lg p-3 text-sm">
                  <pre class="whitespace-pre-wrap break-words text-textSecondary-light dark:text-textSecondary-dark">{JSON.stringify(provider.config, null, 2)}</pre>
                </div>
              </div>
              
              <!-- Capabilities -->
              <div>
                <h4 class="font-medium mb-2 text-text-light dark:text-text-dark">Capabilities</h4>
                <div class="grid grid-cols-2 gap-2">
                  {#each Object.entries(provider.capabilities) as [capability, supported]}
                    <div class="flex items-center">
                      <span class="w-4 h-4 flex items-center justify-center rounded-full mr-2 {supported ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}">
                        {#if supported}
                          <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                          </svg>
                        {/if}
                      </span>
                      <span class="text-sm text-text-light dark:text-text-dark">
                        {capability.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                      </span>
                    </div>
                  {/each}
                </div>
              </div>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>
