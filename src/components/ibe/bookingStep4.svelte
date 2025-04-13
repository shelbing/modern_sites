<script>
    import CartConfirmation from "./CartConfirmation.svelte";
    import { formTranslations } from "../../lib/translations";
    import PaymentForm from "./paymentForm.svelte";
    import TotalPrice from "./TotalPrice.svelte";
    import { stripeStore } from "../../stores/stripeStore";
    import { bookingStep } from "../../stores/bookingStore";
    import { cartStore } from "../../stores/cartStore";
    import { onMount } from "svelte";

    export let language;
    let paymentForm;
    let isLoading = false;

    $: t = formTranslations[language] || formTranslations.en;

    // Enhanced debug logging for stripe store state
    $: {
        console.log("=== STRIPE STORE STATE UPDATE ====");
        console.log("Client Secret:", $stripeStore.clientSecret);
        console.log("Payment Intent ID:", $stripeStore.paymentIntentId);
        console.log("Payment Status:", $stripeStore.paymentStatus);
        console.log("Payment Provider:", $stripeStore.payment_provider);
        console.log("Provider Specific Data:", $stripeStore.provider_specific);
        console.log("Error Message:", $stripeStore.errorMessage);
        console.log("==============================");
    }

    // Call prepare_booking API endpoint when the component is mounted
    onMount(async () => {
        try {
            const cartData = $cartStore;
            if (cartData && cartData.booking) {
                console.log("Calling prepare_booking API with booking data:");
                const response = await fetch("/api/ibe/prepare_booking", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(cartData),
                });

                const result = await response.json();
                console.log("prepare_booking API response:", result);

                if (result.success && result.webhookResponse) {
                    const webhookData = result.webhookResponse;
                    console.log("Webhook response data:", webhookData);

                    if (
                        webhookData.Status === "Success" &&
                        webhookData.Payment_ID
                    ) {
                        // Update the stripe store with the payment intent secret
                        console.log("=== UPDATING STRIPE STORE WITH WEBHOOK DATA ====");
                        console.log("Payment_ID (Client Secret):", webhookData.Payment_ID);
                        console.log("Booking_ID (Payment Intent ID):", webhookData.Booking_ID);
                        console.log("Status:", webhookData.Status);
                        console.log("Provider Specific Data:", webhookData.provider_specific || 'None');
                        
                        stripeStore.update((state) => ({
                            ...state,
                            clientSecret: webhookData.Payment_ID,
                            paymentIntentId: webhookData.Booking_ID,
                            paymentStatus: webhookData.Status,
                            provider_specific: webhookData.provider_specific || null,
                            errorMessage: null,
                        }));
                        
                        console.log("Stripe store updated successfully");
                    } else if (webhookData.Error_Reason) {
                        // Handle error case
                        stripeStore.update((state) => ({
                            ...state,
                            errorMessage: webhookData.Error_Reason,
                        }));
                    }
                } else {
                    console.error("Error preparing booking:", result.message);
                    stripeStore.update((state) => ({
                        ...state,
                        errorMessage:
                            result.message || "Error preparing booking",
                    }));
                }
            } else {
                console.warn("No booking data found in cart store");
                stripeStore.update((state) => ({
                    ...state,
                    errorMessage: "No booking data found",
                }));
            }
        } catch (error) {
            console.error("Error calling prepare_booking API:", error);
            stripeStore.update((state) => ({
                ...state,
                errorMessage: error.message || "Error processing payment",
            }));
        }
    });

    function handleSubmitStart() {
        isLoading = true;
    }

    function handleSubmitEnd() {
        isLoading = false;
    }
</script>

<div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-8">{t.payment}</h1>
    <div class="space-y-8">
        <CartConfirmation {language} />
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <TotalPrice {language} />
            {#if $stripeStore.paymentStatus === "Success" && $stripeStore.clientSecret}
                <div class="mt-6">
                    <PaymentForm
                        bind:this={paymentForm}
                        {language}
                        on:submitStart={handleSubmitStart}
                        on:submitEnd={handleSubmitEnd}
                    />
                    <!-- Navigation Buttons -->
                    <div class="flex justify-between items-center mt-6">
                        <button
                            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            on:click={() => bookingStep.set(3)}
                            disabled={isLoading}
                        >
                            {t.back}
                        </button>
                        <button
                            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            on:click={() => paymentForm.handleSubmit()}
                            disabled={isLoading}
                        >
                            {#if isLoading}
                                {t.processing}
                            {:else}
                                {t.pay}
                            {/if}
                        </button>
                    </div>
                </div>
            {:else if $stripeStore.errorMessage}
                <div
                    class="text-red-500 mt-4 p-3 border border-red-300 rounded bg-red-50 dark:bg-red-900 dark:border-red-800"
                >
                    <p class="font-semibold">{t.paymentError}</p>
                    <p>{$stripeStore.errorMessage}</p>
                </div>
                <div class="mt-4">
                    <button
                        class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        on:click={() => bookingStep.set(3)}
                    >
                        {t.back}
                    </button>
                </div>
            {:else}
                <div class="text-red-500 mt-4">
                    {t.paymentInitializationError}
                </div>
                <div class="mt-4">
                    <button
                        class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        on:click={() => bookingStep.set(3)}
                    >
                        {t.back}
                    </button>
                </div>
            {/if}
        </div>
    </div>
</div>
