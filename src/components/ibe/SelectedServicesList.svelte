<script>
    import { formTranslations } from "../../lib/translations";
    import { cartStore } from "../../stores/cartStore";

    export let language;
    $: t = formTranslations[language] || formTranslations.en;

    // Get selected services from the cart store
    $: selectedServices = $cartStore?.offer?.Services?.filter(service => service.selected) || [];
    $: selectedServicesAmounts = $cartStore?.selectedServices?.amounts || {
        gross: 0,
        net: 0,
        tax: 0
    };
    
    $: currency = $cartStore?.offer?.currency || 'EUR';

    function formatPrice(amount, curr = 'EUR') {
        return new Intl.NumberFormat(language, {
            style: 'currency',
            currency: curr
        }).format(amount);
    }
</script>

{#if selectedServices.length > 0}
    <div class="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
        <div class="text-body-base text-gray-700 dark:text-gray-300 font-medium mb-2">
            {t.selectedServices}
        </div>
        <!-- List of selected services -->
        <div class="space-y-2">
            {#each selectedServices as service}
                <div class="flex justify-between items-start text-body-sm">
                    <div class="flex-grow">
                        <div class="font-medium text-gray-600 dark:text-gray-400">
                            {service.Name}
                            {#if service.quantity > 1}
                                <span class="text-gray-500 dark:text-gray-500">
                                    ({service.quantity}x)
                                </span>
                            {/if}
                        </div>
                        {#if service.Beschreibung}
                            <div class="text-gray-500 dark:text-gray-500 text-body-xs mt-0.5">
                                {service.Beschreibung}
                            </div>
                        {/if}
                    </div>
                    <div class="text-gray-600 dark:text-gray-400 ml-4 text-right">
                        <div>
                            {formatPrice(service.pricePerUnit * service.quantity, currency)}
                        </div>
                        {#if service.quantity > 1}
                            <div class="text-body-xs text-gray-500 dark:text-gray-500">
                                {#if service.Buchbarkeit === "5"}
                                    ({formatPrice(service.pricePerUnit, currency)} {t.perGuest})
                                {:else}
                                    ({formatPrice(service.pricePerUnit, currency)} {t.perItem})
                                {/if}
                            </div>
                        {/if}
                    </div>
                </div>
            {/each}

            <!-- Services Total -->
            {#if selectedServices.length > 1}
                <div class="flex justify-between items-center pt-2 mt-2 border-t border-gray-200 dark:border-gray-700 font-medium text-body-base">
                    <span class="text-gray-700 dark:text-gray-300">
                        {t.selectedServicesTotal}
                    </span>
                    <span class="text-gray-700 dark:text-gray-300">
                        {formatPrice(selectedServicesAmounts.gross, currency)}
                    </span>
                </div>
            {/if}
        </div>
    </div>
{/if}
