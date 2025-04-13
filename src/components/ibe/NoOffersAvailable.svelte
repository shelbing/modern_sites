<script>
    import { noOffersTranslations } from "../../lib/translations/noOffers";
    import { bookingStep } from "../../stores/bookingStore";

    export let lang = "de";
    $: t = noOffersTranslations[lang] || noOffersTranslations.en;
</script>

<div class="min-h-[60vh] flex flex-col items-center justify-center px-4 xl:px-0">
    <!-- Content Container with Card Effect -->
    <div class="w-full max-w-screen-lg mx-auto">
        <div class="bg-background-light dark:bg-background-dark rounded-xl p-8 shadow-md border border-inputBorder-light dark:border-inputBorder-dark text-center">
            <div class="max-w-screen-md mx-auto">
                <!-- Icon -->
                <div class="mb-6 text-primarybutton-light dark:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                <!-- Title -->
                <h2 class="text-3xl font-bold text-sectionheader-light dark:text-sectionheader-dark mb-4">
                    {t.searchForOffers}
                </h2>

                <!-- Message -->
                <p class="text-lg text-text-light dark:text-text-dark">
                    {t.searchForOffersDescription}
                </p>
            </div>
        </div>
    </div>
</div>
