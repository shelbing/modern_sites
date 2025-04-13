<script>
    import { cartStore } from "../../stores/cartStore";
    import { stripeStore } from "../../stores/stripeStore";
    import { bookingStep } from "../../stores/bookingStore";
    import { formTranslations } from "../../lib/translations";
    import { getPublicConfig } from "../../lib/env";
    import { get } from "svelte/store";
    import CartConfirmation from "./CartConfirmation.svelte";
    import AdditionalServices from "./AdditionalServices.svelte";
    import TotalPrice from "./TotalPrice.svelte";
    import { onMount } from "svelte";

    export let language;
    $: t = formTranslations[language] || formTranslations.en;

    onMount(() => {
        const { paymentProvider } = getPublicConfig();
        // Reset stripe store to initial state
        stripeStore.set({
            clientSecret: null,
            paymentIntentId: null,
            paymentStatus: null,
            bookingReference: null,
            bookingId: null,
            availablePaymentMethods: [],
            payment_provider: paymentProvider
        });
    });

    function handleContinue() {
        const currentCart = get(cartStore);
        bookingStep.set(3);
    }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
    <!-- Cart Summary -->
    <div class="w-full">
        <CartConfirmation {language} />
    </div>

    <!-- Additional Services -->
    <div class="w-full">
        <div class="bg-background-light dark:bg-background-dark rounded-lg shadow-lg p-4">
            <h2 class="text-h5 font-semibold text-text-light dark:text-text-dark mb-4">
                {t.additionalServices}
            </h2>
            <AdditionalServices {language} />
        </div>
    </div>

    <!-- Total Price and Continue Button -->
    <div class="w-full space-y-6">
        <TotalPrice {language} />
        <div class="flex justify-between items-center">
            <button
                class="px-4 py-2 border border-gray-300 bg-secondarybutton-light text-secondarybuttontext-light dark:bg-secondarybutton-dark dark:text-secondarybuttontext-dark rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-secondary-light dark:focus:ring-secondary-dark focus:ring-offset-2 text-sm"
                on:click={() => bookingStep.set(1)}
            >
                {t.back}
            </button>
            <button
                class="px-4 py-2 bg-primarybutton-light text-primarybuttontext-light dark:bg-primarybutton-dark dark:text-primarybuttontext-dark rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                on:click={handleContinue}
            >
                {t.continueToConfirmation}
            </button>
        </div>
    </div>
</div>
