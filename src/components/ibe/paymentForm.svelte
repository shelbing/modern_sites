<script>
    import { onMount } from "svelte";
    import { loadStripe } from "@stripe/stripe-js";
    import { getPublicConfig } from "../../lib/env";
    import { stripeStore } from "../../stores/stripeStore";
    import { cartStore } from "../../stores/cartStore";
    import { bookingStep } from "../../stores/bookingStore";
    import { formTranslations } from "../../lib/translations/form";
    import { createEventDispatcher } from "svelte";
    import SumUpPaymentForm from "./SumUpPaymentForm.svelte";

    const dispatch = createEventDispatcher();
    export let language;

    $: t = formTranslations[language] || formTranslations.en;

    let stripe;
    let elements;
    let isLoading = false;
    let errorMessage = "";

    onMount(async () => {
        if ($stripeStore.payment_provider === "stripe") {
            // Use the public key from the environment variable
            const stripeKey = import.meta.env.PUBLIC_STRIPE_KEY;
            console.log("Initializing Stripe with key:", stripeKey);
            stripe = await loadStripe(stripeKey);

            elements = stripe.elements({
                clientSecret: $stripeStore.clientSecret,
            });
            const paymentElement = elements.create("payment");
            paymentElement.mount("#payment-element");
        } else if ($stripeStore.payment_provider === "sumup") {
            // For SumUp, we need to ensure the provider_specific data is in the store
            if (!$stripeStore.provider_specific?.checkout_url) {
                console.error("Missing SumUp checkout data:", $stripeStore);
                errorMessage = "Payment setup incomplete. Please try again.";
            }
        }
    });

    export async function handleSubmit() {
        if ($stripeStore.payment_provider !== "stripe") return;
        if (!stripe || !elements) return;

        isLoading = true;
        errorMessage = "";
        dispatch("submitStart");

        try {
            console.log("=== STRIPE PAYMENT FLOW START ====");
            console.log("Client Secret:", $stripeStore.clientSecret);
            console.log("Payment Intent ID:", $stripeStore.paymentIntentId);
            console.log("Stripe instance initialized:", !!stripe);
            console.log("Elements instance initialized:", !!elements);

            // Get the return URL for after payment completion
            const origin = window.location.origin;
            const returnUrl = `${origin}/booking/confirmation`;
            console.log("Return URL for payment confirmation:", returnUrl);

            // Call Stripe's confirmPayment method with the client secret
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: returnUrl,
                },
                redirect: "if_required",
            });

            // Log the result of the payment confirmation
            console.log("Stripe confirmPayment response:", {
                error,
                paymentIntent,
            });

            if (error) {
                // Handle payment error
                console.error("Stripe payment error:", error);
                console.log("Error code:", error.code);
                console.log("Error message:", error.message);
                console.log("Error type:", error.type);

                throw error;
            } else if (paymentIntent) {
                // Handle successful payment
                console.log("Payment Intent status:", paymentIntent.status);
                console.log("Payment Intent ID:", paymentIntent.id);
                console.log(
                    "Payment method used:",
                    paymentIntent.payment_method,
                );

                // Update store with success status
                stripeStore.update((store) => ({
                    ...store,
                    paymentStatus: paymentIntent.status,
                    bookingReference: $stripeStore.paymentIntentId,
                }));

                console.log(
                    "Store updated with payment status:",
                    paymentIntent.status,
                );

                // If payment is successful, move to next step
                if (paymentIntent.status === "succeeded") {
                    console.log(
                        "Payment succeeded, moving to confirmation step",
                    );
                    bookingStep.set(5);
                } else {
                    console.log(
                        "Payment requires additional action:",
                        paymentIntent.status,
                    );
                    // Handle other payment statuses if needed
                }
            }

            console.log("=== STRIPE PAYMENT FLOW COMPLETE ====");
            isLoading = false;
            dispatch("submitEnd");
        } catch (error) {
            console.error("=== STRIPE PAYMENT ERROR ====");
            console.error("Payment error:", error);
            console.error("Error details:", JSON.stringify(error, null, 2));
            errorMessage =
                error.message ||
                "An unexpected error occurred during payment processing.";
            isLoading = false;
            dispatch("submitEnd");
        }
    }
</script>

<div class="mt-8">
    <div id="payment-element" class="mb-8"></div>
    {#if errorMessage}
        <div class="text-red-500 mb-4">
            {errorMessage}
        </div>
    {/if}
</div>
