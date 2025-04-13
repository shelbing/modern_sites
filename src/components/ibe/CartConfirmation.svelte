<script>
    import { cartStore } from "../../stores/cartStore";
    import { formTranslations } from "../../lib/translations";
    import { renderRichText } from "@storyblok/js";
    import { Icon } from "svelte-awesome";
    import { calendar, users, bed, tag } from "svelte-awesome/icons";

    export let language;

    $: t = formTranslations[language] || formTranslations.en;
    $: renderedRoomDescription = $cartStore?.room?.Beschreibung?.content
        ? renderRichText($cartStore.room.Beschreibung)
        : "";
    $: renderedOfferDescription = $cartStore?.offer?.Beschreibung?.content
        ? renderRichText($cartStore.offer.Beschreibung)
        : "";

    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat(language, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }

    function formatPrice(amount, currency = 'EUR') {
        if (!amount) return '';
        return new Intl.NumberFormat(language, {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    // Calculate number of nights from booking dates
    $: numberOfNights = $cartStore?.booking 
        ? Math.ceil((new Date($cartStore.booking.departure) - new Date($cartStore.booking.arrival)) / (1000 * 60 * 60 * 24))
        : 0;
</script>

<div class="bg-background-light dark:bg-background-dark shadow-lg rounded-lg overflow-hidden">
    <!-- Header -->
    <div class="bg-paper-light dark:bg-paper-dark p-4 border-b border-inputBorder-light dark:border-inputBorder-dark">
        <h2 class="text-h4 font-semibold text-sectionheader-light dark:text-sectionheader-dark">{t.bookingSummary}</h2>
    </div>

    {#if $cartStore}
        <!-- Main Content -->
        <div class="p-4 space-y-6">
            <!-- Offer Details -->
            {#if $cartStore.offer}
                <div class="bg-paper-light dark:bg-paper-dark p-3 rounded-lg">
                    <div class="flex items-center mb-4">
                        <Icon data={tag} class="w-5 h-5 text-primarybutton-light dark:text-primarybutton-dark mr-2" />
                        <h3 class="text-h6 font-semibold">{t.selectedOffer}</h3>
                    </div>
                    <div class="prose dark:prose-invert max-w-none mb-4">
                        <h4 class="text-h5 font-medium text-sectionheader-light dark:text-sectionheader-dark mb-2">
                            {$cartStore.offer.Title}
                        </h4>
                        {@html renderedOfferDescription}
                    </div>
                    {#if $cartStore.offer.TeaserImage?.filename}
                        <img 
                            src={$cartStore.offer.TeaserImage.filename} 
                            alt={$cartStore.offer.Title}
                            class="w-full h-48 object-cover rounded-lg mt-4"
                        />
                    {/if}
                </div>
            {/if}

            <!-- Dates and Guests Section -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-paper-light dark:bg-paper-dark p-3 rounded-lg">
                    <div class="flex items-center mb-4">
                        <Icon data={calendar} class="w-5 h-5 text-primarybutton-light dark:text-primarybutton-dark mr-2" />
                        <h3 class="text-h6 font-semibold">{t.dates}</h3>
                    </div>
                    <div class="space-y-2">
                        <p class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-300">{t.checkIn}</span>
                            <span class="font-medium">{formatDate($cartStore.booking?.arrival)}</span>
                        </p>
                        <p class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-300">{t.checkOut}</span>
                            <span class="font-medium">{formatDate($cartStore.booking?.departure)}</span>
                        </p>
                        <p class="flex justify-between mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                            <span class="text-gray-600 dark:text-gray-300">{t.duration}</span>
                            <span class="font-medium">{numberOfNights} {numberOfNights === 1 ? t.night : t.nights}</span>
                        </p>
                    </div>
                </div>

                <div class="bg-paper-light dark:bg-paper-dark p-3 rounded-lg">
                    <div class="flex items-center mb-4">
                        <Icon data={users} class="w-5 h-5 text-primarybutton-light dark:text-primarybutton-dark mr-2" />
                        <h3 class="text-h6 font-semibold">{t.guests}</h3>
                    </div>
                    <div class="space-y-2">
                        <p class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-300">{t.adults}</span>
                            <span class="font-medium">{$cartStore.searchData.adults}</span>
                        </p>
                        {#if $cartStore.searchData.childrenCount > 0}
                            <p class="flex justify-between">
                                <span class="text-gray-600 dark:text-gray-300">{t.children}</span>
                                <span class="font-medium">{$cartStore.searchData.childrenCount}</span>
                            </p>
                        {/if}
                    </div>
                </div>
            </div>

            <!-- Room Details -->
            {#if $cartStore.room}
                <div class="bg-paper-light dark:bg-paper-dark p-3 rounded-lg">
                    <div class="flex items-center mb-4">
                        <Icon data={bed} class="w-5 h-5 text-primarybutton-light dark:text-primarybutton-dark mr-2" />
                        <h3 class="text-h6 font-semibold">{$cartStore.room.Title}</h3>
                    </div>
                    {#if $cartStore.room.Image?.filename}
                        <img 
                            src={$cartStore.room.Image.filename} 
                            alt={$cartStore.room.Title}
                            class="w-full h-48 object-cover rounded-lg mb-4"
                        />
                    {/if}
                    {#if $cartStore.room.TagLine}
                        <p class="text-gray-600 dark:text-gray-400 mb-4 italic">
                            {$cartStore.room.TagLine}
                        </p>
                    {/if}
                    <div class="prose dark:prose-invert max-w-none mb-4">
                        {@html renderedRoomDescription}
                    </div>
                    <div class="text-body-sm text-gray-600 dark:text-gray-300 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <p class="flex justify-between">
                            <span>{t.size}</span>
                            <span>{$cartStore.room.Groesse} m²</span>
                        </p>
                        {#if $cartStore.ratePlan?.name}
                            <p class="flex justify-between mt-2">
                                <span>{t.rate}</span>
                                <span>{$cartStore.ratePlan.name}</span>
                            </p>
                        {/if}
                    </div>
                </div>
            {/if}
        </div>
    {:else}
        <div class="p-4">
            <p class="text-sm text-textSecondary-light dark:text-textSecondary-dark">{t.noBookingData}</p>
        </div>
    {/if}
</div>

<style>
    :global(.prose) {
        max-width: none;
    }
    :global(.prose p) {
        margin-bottom: 0.5em;
    }
</style>
