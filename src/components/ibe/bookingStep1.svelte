<script>
    import OfferList from "./offerList.svelte";
    import { offersData } from "../../stores/offersStore";
    import { formTranslations } from "../../lib/translations";
    import { stripeStore } from "../../stores/stripeStore";
    import { onMount } from "svelte";
    import OffersLoader from './OffersLoader.svelte';
    import AvailabilityLoader from './AvailabilityLoader.svelte';
    import NoOffersAvailable from './NoOffersAvailable.svelte';

    export let language;
    $: t = formTranslations[language] || formTranslations.en;

    onMount(() => {
        // Reset stripe store to initial state
        stripeStore.set({
            clientSecret: null,
            paymentIntentId: null,
            paymentStatus: null,
            bookingReference: null,
            bookingId: null,
            availablePaymentMethods: [],
        });
    });
</script>

<OffersLoader lang={language} />
<AvailabilityLoader />

<section
    class="bg-background-light dark:bg-background-dark my-2 flex justify-around items-center"
>
    <div class="w-full">
        {#if $offersData}
            <div class="container mx-auto p-3">
                <h2
                    class="mb-3 font-serif text-2xl font-bold text-sectionheader-light dark:text-sectionheader-dark md:px-16 lg:px-30 xl:px-40"
                >
                    {t.bestOffers}
                </h2>
                <p
                    class="font-serif text-xl font-bold text-sectionsubheader-light md:px-16 lg:px-30 xl:px-40 dark:text-sectionsubheader-dark mb-3"
                >
                    <OfferList {language} />
                </p>
            </div>
        {:else}
            <NoOffersAvailable lang={language} />
        {/if}
    </div>
</section>
