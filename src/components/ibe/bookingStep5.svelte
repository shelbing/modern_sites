<script>
    import { cartStore } from "../../stores/cartStore";
    import { stripeStore } from "../../stores/stripeStore";
    import { formTranslations } from "../../lib/translations";

    export let language;
    $: t = formTranslations[language] || formTranslations.en;
</script>

<div class="min-h-screen bg-amber-50 dark:bg-gray-900 py-12">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Success Banner -->
        <div class="bg-emerald-50 dark:bg-emerald-900 rounded-lg shadow-lg p-8 mb-8 text-center border border-emerald-200 dark:border-emerald-700">
            <div class="flex justify-center mb-4">
                <svg class="h-16 w-16 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h1 class="text-4xl font-bold text-emerald-800 dark:text-emerald-200 mb-4">
                {t.thankYou}
            </h1>
            {#if $cartStore?.personalData}
                <p class="text-xl text-emerald-700 dark:text-emerald-300">
                    {t.dear}
                    {$cartStore.personalData.firstName}
                    {$cartStore.personalData.lastName}
                </p>
            {/if}
            <p class="text-lg text-emerald-600 dark:text-emerald-400 mt-2">
                {t.bookingConfirmation}
            </p>
        </div>

        <!-- Main Content -->
        <div class="w-full">
            <!-- Booking Details Section with Shadow -->
            <section class="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-amber-200 dark:border-amber-700 mb-8 max-w-5xl mx-auto w-full">
                <div class="bg-amber-500 dark:bg-amber-600 px-6 py-4">
                    <h2 class="text-2xl font-bold text-white flex items-center">
                        <svg class="h-7 w-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {t.bookingDetails}
                    </h2>
                </div>
                <div class="p-6">
                    <!-- Stay Details & Guest Information -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <!-- Stay Details -->
                        {#if $cartStore?.searchData}
                            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
                                <div class="bg-amber-500 dark:bg-amber-600 px-6 py-4">
                                    <h2 class="text-xl font-semibold text-white flex items-center">
                                        <svg class="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {t.stayDetails}
                                    </h2>
                                </div>
                                <div class="p-6 space-y-4">
                            <div class="flex justify-between items-center">
                                <div>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">{t.checkIn}</p>
                                    <p class="font-semibold">{new Date($cartStore.searchData.startDate).toLocaleDateString()}</p>
                                </div>
                                <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                                <div class="text-right">
                                    <p class="text-sm text-gray-500 dark:text-gray-400">{t.checkOut}</p>
                                    <p class="font-semibold">{new Date($cartStore.searchData.endDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div class="border-t pt-4">
                                <div class="flex justify-between items-center">
                                    <div>
                                        <p class="text-sm text-gray-500 dark:text-gray-400">{t.numberOfAdults}</p>
                                        <p class="font-semibold">{$cartStore.searchData.adults}</p>
                                    </div>
                                    {#if $cartStore.searchData.childrenAges?.length > 0}
                                        <div class="text-right">
                                            <p class="text-sm text-gray-500 dark:text-gray-400">{t.children}</p>
                                            <p class="font-semibold">
                                                {$cartStore.searchData.childrenAges.length}
                                                <span class="text-sm text-gray-500">
                                                    ({$cartStore.searchData.childrenAges.join(', ')} {t.yearsOld})
                                                </span>
                                            </p>
                                        </div>
                                    {/if}
                                </div>
                            </div>
                                </div>
                            </div>
                        {/if}

                        <!-- Guest Information -->
                        {#if $cartStore?.personalData}
                            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
                                <div class="bg-amber-500 dark:bg-amber-600 px-6 py-4">
                                    <h2 class="text-xl font-semibold text-white flex items-center">
                                        <svg class="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        {t.guestInformation}
                                    </h2>
                                </div>
                                <div class="p-6">
                            <div class="space-y-4">
                                <div>
                                    <h3 class="font-semibold text-lg mb-2">{t.mainGuest}</h3>
                                    <div class="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p class="text-gray-500 dark:text-gray-400">{t.name}</p>
                                            <p class="font-medium">{$cartStore.personalData.firstName} {$cartStore.personalData.lastName}</p>
                                        </div>
                                        <div>
                                            <p class="text-gray-500 dark:text-gray-400">{t.email}</p>
                                            <p class="font-medium">{$cartStore.personalData.email}</p>
                                        </div>
                                        <div>
                                            <p class="text-gray-500 dark:text-gray-400">{t.phone}</p>
                                            <p class="font-medium">{$cartStore.personalData.phone}</p>
                                        </div>
                                        <div>
                                            <p class="text-gray-500 dark:text-gray-400">{t.address}</p>
                                            <p class="font-medium">
                                                {$cartStore.personalData.street}<br>
                                                {$cartStore.personalData.postalCode} {$cartStore.personalData.city}<br>
                                                {$cartStore.personalData.country}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {#if $cartStore.personalData.additionalGuests?.length > 0}
                                    <div class="border-t pt-4 mt-4">
                                        <h3 class="font-semibold text-lg mb-2">{t.additionalGuests}</h3>
                                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {#each $cartStore.personalData.additionalGuests as guest, index}
                                                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                                    <p class="text-sm text-gray-500 dark:text-gray-400">
                                                        {guest.isChild ? t.child : t.adultGuest} {index + 2}
                                                        {#if guest.isChild}
                                                            <span class="text-xs">({guest.age} {t.yearsOld})</span>
                                                        {/if}
                                                    </p>
                                                    <p class="font-medium">{guest.firstName} {guest.lastName}</p>
                                                </div>
                                            {/each}
                                        </div>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </div>
                {/if}
                    </div>

                    <!-- Offer & Price Information -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <!-- Selected Offer and Services -->
                        {#if $cartStore?.offer}
                            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
                                <div class="bg-amber-500 dark:bg-amber-600 px-6 py-4">
                                    <h2 class="text-xl font-semibold text-white flex items-center">
                                        <svg class="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        {t.selectedOffer}
                                    </h2>
                                </div>
                                <div class="p-6">
                            <h3 class="text-lg font-semibold mb-4">{$cartStore.offer.Title}</h3>
                            
                            {#if $cartStore.offer.Services?.some(s => s.selected)}
                                <div class="mt-4">
                                    <h4 class="font-semibold text-gray-600 dark:text-gray-300 mb-3">{t.selectedServices}</h4>
                                    <div class="space-y-2">
                                        {#each $cartStore.offer.Services.filter(s => s.selected) as service}
                                            <div class="flex justify-between items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                                <span>{service.Name}</span>
                                                <span class="text-sm">
                                                    {service.Standardpreis}€
                                                    <span class="text-gray-500 dark:text-gray-400">
                                                        ({service.Steuer}% {t.vat})
                                                    </span>
                                                </span>
                                            </div>
                                        {/each}
                                    </div>
                                </div>
                            {/if}
                                </div>
                            </div>
                        {/if}

                        <!-- Price Summary -->
                        {#if $cartStore?.calculatedAmounts}
                            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
                                <div class="bg-amber-500 dark:bg-amber-600 px-6 py-4">
                                    <h2 class="text-xl font-semibold text-white flex items-center">
                                        <svg class="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {t.priceSummary}
                                    </h2>
                                </div>
                                <div class="p-6">
                                    <div class="space-y-4">
                                        <div class="flex justify-between items-center">
                                            <span class="text-gray-600 dark:text-gray-300">{t.totalAmount}</span>
                                            <span class="text-xl font-bold">{$cartStore.calculatedAmounts.total.gross}€</span>
                                        </div>
                                        <div class="flex justify-between items-center border-t pt-4">
                                            <span class="text-gray-600 dark:text-gray-300">{t.deposit}</span>
                                            <span class="text-lg font-semibold text-green-600">
                                                {$cartStore.calculatedAmounts.Anzahlung.gross}€
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        {/if}
                    </div>

                    <!-- Comments -->
                    {#if $cartStore?.personalData?.comments}
                        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-8 border border-gray-100 dark:border-gray-700">
                            <div class="bg-amber-500 dark:bg-amber-600 px-6 py-4">
                                <h2 class="text-xl font-semibold text-white flex items-center">
                                    <svg class="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                    </svg>
                                    {t.comments}
                                </h2>
                            </div>
                            <div class="p-6">
                                <p class="text-gray-600 dark:text-gray-300">{$cartStore.personalData.comments}</p>
                            </div>
                        </div>
                    {/if}

                </div>
            </section>
            
            <!-- Email Confirmation Notice -->
            <div class="bg-amber-50 dark:bg-amber-900 rounded-lg p-6 mb-8 text-center border border-amber-200 dark:border-amber-700 max-w-5xl mx-auto w-full">
                <svg class="h-12 w-12 text-amber-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p class="text-amber-800 dark:text-amber-200">
                    {t.confirmationEmail}
                </p>
            </div>

            <!-- Back to Home Button -->
            <div class="text-center max-w-5xl mx-auto w-full">
                <a
                    href="/"
                    class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200"
                >
                    <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    {t.backToHome}
                </a>
            </div>
        </div>
    </div>
</div>
