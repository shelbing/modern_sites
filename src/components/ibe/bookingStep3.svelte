<script>
    import CartConfirmation from "./CartConfirmation.svelte";
    import PersonalDataForm from "./PersonalDataForm.svelte";
    import TotalPrice from "./TotalPrice.svelte";
    import { formTranslations } from "../../lib/translations";
    import { bookingStep } from "../../stores/bookingStore";
    import { cartStore } from "../../stores/cartStore";
    import { personalDataStore } from "../../stores/personalDataStore";
    import { v4 as uuidv4 } from "uuid";
    import { onMount } from "svelte";

    export let language;

    $: t = formTranslations[language] || formTranslations.en;

    let error = null;
    let bookingId = null;

    // Generate a booking ID only if it doesn't exist or cart content changes
    function ensureBookingId() {
        const currentCart = $cartStore;

        // Check if we need to generate a new booking ID
        if (!bookingId || !currentCart.bookingId) {
            bookingId = uuidv4();
            console.log("Generated new booking ID:", bookingId);

            // Update cart store with the booking ID
            cartStore.update((cart) => ({
                ...cart,
                bookingId: bookingId,
            }));
        }
    }

    // Ensure booking ID exists when component mounts
    onMount(() => {
        ensureBookingId();
    });

    async function handlePersonalDataSubmit() {
        if (!$personalDataStore.isValid) {
            error = t.fillRequiredFields;
            return;
        }

        // Ensure we have a booking ID
        ensureBookingId();

        // Update cartStore with personal data
        cartStore.update((currentCart) => ({
            ...currentCart,
            personalData: $personalDataStore,
            booking: {
                ...(currentCart.booking || {}),
                bookingId: bookingId,
            },
        }));

        // Log the updated cart for verification
        console.log(
            "Updated cart with personal data and booking ID:",
            $cartStore,
        );

        // Proceed to next step
        bookingStep.set(4);
    }
</script>

<div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-8 text-text-light dark:text-text-dark">
        {t.confirmBooking}
    </h1>

    {#if error}
        <div
            class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
        >
            <strong class="font-bold">Error:</strong>
            <span class="block sm:inline"> {error}</span>
        </div>
    {/if}

    <!-- Booking Summary -->
    <div class="mb-8">
        <CartConfirmation {language} />
    </div>

    <!-- Price Summary -->
    <div class="mb-8">
        <h2 class="text-2xl font-bold mb-6 text-text-light dark:text-text-dark">
            {t.priceSummary}
        </h2>
        <TotalPrice {language} />
    </div>

    <!-- Personal Data Form -->
    <div class="mb-8">
        <h2 class="text-2xl font-bold mb-6 text-text-light dark:text-text-dark">
            {t.personalData}
        </h2>
        <div class="space-y-6">
            <PersonalDataForm {language} />

            <!-- Navigation Buttons -->
            <div class="flex justify-between items-center pt-4">
                <button
                    class="px-6 py-3 border border-gray-300 bg-secondarybutton-light text-secondarybuttontext-light dark:bg-secondarybutton-dark dark:text-secondarybuttontext-dark rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-secondary-light dark:focus:ring-secondary-dark focus:ring-offset-2"
                    on:click={() => bookingStep.set(2)}
                >
                    {t.back}
                </button>
                <button
                    class="px-6 py-3 bg-primarybutton-light text-primarybuttontext-light dark:bg-primarybutton-dark dark:text-primarybuttontext-dark rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    on:click={handlePersonalDataSubmit}
                >
                    {t.continueToPayment}
                </button>
            </div>
        </div>
    </div>
</div>
