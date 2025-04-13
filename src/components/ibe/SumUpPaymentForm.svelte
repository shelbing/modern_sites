<script>
    import { onMount } from "svelte";
    import { stripeStore } from "../../stores/stripeStore";
    import { cartStore } from "../../stores/cartStore";
    import { bookingStep } from "../../stores/bookingStore";
    import { formTranslations } from "../../lib/translations/form";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
    export let language;

    $: t = formTranslations[language] || formTranslations.en;

    let isLoading = false;
    let errorMessage = "";

    onMount(async () => {
        if ($stripeStore.provider_specific?.payment_url) {
            isLoading = true;
            try {
                console.log('SumUp checkout data:', $stripeStore.provider_specific);
                
                // Store cart data and checkout ID in localStorage
                localStorage.setItem('booking_cart_data', JSON.stringify($cartStore));
                localStorage.setItem('sumup_checkout_id', $stripeStore.provider_specific.checkout_id);

                // Redirect to SumUp checkout
                window.location.href = $stripeStore.provider_specific.payment_url;
            } catch (error) {
                console.error('Error redirecting to SumUp:', error);
                errorMessage = error.message || 'Failed to redirect to payment page';
                isLoading = false;
            }
        } else {
            console.error('Missing SumUp checkout data:', $stripeStore);
            errorMessage = "Payment setup incomplete. Please try again.";
        }
    });
</script>

<div class="mt-8">
    {#if errorMessage}
        <div class="text-red-500 mb-4">
            {errorMessage}
        </div>
    {/if}

    {#if isLoading}
        <div class="text-center">
            <div class="spinner"></div>
            <p>{t.redirecting_to_payment}</p>
        </div>
    {/if}
</div>

<style>
    .spinner {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 20px auto;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>
