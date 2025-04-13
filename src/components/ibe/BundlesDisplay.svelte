<script>
    import { bundles } from '../../stores/bundlesStore';
    export let kategorie;
    export let language = 'de';

    const translations = {
        bookNow: {
            de: 'Jetzt buchen',
            en: 'Book now',
            fr: 'Réserver',
            it: 'Prenota ora'
        },
        availableFrom: {
            de: 'Buchbar ab',
            en: 'Available from',
            fr: 'Disponible à partir du',
            it: 'Disponibile dal'
        },
        availableUntil: {
            de: 'Buchbar bis',
            en: 'Available until',
            fr: 'Disponible jusqu\'au',
            it: 'Disponibile fino al'
        },
        minStay: {
            de: 'Mindestaufenthalt',
            en: 'Minimum stay',
            fr: 'Séjour minimum',
            it: 'Soggiorno minimo'
        },
        maxStay: {
            de: 'Höchstaufenthalt',
            en: 'Maximum stay',
            fr: 'Séjour maximum',
            it: 'Soggiorno massimo'
        },
        nights: {
            de: 'Nächte',
            en: 'nights',
            fr: 'nuits',
            it: 'notti'
        },
        includedServices: {
            de: 'Inkludierte Leistungen',
            en: 'Included services',
            fr: 'Services inclus',
            it: 'Servizi inclusi'
        },
        availableServices: {
            de: 'Verfügbare Zusatzleistungen',
            en: 'Available additional services',
            fr: 'Services supplémentaires disponibles',
            it: 'Servizi aggiuntivi disponibili'
        }
    };

    const serviceTranslations = {
        '4GANG': {
            de: '4-Gang Menü',
            en: '4-course menu',
            fr: 'Menu 4 plats',
            it: 'Menu di 4 portate'
        },
        'HP': {
            de: 'Halbpension',
            en: 'Half board',
            fr: 'Demi-pension',
            it: 'Mezza pensione'
        },
        'AM': {
            de: 'À la carte Menü',
            en: 'À la carte menu',
            fr: 'Menu à la carte',
            it: 'Menu à la carte'
        },
        'SM': {
            de: 'Spa Massage',
            en: 'Spa massage',
            fr: 'Massage spa',
            it: 'Massaggio spa'
        }
    };

    $: t = (key) => translations[key]?.[language] || translations[key]?.['de'];
    
    function translateService(service) {
        return serviceTranslations[service]?.[language] || service;
    }

    $: filteredBundles = $bundles?.filter(bundle => 
        bundle.Aktiviert && (!kategorie || bundle.Kategorie === kategorie)
    ) || [];

    function handleBooking(bundle) {
        // TODO: Implement booking logic
        console.log('Booking bundle:', bundle.BundleCode);
    }
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each filteredBundles as bundle}
        <div class="bundle-card bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col">
            <div class="flex-none">
                <h3 class="text-xl font-bold p-4 h-20 flex items-center text-gray-900 dark:text-gray-100">{bundle.Title}</h3>
                {#if bundle.TeaserImage?.filename}
                    <div class="h-48">
                        <img src={bundle.TeaserImage.filename} 
                             alt={bundle.Title} 
                             class="w-full h-full object-cover" />
                    </div>
                {/if}
            </div>
            
            <div class="flex-grow flex flex-col">
                <div class="h-32 p-4 text-gray-700 dark:text-gray-200 description-text text-sm overflow-y-auto">
                    {#if bundle.Beschreibung?.content?.[0]?.content?.[0]?.text}
                        {bundle.Beschreibung.content[0].content[0].text}
                    {/if}
                </div>

                <div class="h-24 p-4 text-sm border-t border-gray-200 dark:border-gray-700">
                    <div class="flex justify-between mb-2">
                        <span class="text-gray-700 dark:text-gray-200">{t('minStay')}:</span>
                        <span class="text-gray-900 dark:text-gray-100">{bundle.Mindestaufenthalt || 1} {t('nights')}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-700 dark:text-gray-200">{t('maxStay')}:</span>
                        <span class="text-gray-900 dark:text-gray-100">{bundle.Hoechstaufenthalt || 99} {t('nights')}</span>
                    </div>
                </div>

                <div class="p-4 border-t border-gray-200 dark:border-gray-700">
                    {#if bundle.IncludedServices}
                        <div class="text-sm mb-3">
                            <div class="font-medium mb-1 text-gray-900 dark:text-gray-100">{t('includedServices')}:</div>
                            <div class="flex flex-wrap gap-2">
                                {#each bundle.IncludedServices.split(',') as service}
                                    <span class="bg-blue-100 dark:bg-blue-800 text-blue-900 dark:text-blue-100 px-2 py-1 rounded-md text-xs">
                                        {translateService(service)}
                                    </span>
                                {/each}
                            </div>
                        </div>
                    {/if}

                    {#if bundle.AvailableServices}
                        <div class="text-sm">
                            <div class="font-medium mb-1 text-gray-900 dark:text-gray-100">{t('availableServices')}:</div>
                            <div class="flex flex-wrap gap-2">
                                {#each bundle.AvailableServices.split(',') as service}
                                    <span class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-2 py-1 rounded-md text-xs">
                                        {translateService(service)}
                                    </span>
                                {/each}
                            </div>
                        </div>
                    {/if}
                </div>

                {#if bundle.BuchenVon || bundle.BuchenBis}
                    <div class="p-4 text-sm text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700">
                        {#if bundle.BuchenVon}
                            <div class="mb-1">{t('availableFrom')}: {new Date(bundle.BuchenVon).toLocaleDateString(language)}</div>
                        {/if}
                        {#if bundle.BuchenBis}
                            <div>{t('availableUntil')}: {new Date(bundle.BuchenBis).toLocaleDateString(language)}</div>
                        {/if}
                    </div>
                {/if}

                <div class="p-4 mt-auto border-t border-gray-200 dark:border-gray-700">
                    <button
                        on:click={() => handleBooking(bundle)}
                        class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:focus:ring-blue-400"
                    >
                        {t('bookNow')}
                    </button>
                </div>
            </div>
        </div>
    {/each}
</div>

<style>
    .bundle-card {
        @apply rounded-lg overflow-hidden;
    }

    :global(.dark) .bundle-card {
        @apply ring-1 ring-gray-700;
    }

    .description-text {
        hyphens: auto;
        -webkit-hyphens: auto;
        -ms-hyphens: auto;
        text-align: justify;
        line-height: 1.4;
    }

    /* Hide scrollbar for Chrome, Safari and Opera */
    .overflow-y-auto::-webkit-scrollbar {
        display: none;
    }

    /* Hide scrollbar for IE, Edge and Firefox */
    .overflow-y-auto {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
    }

    /* Add language-specific hyphenation */
    :global([lang="de"]) .description-text {
        lang: de;
    }

    :global([lang="en"]) .description-text {
        lang: en;
    }

    :global([lang="fr"]) .description-text {
        lang: fr;
    }

    :global([lang="it"]) .description-text {
        lang: it;
    }
</style>
