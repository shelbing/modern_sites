<script>
    import { onMount } from "svelte";
    import { cartStore } from "../../stores/cartStore";
    import { stripeStore } from "../../stores/stripeStore";
    import { bookingStep } from "../../stores/bookingStore";
    import { offersData, offersLastUpdated } from "../../stores/offersStore";
    import { formData } from "../../stores/formStore";
    import { personalDataStore } from "../../stores/personalDataStore";
    import { bundles, bundlesLoading, bundlesError, bundlesLastUpdated } from '../../stores/bundlesStore';
    import { availability, availabilityLastUpdated } from '../../stores/availability';
    import { rooms, roomsLoading, roomsError, roomsLastUpdated } from '../../stores/roomsStore';
    import { services, servicesLoading, servicesError, servicesLastUpdated } from '../../stores/servicesStore';

    let isVisible = false;
    let showBookingStep = true;
    let showCartStore = true;
    let showStripeStore = true;
    let showOffersStore = true;
    let showFormStore = true;
    let showPersonalDataStore = true;
    let showBundlesStore = true;
    let showAvailabilityStore = true;
    let showRoomsStore = true;
    let showServicesStore = true;

    onMount(() => {
        const handleKeyPress = (e) => {
            // Toggle with Ctrl+Shift+D
            if (e.ctrlKey && e.shiftKey && e.key === "D") {
                e.preventDefault();
                isVisible = !isVisible;
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    });

    function formatValue(value) {
        try {
            return JSON.stringify(value, null, 2);
        } catch (e) {
            return "Error formatting value";
        }
    }

    // Function to copy store contents to clipboard
    async function copyToClipboard() {
        const storeContents = {
            bookingStep: $bookingStep,
            cartStore: $cartStore,
            stripeStore: $stripeStore,
            offersStore: $offersData,
            formStore: $formData,
            personalDataStore: $personalDataStore,
            bundlesStore: $bundles,
            bundlesLoading: $bundlesLoading,
            bundlesError: $bundlesError,
            bundlesLastUpdated: $bundlesLastUpdated,
            availability: $availability,
            availabilityLastUpdated: $availabilityLastUpdated,
            rooms: $rooms,
            roomsLoading: $roomsLoading,
            roomsError: $roomsError,
            roomsLastUpdated: $roomsLastUpdated,
            services: $services,
            servicesLoading: $servicesLoading,
            servicesError: $servicesError,
            servicesLastUpdated: $servicesLastUpdated,
            timestamp: new Date().toISOString(),
        };

        try {
            await navigator.clipboard.writeText(
                JSON.stringify(storeContents, null, 2),
            );
            alert("Store contents copied to clipboard!");
        } catch (e) {
            console.error("Failed to copy to clipboard:", e);
        }
    }
</script>

{#if isVisible}
    <div
        class="fixed bottom-4 right-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-2xl max-h-[80vh] overflow-y-auto"
    >
        <!-- Store indicators at the top -->
        <div class="flex justify-between items-center mb-4 pb-2 border-b">
            <div class="flex space-x-4">
                <!-- Loading indicator -->
                <div class="flex items-center space-x-2">
                    <span class="text-xs text-gray-600">Loading:</span>
                    <div class="flex items-center space-x-1">
                        <div class={`w-3 h-3 rounded-full ${!$bundlesLoading ? 'bg-green-500' : 'bg-yellow-500'}`}
                             title={$bundlesLoading ? 'Loading bundles' : 'Not loading'}></div>
                        <div class={`w-3 h-3 rounded-full ${!$roomsLoading ? 'bg-green-500' : 'bg-yellow-500'}`}
                             title={$roomsLoading ? 'Loading rooms' : 'Not loading'}></div>
                        <div class={`w-3 h-3 rounded-full ${!$servicesLoading ? 'bg-green-500' : 'bg-yellow-500'}`}
                             title={$servicesLoading ? 'Loading services' : 'Not loading'}></div>
                    </div>
                </div>

                <!-- Error indicator -->
                <div class="flex items-center space-x-2">
                    <span class="text-xs text-gray-600">Status:</span>
                    <div class="flex items-center space-x-1">
                        <div class={`w-3 h-3 rounded-full ${$bundlesError ? 'bg-red-500' : 'bg-green-500'}`}
                             title={$bundlesError ? 'Error loading bundles' : 'No errors'}></div>
                        <div class={`w-3 h-3 rounded-full ${$roomsError ? 'bg-red-500' : 'bg-green-500'}`}
                             title={$roomsError ? 'Error loading rooms' : 'No errors'}></div>
                        <div class={`w-3 h-3 rounded-full ${$servicesError ? 'bg-red-500' : 'bg-green-500'}`}
                             title={$servicesError ? 'Error loading services' : 'No errors'}></div>
                    </div>
                </div>
            </div>

            <!-- Toggle buttons moved to right -->
            <div class="flex space-x-2">
                <button
                    on:click={copyToClipboard}
                    class="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                    Copy
                </button>
                <button
                    on:click={() => (isVisible = false)}
                    class="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 transition-colors"
                >
                    Hide
                </button>
            </div>
        </div>

        <div class="mb-4 flex flex-wrap gap-2">
            <button
                on:click={() => (showBookingStep = !showBookingStep)}
                class="text-xs {showBookingStep
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-gray-300 hover:bg-gray-400'} text-white px-2 py-1 rounded transition-colors"
            >
                Toggle Booking Step
            </button>
            <button
                on:click={() => (showCartStore = !showCartStore)}
                class="text-xs {showCartStore
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-gray-300 hover:bg-gray-400'} text-white px-2 py-1 rounded transition-colors"
            >
                Toggle Cart Store
            </button>
            <button
                on:click={() => (showStripeStore = !showStripeStore)}
                class="text-xs {showStripeStore
                    ? 'bg-purple-500 hover:bg-purple-600'
                    : 'bg-gray-300 hover:bg-gray-400'} text-white px-2 py-1 rounded transition-colors"
            >
                Toggle Stripe Store
            </button>
            <button
                on:click={() => (showOffersStore = !showOffersStore)}
                class="text-xs {showOffersStore
                    ? 'bg-orange-500 hover:bg-orange-600'
                    : 'bg-gray-300 hover:bg-gray-400'} text-white px-2 py-1 rounded transition-colors"
            >
                Toggle Offers Store
            </button>
            <button
                on:click={() => (showFormStore = !showFormStore)}
                class="text-xs {showFormStore
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-gray-300 hover:bg-gray-400'} text-white px-2 py-1 rounded transition-colors"
            >
                Toggle Form Store
            </button>
            <button
                on:click={() => (showPersonalDataStore = !showPersonalDataStore)}
                class="text-xs {showPersonalDataStore
                    ? 'bg-pink-500 hover:bg-pink-600'
                    : 'bg-gray-300 hover:bg-gray-400'} text-white px-2 py-1 rounded transition-colors"
            >
                Toggle Personal Data Store
            </button>
            <button
                on:click={() => (showBundlesStore = !showBundlesStore)}
                class="text-xs {showBundlesStore
                    ? 'bg-yellow-500 hover:bg-yellow-600'
                    : 'bg-gray-300 hover:bg-gray-400'} text-white px-2 py-1 rounded transition-colors"
            >
                Toggle Bundles Store
            </button>
            <button
                on:click={() => (showAvailabilityStore = !showAvailabilityStore)}
                class="text-xs {showAvailabilityStore
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-300 hover:bg-gray-400'} text-white px-2 py-1 rounded transition-colors"
            >
                Toggle Availability Store
            </button>
            <button
                on:click={() => (showRoomsStore = !showRoomsStore)}
                class="text-xs {showRoomsStore
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-300 hover:bg-gray-400'} text-white px-2 py-1 rounded transition-colors"
            >
                Toggle Rooms Store
            </button>
            <button
                on:click={() => (showServicesStore = !showServicesStore)}
                class="text-xs {showServicesStore
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-300 hover:bg-gray-400'} text-white px-2 py-1 rounded transition-colors"
            >
                Toggle Services Store
            </button>
        </div>

        <div class="space-y-4">
            {#if showBookingStep}
                <div class="border-t pt-2">
                    <h4 class="font-semibold text-blue-600">
                        Booking Step: {$bookingStep}
                    </h4>
                </div>
            {/if}

            {#if showCartStore}
                <div class="border-t pt-2">
                    <h4 class="font-semibold text-green-600">Cart Store:</h4>
                    <pre
                        class="text-xs bg-gray-50 dark:bg-gray-900 p-2 rounded overflow-x-auto whitespace-pre-wrap break-words">
                        {formatValue($cartStore)}
                    </pre>
                </div>
            {/if}

            {#if showStripeStore}
                <div class="border-t pt-2">
                    <h4 class="font-semibold text-purple-600">Stripe Store:</h4>
                    <pre
                        class="text-xs bg-gray-50 dark:bg-gray-900 p-2 rounded overflow-x-auto whitespace-pre-wrap break-words">
                        {formatValue($stripeStore)}
                    </pre>
                </div>
            {/if}

            {#if showOffersStore}
                <div class="border-t pt-2">
                    <h4 class="font-semibold text-blue-600 flex justify-between items-center">
                        <span>Offers Data</span>
                        <button
                            class="text-sm text-gray-500 hover:text-gray-700"
                            on:click={() => (showOffersStore = false)}
                        >
                            Hide
                        </button>
                    </h4>
                    <div class="text-xs text-gray-500 mt-1">Last updated: {$offersLastUpdated || 'Never'}</div>
                    <pre class="text-sm mt-2 overflow-x-auto">
                        {JSON.stringify($offersData, null, 2)}
                    </pre>
                </div>
            {/if}

            {#if showFormStore}
                <div class="border-t pt-2">
                    <h4 class="font-semibold text-red-600">Form Store:</h4>
                    <pre
                        class="text-xs bg-gray-50 dark:bg-gray-900 p-2 rounded overflow-x-auto whitespace-pre-wrap break-words">
                        {formatValue($formData)}
                    </pre>
                </div>
            {/if}

            {#if showPersonalDataStore}
                <div class="border-t pt-2">
                    <h4 class="font-semibold text-pink-600">Personal Data Store:</h4>
                    <pre
                        class="text-xs bg-gray-50 dark:bg-gray-900 p-2 rounded overflow-x-auto whitespace-pre-wrap break-words">
                        {formatValue($personalDataStore)}
                    </pre>
                </div>
            {/if}

            {#if showBundlesStore}
                <div class="border-t pt-2">
                    <h4 class="font-semibold text-blue-600 flex justify-between items-center">
                        <span>Bundles Data {$bundlesLoading ? '(Loading...)' : ''}</span>
                        <button
                            class="text-sm text-gray-500 hover:text-gray-700"
                            on:click={() => (showBundlesStore = false)}
                        >
                            Hide
                        </button>
                    </h4>
                    {#if $bundlesError}
                        <div class="text-red-500 text-sm mt-2">Error: {$bundlesError}</div>
                    {/if}
                    <div class="text-xs text-gray-500 mt-1">Last updated: {$bundlesLastUpdated || 'Never'}</div>
                    <pre class="text-sm mt-2 overflow-x-auto">
                        {JSON.stringify($bundles, null, 2)}
                    </pre>
                </div>
            {/if}

            {#if showAvailabilityStore}
                <div class="border-t pt-2">
                    <h4 class="font-semibold text-blue-600 flex justify-between items-center">
                        <span>Availability Data</span>
                        <button
                            class="text-sm text-gray-500 hover:text-gray-700"
                            on:click={() => (showAvailabilityStore = false)}
                        >
                            Hide
                        </button>
                    </h4>
                    <div class="text-xs text-gray-500 mt-1">Last updated: {$availabilityLastUpdated || 'Never'}</div>
                    <pre class="text-sm mt-2 overflow-x-auto">
                        {JSON.stringify($availability, null, 2)}
                    </pre>
                </div>
            {/if}

            {#if showRoomsStore}
                <div class="border-t pt-2">
                    <h4 class="font-semibold text-blue-600 flex justify-between items-center">
                        <span>Rooms Data {$roomsLoading ? '(Loading...)' : ''}</span>
                        <button
                            class="text-sm text-gray-500 hover:text-gray-700"
                            on:click={() => (showRoomsStore = false)}
                        >
                            Hide
                        </button>
                    </h4>
                    {#if $roomsError}
                        <div class="text-red-500 text-sm mt-2">Error: {$roomsError}</div>
                    {/if}
                    <div class="text-xs text-gray-500 mt-1">Last updated: {$roomsLastUpdated || 'Never'}</div>
                    <pre class="text-sm mt-2 overflow-x-auto">
                        {JSON.stringify($rooms, null, 2)}
                    </pre>
                </div>
            {/if}

            {#if showServicesStore}
                <div class="border-t pt-2">
                    <h4 class="font-semibold text-blue-600 flex justify-between items-center">
                        <span>Services Data {$servicesLoading ? '(Loading...)' : ''}</span>
                        <button
                            class="text-sm text-gray-500 hover:text-gray-700"
                            on:click={() => (showServicesStore = false)}
                        >
                            Hide
                        </button>
                    </h4>
                    {#if $servicesError}
                        <div class="text-red-500 text-sm mt-2">Error: {$servicesError}</div>
                    {/if}
                    <div class="text-xs text-gray-500 mt-1">Last updated: {$servicesLastUpdated || 'Never'}</div>
                    <pre class="text-sm mt-2 overflow-x-auto">
                        {JSON.stringify($services, null, 2)}
                    </pre>
                </div>
            {/if}
        </div>

        <div class="mt-4 text-xs text-gray-500">
            <div>Last updated: {new Date().toLocaleTimeString()}</div>
            <div class="italic">Press Ctrl+Shift+D to toggle</div>
        </div>
    </div>
{/if}

<style>
    /* Ensure proper text wrapping in pre elements */
    pre {
        white-space: pre-wrap !important;
        word-wrap: break-word !important;
    }
</style>
