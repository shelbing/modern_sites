<script>
    import { offersData } from "../../stores/offersStore";
    import { formTranslations } from "../../lib/translations";
    import OfferCard from "./OfferCard.svelte";
    import NoOffersAvailable from "./NoOffersAvailable.svelte";

    export let language;

    $: t = formTranslations[language] || formTranslations.en;
</script>

<div class="mt-8">
    {#if $offersData && $offersData.Bundles.length > 0}
        {#each $offersData.Bundles as offer}
            <OfferCard {offer} {language} />
        {/each}
    {:else}
        <NoOffersAvailable {language} />
    {/if}
</div>
